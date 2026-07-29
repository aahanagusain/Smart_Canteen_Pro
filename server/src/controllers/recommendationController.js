const Restaurant = require('../models/Restaurant')

const getRecommendations = async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in to get recommendations.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  const isMockMode = apiKey === 'mock_key'

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(400).json({
      message: 'Gemini API key is not configured on the server. Please add GEMINI_API_KEY to your server/.env file, or set GEMINI_API_KEY=mock_key to run in demo/mock mode.'
    })
  }

  const { mood, category, maxCalories, minProtein } = req.body

  try {
    // 1. Fetch all restaurants and their menus from database
    const restaurants = await Restaurant.find({})
    
    // 2. Compile flat list of dishes with restaurant details
    const availableDishes = []
    restaurants.forEach((restaurant) => {
      if (restaurant.menu && restaurant.menu.length > 0) {
        restaurant.menu.forEach((dish) => {
          availableDishes.push({
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            name: dish.name,
            price: dish.price,
            calories: dish.calories || 0,
            protein: dish.protein || 0,
            carbs: dish.carbs || 0,
            fats: dish.fats || 0,
            image: dish.image || ''
          })
        })
      }
    })

    if (availableDishes.length === 0) {
      return res.status(404).json({ message: 'No dishes are currently available in the database to recommend.' })
    }

    // Demo Mode Bypass: Filters dishes in-memory and generates mock AI rationale
    if (isMockMode) {
      console.log('Running in demo/mock mode for recommendations');
      const filtered = availableDishes.filter((dish) => {
        let match = true
        if (maxCalories && dish.calories > maxCalories) match = false
        if (minProtein && dish.protein < minProtein) match = false
        return match
      })

      // Get up to 3 dishes
      const selectedDishes = filtered.length > 0 ? filtered : availableDishes.slice(0, 3)
      const mockRecommendations = selectedDishes.map((dish) => ({
        ...dish,
        reason: `[DEMO MODE - Gemini simulated] This ${dish.name} matches your target cravings for "${mood || 'tasty food'}" and complies with your nutritional parameters (calories: ${dish.calories} kcal, protein: ${dish.protein}g).`
      }))

      // Introduce a slight delay (1.2s) to show the loading spinner state nicely
      await new Promise(resolve => setTimeout(resolve, 1200))

      return res.status(200).json({ recommendations: mockRecommendations })
    }

    // 3. Build prompt for Gemini
    const systemInstruction = 'You are an AI nutritionist and canteen assistant. Based on user request details, you must select the best dishes from the provided canteen dishes list. You must only recommend dishes that exist in the canteen list. Do not invent dishes.'
    
    const userPrompt = `
User Profile & Preferences:
- Current User: ${user.name || 'User'}
- Goal / Mood / Desired style: "${mood || 'Any food'}"
- Calorie limit: ${maxCalories ? `${maxCalories} kcal` : 'No limit'}
- Minimum protein: ${minProtein ? `${minProtein}g` : 'No minimum'}
- Food Category: ${category || 'All'}

Available Dishes in Canteen:
${JSON.stringify(availableDishes, null, 2)}

Task:
Select the top 3-5 best matching dishes from the list of available dishes that fit the user's requirements. 
For each recommendation, explain why it matches the user's request (e.g. nutrition value, style, user's mood) in the 'reason' field.

You MUST respond with a JSON object containing a "recommendations" array in this exact schema:
{
  "recommendations": [
    {
      "restaurantId": "slug-id",
      "restaurantName": "Restaurant Name",
      "name": "Dish Name",
      "price": 100,
      "calories": 350,
      "protein": 12,
      "carbs": 40,
      "fats": 8,
      "image": "/images/dish.png",
      "reason": "Clear explanation of why this dish was selected."
    }
  ]
}
`

    // 4. Send request to Google Gemini API (with fallback models)
    const modelsToTry = [
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.6-flash',
      'gemini-flash-latest'
    ]

    let response
    let errorDetails = ''
    let lastStatus = 500

    for (const model of modelsToTry) {
      try {
        console.log(`Attempting recommendation generation using model: ${model}`)
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: userPrompt
                    }
                  ]
                }
              ],
              systemInstruction: {
                parts: [
                  {
                    text: systemInstruction
                  }
                ]
              },
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.2
              }
            })
          }
        )

        if (response.ok) {
          console.log(`Successfully generated recommendations using model: ${model}`)
          break
        }

        const errorData = await response.json().catch(() => ({}))
        lastStatus = response.status
        errorDetails = errorData.error?.message || response.statusText || 'Request failed'
        console.warn(`Model ${model} failed with status ${lastStatus}: ${errorDetails}`)
      } catch (fetchError) {
        lastStatus = 500
        errorDetails = fetchError.message || 'Fetch request failed'
        console.warn(`Model ${model} request threw error: ${errorDetails}`)
      }
    }

    if (!response || !response.ok) {
      return res.status(lastStatus).json({
        message: `Gemini API error (all fallbacks exhausted): ${errorDetails || 'Request failed'}`
      })
    }

    const data = await response.json()
    
    // Parse Gemini's JSON response
    const geminiTextResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!geminiTextResponse) {
      throw new Error('Empty response received from Gemini API.')
    }

    const parsedData = JSON.parse(geminiTextResponse.trim())
    
    if (!parsedData.recommendations || !Array.isArray(parsedData.recommendations)) {
      throw new Error('Gemini response format is invalid.')
    }

    return res.status(200).json(parsedData)

  } catch (error) {
    console.error('Error generating food recommendations:', error)
    return res.status(500).json({
      message: error.message || 'An error occurred while generating recommendations.'
    })
  }
}

module.exports = { getRecommendations }
