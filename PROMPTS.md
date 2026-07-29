# Prompt Engineering Log - Food Recommendation AI

Here is the log of the prompts I tested while building the Live AI Food Recommendation feature. The goal was to have Gemini recommend actual dishes from our MongoDB canteen database matching what the user wants.

---

## The System Prompt
To keep the AI grounded and stop it from making up fake dishes, I set this system instruction on the Gemini API request:

> "You are an AI nutritionist and canteen assistant. Based on user request details, you must select the best dishes from the provided canteen dishes list. You must only recommend dishes that exist in the canteen list. Do not invent dishes."

---

## Attempt 1: Raw Conversational Text

### What I tried
I started with a simple, open-ended question to see how the model handles the menu data.

**Prompt:**
```text
Recommend some dishes for a user named Ria who wants a high protein lunch.
Here is the menu:
[
  { "name": "Peppy Paneer Pizza", "price": 379, "calories": 680, "protein": 22 },
  { "name": "Masala Dosa", "price": 120, "calories": 350, "protein": 8 }
]
Explain why you recommend them.
```

### Sample Output
```text
I recommend the Peppy Paneer Pizza because it has 22g of protein, which is much higher than the Masala Dosa (8g). The price is ₹379 and it has 680 calories.
```

### Why it didn't work
While the recommendation made sense, the output is just a raw paragraph. The frontend has no way of parsing this dynamically to render visual product cards, show nutrition badges, or connect it to the "Add to Cart" button.

---

## Attempt 2: Asking for JSON in the Prompt

### What I tried
I decided to ask the model to return a structured JSON block so my Node server could parse it.

**Prompt:**
```text
You must recommend dishes from this list:
[
  { "name": "Peppy Paneer Pizza", "price": 379, "calories": 680, "protein": 22 },
  { "name": "Masala Dosa", "price": 120, "calories": 350, "protein": 8 }
]
Based on: "high protein lunch".
Return your response in this JSON format:
{
  "recommendations": [
    { "name": "...", "price": 0, "reason": "..." }
  ]
}
```

### Sample Output
```markdown
```json
{
  "recommendations": [
    {
      "name": "Peppy Paneer Pizza",
      "price": 379,
      "reason": "This dish contains 22g of protein, satisfying your target for a high protein meal."
    }
  ]
}
```
```

### Why it didn't work well
It was too flaky. Sometimes Gemini returned the JSON raw, but other times it wrapped it in markdown code blocks (\`\`\`json ... \`\`\`) or wrote conversational intros like *"Sure, here are your recommendations:"* at the top. This caused random `SyntaxError: Unexpected token` crashes in `JSON.parse()` on my Node backend.

---

## Attempt 3: API-Enforced JSON Mode (The Winner)

### What I tried
Instead of just asking for JSON in the text, I configured the API call with `responseMimeType: "application/json"`, set the temperature to `0.2` for consistency, and provided a highly structured layout of the active database menu.

**Prompt:**
```text
User Profile & Preferences:
- Current User: Ria
- Goal / Mood / Desired style: "I want a high protein lunch under 600 calories"
- Calorie limit: 600 kcal
- Minimum protein: 20g
- Food Category: All

Available Dishes in Canteen:
[
  { "restaurantId": "dominos-india", "restaurantName": "Domino's", "name": "Peppy Paneer Pizza", "price": 379, "calories": 680, "protein": 22 },
  { "restaurantId": "annapoorna", "restaurantName": "Annapoorna", "name": "Masala Dosa", "price": 120, "calories": 350, "protein": 8 },
  { "restaurantId": "fit-bites", "restaurantName": "Fit Bites", "name": "Tofu Protein Salad", "price": 190, "calories": 280, "protein": 24 }
]

Task:
Select the top 3-5 best matching dishes from the list of available dishes that fit the user's requirements. 
For each recommendation, explain why it matches the user's request in the 'reason' field.

You MUST respond with a JSON object containing a "recommendations" array in this exact schema:
{
  "recommendations": [
    {
      "restaurantId": "string",
      "restaurantName": "string",
      "name": "string",
      "price": number,
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number,
      "image": "string",
      "reason": "string"
    }
  ]
}
```

### Sample Output
```json
{
  "recommendations": [
    {
      "restaurantId": "fit-bites",
      "restaurantName": "Fit Bites",
      "name": "Tofu Protein Salad",
      "price": 190,
      "calories": 280,
      "protein": 24,
      "carbs": 15,
      "fats": 8,
      "image": "/images/tofu_salad.png",
      "reason": "This salad contains 24g of protein, exceeding your 20g minimum, and is well under your 600 calorie limit at only 280 kcal."
    }
  ]
}
```

### Why this worked best
This approach is extremely reliable because the native JSON configuration forces the model to return a clean, parseable JSON string with no extra formatting or comments. By matching the exact property schemas of our database and frontend components, the backend can safely pipe the response straight to the client. This gives us flawless card rendering and allows users to click 'Add to Cart' directly from the AI recommendations page.
