/** Curated Unsplash food photo URLs for restaurant & dish photocards */
const u = (id, w = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

module.exports = {
  restaurants: {
    'artisan-crumb-bakery': u('photo-1509440159596-0249088772ff'),
    'barbeque-nation': u('photo-1559339352-11d035aa65de'),
    'baskin-robbins': u('photo-1563805042-7684c019e1cb'),
    'dominos-india': u('photo-1565299624946-b28f40a0ae38'),
    'sagar-ratna': u('photo-1630383249896-424e482df921'),
    haldirams: u('photo-1601050690597-df0568f70950'),
    'kfc-india': u('photo-1626082927389-6dd097786d66'),
    chaayos: u('photo-1576092768241-dec2318790d1'),
    'subway-india': u('photo-1528735602780-2552fd46c7af'),
    'cafe-coffee-day': u('photo-1495474472287-4d71bcdd2085'),
    'punjabi-dhaba': u('photo-1585937421612-70a008592f82'),
    'momo-magic': u('photo-1496116218413-79711f7170c7'),
    'burger-king': u('photo-1568901346375-23c9450c58cd'),
    'pizza-hut': u('photo-1565299624946-b28f40a0ae38'),
    mcdonalds: u('photo-1594212699903-ec8a3eca50f5'),
    starbucks: u('photo-1495474472287-4d71bcdd2085'),
    'dunkin-donuts': u('photo-1551024601-bec78aea704b'),
    'behrouz-biryani': u('photo-1585937421612-70a008592f82'),
    faasos: u('photo-1565299624946-b28f40a0ae38'),
    freshmenu: u('photo-1512621776951-a57141f2eefd'),
    'belgian-waffle-co': u('photo-1563729787504-d1d93e1a2b4c'),
    'nathus-sweets': u('photo-1606313564200-e75d5e304d28'),
    social: u('photo-1517248135467-4c7edcad34c4'),
  },
  dishes: {
    // Artisan Crumb Bakery
    'Chocolate Celebration Cake': u('photo-1578985545062-69928b1d9587'),
    'Red Velvet Cupcake': u('photo-1614707267537-b85a32ecfcff'),
    'Sourdough Bread Loaf': u('photo-1549931319-a545dcf457bc'),
    'Fresh Blueberry Muffins': u('photo-1607958996337-41aef7ca2247'),
    'Butter Croissant': u('photo-1555507036-ab1f4038808a'),
    'Chocolate Brownie': u('photo-1606313564200-e75d5e304d28'),
    'Strawberry Tart': u('photo-1565958011703-44f9829ba187'),
    'Cinnamon Roll': u('photo-1606890736967-264e8c8d0b0c'),

    // Barbeque Nation
    'Paneer Tikka Skewer': u('photo-1565557623262-b51c2513a641'),
    'Veg Seekh Kabab': u('photo-1599487488170-d11ec139d690'),
    'Grilled Pineapple': u('photo-1550258987-190a2d41a8ba'),
    'Tandoori Mushroom Tikka': u('photo-1546833999-b9f581a1996d'),
    'Crispy Corn Skewers': u('photo-1563379091339-03b21ab4a4f8'),
    'Grilled Hara Bhara Kabab': u('photo-1565557623262-b51c2513a641'),
    'BBQ Roasted Potatoes': u('photo-1518977676601-b53bbf82d6fa'),
    'Smokey Veg Platter': u('photo-1559339352-11d035aa65de'),

    // Baskin Robbins
    'Mississippi Mud Scoop': u('photo-1563805042-7684c019e1cb'),
    'Cotton Candy Scoop': u('photo-1567203566008-2957f5b617c0'),
    'Mint Chocolate Chip Scoop': u('photo-1563805042-7684c019e1cb'),
    'Almond Praline Scoop': u('photo-1563805042-7684c019e1cb'),
    'Alphonso Mango Sundae': u('photo-1488903128100-cf6579424594'),
    'Belgian Chocolate Shake': u('photo-1572490122747-396a9558181c'),
    'Red Velvet Ice Cream Cake': u('photo-1563729787504-d1d93e1a2b4c'),
    'Berry Strawberry Scoop': u('photo-1563805042-7684c019e1cb'),

    // Domino's India
    'Farmhouse Pizza': u('photo-1565299624946-b28f40a0ae38'),
    'Paneer Pizza': u('photo-1565299624946-b28f40a0ae38'),
    'Garlic Bread': u('photo-1573140247632-38d4ad1e7561'),
    'Peppy Paneer Pizza': u('photo-1565299624946-b28f40a0ae38'),
    'Mexican Green Wave': u('photo-1574071318508-1cdbab80d002'),
    'Stuffed Garlic Breadsticks': u('photo-1573140247632-38d4ad1e7561'),
    'Choco Lava Cake': u('photo-1606313564200-e75d5e304d28'),
    'Veggie Paradise Pizza': u('photo-1565299624946-b28f40a0ae38'),

    // Sagar Ratna
    'Rava Dosa': u('photo-1630383249896-424e482df921'),
    'Onion Uttapam': u('photo-1668236571346-29d0a32389ca'),
    'Curd Rice': u('photo-1585937421612-70a008592f82'),
    'Masala Dosa': u('photo-1630383249896-424e482df921'),
    'Idli Sambar (2 pcs)': u('photo-1585937421612-70a008592f82'),
    'Medu Vada (2 pcs)': u('photo-1585937421612-70a008592f82'),
    'Mysore Masala Dosa': u('photo-1630383249896-424e482df921'),
    'Filter Coffee': u('photo-1495474472287-4d71bcdd2085'),

    // Haldiram's
    'Aloo Samosa (2 pcs)': u('photo-1601050690597-df0568f70950'),
    'Raj Kachori': u('photo-1565557623262-b51c2513a641'),
    'Paneer Tikka Wrap': u('photo-1626700051175-6818013e5786'),
    'Dal Makhani Combo': u('photo-1585937421612-70a008592f82'),
    'Gulab Jamun (2 pcs)': u('photo-1586788680774-4d5a2a4a8b0e'),
    'Kaju Katli Box': u('photo-1606313564200-e75d5e304d28'),
    'Pav Bhaji Plate': u('photo-1565557623262-b51c2513a641'),
    'Thandai Cooler': u('photo-1572490122747-396a9558181c'),

    // KFC India
    'Hot & Crispy Chicken (2 pc)': u('photo-1626082927389-6dd097786d66'),
    'Zinger Burger': u('photo-1568901346375-23c9450c58cd'),
    'Popcorn Chicken Bucket': u('photo-1626082927389-6dd097786d66'),
    'Veg Zinger Burger': u('photo-1568901346375-23c9450c58cd'),
    'Chicken Rice Bowl': u('photo-1603133870888-beef5a4a8a38'),
    'Crispy Chicken Strips (3 pc)': u('photo-1626082927389-6dd097786d66'),
    'Coleslaw Side': u('photo-1512621776951-a57141f2eefd'),
    'Chocolate Mousse': u('photo-1606313564200-e75d5e304d28'),

    // Chaayos
    'Desi Chai (Kulhad)': u('photo-1576092768241-dec2318790d1'),
    'Iced Lemon Tea': u('photo-1556671343-2191321803c7'),
    'Masala Maggi': u('photo-1569718212165-3a8278d225f5'),
    'Veg Grilled Sandwich': u('photo-1528735602780-2552fd46c7af'),
    'Bun Maska': u('photo-1509440159596-0249088772ff'),
    'Honey Ginger Tea': u('photo-1576092768241-dec2318790d1'),
    'Cheese Corn Toast': u('photo-1559466273-d95e72debaf8'),
    'Desi Chai + Cookie Combo': u('photo-1576092768241-dec2318790d1'),

    // Subway India
    'Veggie Delite Sub (6")': u('photo-1538587888044-79f13ddd7e49'),
    'Paneer Tikka Sub (6")': u('photo-1553909489-cd47e0907980'),
    'Chicken Teriyaki Sub (6")': u('photo-1543353071-10c8ba85a904'),
    'Tuna Sub (6")': u('photo-1509722747041-616f39b57569'),
    'Garden Fresh Salad': u('photo-1512621776951-a57141f2eefd'),
    'Cookie Combo (2 pcs)': u('photo-1606313564200-e75d5e304d28'),
    'Mint Mojito Refresher': u('photo-1556671343-2191321803c7'),
    'Peri Peri Chicken Sub (6")': u('photo-1482049016688-2d3e1b311543'),

    // Cafe Coffee Day
    'Cappuccino Regular': u('photo-1495474472287-4d71bcdd2085'),
    'Cold Coffee Frappe': u('photo-1572490122747-396a9558181c'),
    'Veg Puff': u('photo-1601050690597-df0568f70950'),
    'Chicken Sandwich': u('photo-1553909489-cd47e0907980'),
    'Double Shot Espresso': u('photo-1495474472287-4d71bcdd2085'),
    'Blueberry Muffin': u('photo-1607958996337-41aef7ca2247'),
    'Hot Chocolate': u('photo-1572490122747-396a9558181c'),
    'Garlic Bread Bites': u('photo-1573140247632-38d4ad1e7561'),

    // Punjabi Dhaba
    'Butter Chicken Thali': u('photo-1603894584371-5a879ce3a2f5'),
    'Paneer Butter Masala': u('photo-1585937421612-70a008592f82'),
    'Dal Tadka with Rice': u('photo-1585937421612-70a008592f82'),
    'Amritsari Kulcha Plate': u('photo-1601050690597-df0568f70950'),
    'Lassi (Sweet)': u('photo-1572490122747-396a9558181c'),
    'Tandoori Roti (2 pcs)': u('photo-1606491956689-2ea866858784'),
    'Chole Bhature': u('photo-1606491956689-2ea866858784'),
    'Gajar Halwa': u('photo-1586788680774-4d5a2a4a8b0e'),

    // Momo Magic
    'Steamed Veg Momos (6 pcs)': u('photo-1496116218413-79711f7170c7'),
    'Fried Chicken Momos (6 pcs)': u('photo-1496116218413-79711f7170c7'),
    'Schezwan Paneer Momos': u('photo-1496116218413-79711f7170c7'),
    'Thukpa Soup Bowl': u('photo-1569718212165-3a8278d225f5'),
    'Chilli Garlic Noodles': u('photo-1569718212165-3a8278d225f5'),
    'Honey Chilli Potato': u('photo-1518977676601-b53bbf82d6fa'),
    'Jhol Momo Bowl': u('photo-1496116218413-79711f7170c7'),
    'Iced Peach Tea': u('photo-1556671343-2191321803c7'),

    // Burger King
    'Whopper Burger': u('photo-1568901346375-23c9450c58cd'),
    'Chicken Whopper': u('photo-1568901346375-23c9450c58cd'),
    'Veggie Burger': u('photo-1568901346375-23c9450c58cd'),
    'Crispy Chicken Burger': u('photo-1568901346375-23c9450c58cd'),
    'French Fries (Medium)': u('photo-1573080466752-6173f2761d8c'),
    'Onion Rings (6 pcs)': u('photo-1639024471283-03518883512d'),
    'Chicken Nuggets (6 pcs)': u('photo-1626082927389-6dd097786d66'),
    'Pepsi (500ml)': u('photo-1524230802916-8a8d4b3f7b7a'),

    // Pizza Hut
    'Margherita Pizza (Medium)': u('photo-1565299624946-b28f40a0ae38'),
    'Pepperoni Pizza (Medium)': u('photo-1565299624946-b28f40a0ae38'),
    'Veggie Supreme Pizza': u('photo-1565299624946-b28f40a0ae38'),
    'Cheesy Bites Pizza': u('photo-1565299624946-b28f40a0ae38'),
    'Garlic Bread': u('photo-1573140247632-38d4ad1e7561'),
    'Pasta Alfredo': u('photo-1621996346565-e3dbc646d9af'),
    'Chicken Wings (4 pcs)': u('photo-1527477376006-c5355c6c8f8e'),
    'Chocolate Lava Cake': u('photo-1606313564200-e75d5e304d28'),

    // McDonald's
    'Big Mac': u('photo-1594212699903-ec8a3eca50f5'),
    'McChicken Burger': u('photo-1594212699903-ec8a3eca50f5'),
    'Veg Maharaja Mac': u('photo-1594212699903-ec8a3eca50f5'),
    'McSpicy Chicken': u('photo-1594212699903-ec8a3eca50f5'),
    'French Fries (Medium)': u('photo-1573080466752-6173f2761d8c'),
    'McNuggets (6 pcs)': u('photo-1626082927389-6dd097786d66'),
    'Filet-O-Fish': u('photo-1594212699903-ec8a3eca50f5'),
    'McFlurry Chocolate': u('photo-1572490122747-396a9558181c'),

    // Starbucks
    'Caramel Macchiato (Tall)': u('photo-1495474472287-4d71bcdd2085'),
    'Cappuccino (Grande)': u('photo-1495474472287-4d71bcdd2085'),
    'Cold Brew Coffee': u('photo-1495474472287-4d71bcdd2085'),
    'Java Chip Frappuccino': u('photo-1572490122747-396a9558181c'),
    'Green Tea Latte': u('photo-1495474472287-4d71bcdd2085'),
    'Chocolate Croissant': u('photo-1555507036-ab1f4038808a'),
    'Blueberry Scone': u('photo-1607958996337-41aef7ca2247'),
    'Cheese & Fruit Box': u('photo-1512621776951-a57141f2eefd'),

    // Dunkin' Donuts
    'Glazed Donut': u('photo-1551024601-bec78aea704b'),
    'Chocolate Frosted Donut': u('photo-1551024601-bec78aea704b'),
    'Boston Kreme Donut': u('photo-1551024601-bec78aea704b'),
    'Iced Coffee (Regular)': u('photo-1495474472287-4d71bcdd2085'),
    'Caramel Iced Latte': u('photo-1572490122747-396a9558181c'),
    'Breakfast Sandwich': u('photo-1525351484163-7529414344d8'),
    'Munchkins (6 pcs)': u('photo-1551024601-bec78aea704b'),
    'Bagel with Cream Cheese': u('photo-1549931319-a545dcf457bc'),

    // Behrouz Biryani
    'Murgh Korma Biryani': u('photo-1585937421612-70a008592f82'),
    'Subz-E-Biryani': u('photo-1585937421612-70a008592f82'),
    'Mutton Dum Biryani': u('photo-1585937421612-70a008592f82'),
    'Egg Biryani': u('photo-1585937421612-70a008592f82'),
    'Chicken Korma': u('photo-1585937421612-70a008592f82'),
    'Paneer Tikka Biryani': u('photo-1585937421612-70a008592f82'),
    'Raita Bowl': u('photo-1585937421612-70a008592f82'),
    'Shahi Tukda': u('photo-1586788680774-4d5a2a4a8b0e'),

    // Faasos
    'Chicken Wrap': u('photo-1565299624946-b28f40a0ae38'),
    'Paneer Tikka Wrap': u('photo-1565299624946-b28f40a0ae38'),
    'Veggie Rice Bowl': u('photo-1565299624946-b28f40a0ae38'),
    'Chicken Rice Bowl': u('photo-1565299624946-b28f40a0ae38'),
    'Mutton Biryani Bowl': u('photo-1585937421612-70a008592f82'),
    'Salad Bowl': u('photo-1512621776951-a57141f2eefd'),
    'Desi Ghee Rice': u('photo-1585937421612-70a008592f82'),
    'Butter Chicken Wrap': u('photo-1565299624946-b28f40a0ae38'),

    // FreshMenu
    'Grilled Chicken Salad': u('photo-1512621776951-a57141f2eefd'),
    'Quinoa Veggie Bowl': u('photo-1512621776951-a57141f2eefd'),
    'Grilled Salmon': u('photo-1467003909585-63f9b5b3e5d8'),
    'Mediterranean Bowl': u('photo-1512621776951-a57141f2eefd'),
    'Chicken Caesar Salad': u('photo-1512621776951-a57141f2eefd'),
    'Veggie Stir Fry': u('photo-1512621776951-a57141f2eefd'),
    'Protein Power Bowl': u('photo-1512621776951-a57141f2eefd'),
    'Greek Salad': u('photo-1512621776951-a57141f2eefd'),

    // The Belgian Waffle Co.
    'Classic Belgian Waffle': u('photo-1563729787504-d1d93e1a2b4c'),
    'Chocolate Waffle': u('photo-1563729787504-d1d93e1a2b4c'),
    'Berry Bliss Waffle': u('photo-1563729787504-d1d93e1a2b4c'),
    'Caramel Crunch Waffle': u('photo-1563729787504-d1d93e1a2b4c'),
    'Red Velvet Pancakes': u('photo-1563729787504-d1d93e1a2b4c'),
    'Nutella Waffle': u('photo-1563729787504-d1d93e1a2b4c'),
    'Ice Cream Waffle': u('photo-1563729787504-d1d93e1a2b4c'),
    'Maple Syrup Waffle': u('photo-1563729787504-d1d93e1a2b4c'),

    // Nathu's Sweets
    'Rasgulla (6 pcs)': u('photo-1606313564200-e75d5e304d28'),
    'Gulab Jamun (6 pcs)': u('photo-1586788680774-4d5a2a4a8b0e'),
    'Jalebi (6 pcs)': u('photo-1606313564200-e75d5e304d28'),
    'Kaju Barfi (250g)': u('photo-1606313564200-e75d5e304d28'),
    'Peda Box (250g)': u('photo-1606313564200-e75d5e304d28'),
    'Samosa (2 pcs)': u('photo-1601050690597-df0568f70950'),
    'Chole Bhature': u('photo-1606491956689-2ea866858784'),
    'Dahi Bhalla Plate': u('photo-1606491956689-2ea866858784'),

    // Social
    'Social Nachos': u('photo-1513456852971-29d6a1db7a8a'),
    'Chicken Wings (8 pcs)': u('photo-1527477376006-c5355c6c8f8e'),
    'Veggie Pizza': u('photo-1565299624946-b28f40a0ae38'),
    'Cocktail Samosas': u('photo-1601050690597-df0568f70950'),
    'Fish & Chips': u('photo-1574486309954-8df5d3950f6b'),
    'Paneer Tikka': u('photo-1565557623262-b51c2513a641'),
    'Mocktail Mojito': u('photo-1556671343-2191321803c7'),
    'Chocolate Fondue': u('photo-1606313564200-e75d5e304d28'),
  },
}
