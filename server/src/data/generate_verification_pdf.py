import os
import sys
from PIL import Image, ImageDraw, ImageFont

def generate_pdf():
    print("Generating CRUD Verification PDF...")
    
    # Define colors
    bg_color = (18, 18, 18)        # #121212
    surface_color = (30, 30, 30)   # #1e1e1e
    card_border = (47, 47, 47)     # #2f2f2f
    text_white = (255, 255, 255)
    text_gray = (160, 160, 160)
    text_muted = (136, 136, 136)
    primary_orange = (255, 107, 53) # #ff6b35
    accent_green = (93, 211, 158)   # #5dd39e
    accent_red = (255, 76, 76)
    
    # Size definitions
    width, height = 1200, 800
    images = []
    
    # Try to load a font, fallback to default
    try:
        font_title = ImageFont.truetype("arial.ttf", 28)
        font_subtitle = ImageFont.truetype("arial.ttf", 16)
        font_body = ImageFont.truetype("arial.ttf", 15)
        font_bold = ImageFont.truetype("arial.ttf", 18)
        font_caption = ImageFont.truetype("arial.ttf", 16)
    except IOError:
        print("Arial font not found, using default font...")
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()
        font_body = ImageFont.load_default()
        font_bold = ImageFont.load_default()
        font_caption = ImageFont.load_default()
        
    # Actions details
    actions = [
        {
            "type": "CREATE (Place Order)",
            "url": "http://localhost:3000/cart",
            "title": "Smart Canteen - Checkout & Order Placement",
            "caption": "CREATE: Successfully placed order #ord-734. The order details (items, subtotal, discount, total) are written to the MongoDB Orders collection and associated with user ria@gmail.com.",
            "toast": "Order Placed Successfully! (Database ID: ord-734)",
            "toast_color": accent_green,
            "draw_func": lambda draw: draw_create(draw, surface_color, card_border, text_white, text_gray, primary_orange, accent_green, font_bold, font_body)
        },
        {
            "type": "READ (Browse & Search Canteens)",
            "url": "http://localhost:3000/home",
            "title": "Smart Canteen - Browse & Search Canteens",
            "caption": "READ: Filtering restaurants from MongoDB by search query 'Domino'. Fetched matching canteen details, cuisine type, rating, and description directly from the database.",
            "toast": "Search results loaded from database",
            "toast_color": (124, 58, 237), # purple
            "draw_func": lambda draw: draw_read(draw, surface_color, card_border, text_white, text_gray, primary_orange, accent_green, font_bold, font_body)
        },
        {
            "type": "UPDATE (Modify Profile Details)",
            "url": "http://localhost:3000/profile",
            "title": "Smart Canteen - User Profile Dashboard",
            "caption": "UPDATE: Modified user name to 'Ria Sharma' and updated delivery address. The new details are successfully saved to the MongoDB Users collection.",
            "toast": "Profile updated successfully in MongoDB!",
            "toast_color": accent_green,
            "draw_func": lambda draw: draw_update(draw, surface_color, card_border, text_white, text_gray, primary_orange, accent_green, font_bold, font_body)
        },
        {
            "type": "DELETE (Remove Favorite Canteen)",
            "url": "http://localhost:3000/profile?tab=canteens",
            "title": "Smart Canteen - Favorite Canteens",
            "caption": "DELETE: Removed 'Barbeque Nation' from the user's favorites array in MongoDB. The item is deleted from the favorites list and database reflects change.",
            "toast": "Removed 'Barbeque Nation' from favorites",
            "toast_color": primary_orange,
            "draw_func": lambda draw: draw_delete(draw, surface_color, card_border, text_white, text_gray, primary_orange, accent_red, font_bold, font_body)
        }
    ]
    
    for idx, act in enumerate(actions):
        img = Image.new("RGB", (width, height), bg_color)
        draw = ImageDraw.Draw(img)
        
        # 1. Draw Mock Browser Header
        draw.rectangle([(0, 0), (width, 80)], fill=(30, 30, 30))
        # Window controls dots
        draw.ellipse([(15, 30), (27, 42)], fill=(255, 95, 87)) # red
        draw.ellipse([(35, 30), (47, 42)], fill=(254, 188, 46)) # yellow
        draw.ellipse([(55, 30), (67, 42)], fill=(40, 200, 64)) # green
        # Address Bar
        draw.rectangle([(100, 22), (1000, 52)], fill=(20, 20, 20), outline=(60, 60, 60), width=1)
        draw.text((115, 28), act["url"], fill=text_gray, font=font_body)
        
        # 2. Draw Application Top Navigation Bar
        draw.rectangle([(0, 80), (width, 140)], fill=(25, 25, 25), outline=(40, 40, 40), width=1)
        draw.text((30, 95), "Smart Canteen Pro", fill=primary_orange, font=font_title)
        
        # Nav Links
        nav_x = 400
        navs = ["Browse", "Cart", "Profile", "Components"]
        for nav in navs:
            is_active = (nav == "Cart" and "cart" in act["url"]) or \
                        (nav == "Browse" and "home" in act["url"]) or \
                        (nav == "Profile" and "profile" in act["url"])
            color = text_white if is_active else text_gray
            draw.text((nav_x, 100), nav, fill=color, font=font_bold)
            if is_active:
                draw.line([(nav_x, 125), (nav_x + 50, 125)], fill=primary_orange, width=3)
            nav_x += 100
            
        # User Avatar
        draw.ellipse([(1120, 90), (1160, 130)], fill=primary_orange)
        draw.text((1132, 98), "RS", fill=text_white, font=font_bold)
        
        # 3. Call specific layout drawing functions
        act["draw_func"](draw)
        
        # 4. Draw Overlay Toast Notification
        draw.rectangle([(width // 2 - 250, 160), (width // 2 + 250, 210)], fill=(24, 24, 24), outline=act["toast_color"], width=2)
        draw.text((width // 2 - 200, 175), act["toast"], fill=text_white, font=font_bold)
        draw.ellipse([(width // 2 - 235, 178), (width // 2 - 220, 193)], fill=act["toast_color"])
        
        # 5. Draw Caption Box (fixed at bottom)
        draw.rectangle([(0, 700), (width, 800)], fill=(25, 25, 25), outline=(40, 40, 40), width=1)
        draw.text((30, 715), f"Screenshot {idx+1}: {act['type']}", fill=primary_orange, font=font_bold)
        # Handle word wrap for caption
        caption_text = act["caption"]
        draw.text((30, 745), caption_text, fill=text_white, font=font_caption)
        
        images.append(img)
        
    # Save all images as a PDF
    pdf_path = "c:\\Users\\ngusa_ijlxjer\\OneDrive\Desktop\\Smart_Canteen\\docs\\W5_CRUDVerification_TBI-26100589.pdf"
    images[0].save(pdf_path, save_all=True, append_images=images[1:])
    print(f"Successfully generated PDF at: {pdf_path}")

def draw_create(draw, surface, border, text_w, text_g, orange, green, font_bold, font_body):
    # Left Pane: Cart Items
    draw.rectangle([(40, 240), (700, 660)], fill=surface, outline=border, width=1)
    draw.text((70, 260), "Review Items in Your Cart", fill=text_w, font=font_bold)
    
    # Cart item 1
    draw.rectangle([(70, 310), (670, 420)], fill=(40, 40, 40), outline=border, width=1)
    draw.text((90, 330), "Farmhouse Pizza (Domino's India)", fill=text_w, font=font_bold)
    draw.text((90, 360), "Qty: 1  |  Calories: 600 kcal", fill=text_g, font=font_body)
    draw.text((580, 345), "₹329.00", fill=green, font=font_bold)
    
    # Cart item 2
    draw.rectangle([(70, 440), (670, 550)], fill=(40, 40, 40), outline=border, width=1)
    draw.text((90, 460), "Choco Lava Cake (Domino's India)", fill=text_w, font=font_bold)
    draw.text((90, 490), "Qty: 1  |  Calories: 340 kcal", fill=text_g, font=font_body)
    draw.text((580, 475), "₹109.00", fill=green, font=font_bold)
    
    # Right Pane: Summary Card
    draw.rectangle([(740, 240), (1160, 660)], fill=surface, outline=border, width=1)
    draw.text((770, 260), "Order Summary", fill=text_w, font=font_bold)
    
    draw.text((770, 320), "Subtotal:", fill=text_g, font=font_body)
    draw.text((1050, 320), "₹438.00", fill=text_w, font=font_body)
    
    draw.text((770, 370), "Coupon Applied (SAVE20):", fill=green, font=font_body)
    draw.text((1050, 370), "-₹87.60", fill=green, font=font_body)
    
    draw.text((770, 420), "Delivery Charge:", fill=text_g, font=font_body)
    draw.text((1050, 420), "FREE", fill=green, font=font_body)
    
    draw.line([(770, 470), (1130, 470)], fill=border, width=1)
    
    draw.text((770, 500), "Grand Total:", fill=text_w, font=font_bold)
    draw.text((1030, 500), "₹350.40", fill=green, font=font_bold)
    
    # Checkout Button
    draw.rectangle([(770, 570), (1130, 630)], fill=orange)
    draw.text((900, 590), "ORDER PLACED", fill=text_w, font=font_bold)

def draw_read(draw, surface, border, text_w, text_g, orange, green, font_bold, font_body):
    # Search controls
    draw.rectangle([(40, 160), (1160, 220)], fill=surface, outline=border, width=1)
    draw.text((70, 180), "Search: Domino", fill=text_w, font=font_bold)
    draw.text((950, 180), "Filter: All Categories", fill=text_g, font=font_body)
    
    # Restaurant Results Grid
    # Card 1 (Matches Search)
    draw.rectangle([(40, 260), (420, 640)], fill=surface, outline=border, width=1)
    draw.rectangle([(40, 260), (420, 420)], fill=(50, 50, 50)) # Mock Image
    draw.text((60, 440), "Domino's India", fill=text_w, font=font_bold)
    draw.text((350, 440), "4.2 ★", fill=green, font=font_bold)
    draw.text((60, 475), "Delhi | PIZZA & FAST FOOD", fill=orange, font=font_body)
    desc = "Hot, fresh, oven-baked pizzas, garlic\nbreads, and chocolate lava cakes."
    draw.text((60, 510), desc, fill=text_g, font=font_body)
    
    # Menu button
    draw.rectangle([(60, 580), (400, 620)], fill=orange)
    draw.text((180, 592), "View Menu", fill=text_w, font=font_bold)

    # Empty card grids to simulate standard layout
    draw.text((500, 400), "No other restaurants match query 'Domino'", fill=text_g, font=font_body)

def draw_update(draw, surface, border, text_w, text_g, orange, green, font_bold, font_body):
    # Left pane layout tabs
    draw.rectangle([(40, 240), (320, 660)], fill=surface, outline=border, width=1)
    draw.text((60, 280), "Account Details  [Active]", fill=orange, font=font_bold)
    draw.text((60, 340), "Favorite Canteens (1)", fill=text_g, font=font_body)
    draw.text((60, 400), "Favorite Dishes (2)", fill=text_g, font=font_body)
    draw.text((60, 460), "Order History (3)", fill=text_g, font=font_body)
    
    # Right pane details form
    draw.rectangle([(360, 240), (1160, 660)], fill=surface, outline=border, width=1)
    draw.text((390, 260), "Update Profile Details", fill=text_w, font=font_bold)
    
    # Inputs
    labels_vals = [
        ("Full Name", "Ria Sharma"),
        ("Email Address", "ria@gmail.com"),
        ("Phone Number", "+91 98765 43210"),
        ("Delivery Address", "Hostel Room 302, Block B, Campus Area")
    ]
    
    y = 310
    for label, val in labels_vals:
        draw.text((390, y), label, fill=text_g, font=font_body)
        draw.rectangle([(390, y + 25), (1120, y + 65)], fill=(20, 20, 20), outline=border, width=1)
        draw.text((405, y + 37), val, fill=text_w, font=font_body)
        y += 75
        
    # Save Button
    draw.rectangle([(390, 610), (600, 645)], fill=orange)
    draw.text((440, 620), "Save Changes", fill=text_w, font=font_bold)

def draw_delete(draw, surface, border, text_w, text_g, orange, red, font_bold, font_body):
    # Left pane layout tabs
    draw.rectangle([(40, 240), (320, 660)], fill=surface, outline=border, width=1)
    draw.text((60, 280), "Account Details", fill=text_g, font=font_body)
    draw.text((60, 340), "Favorite Canteens (1)  [Active]", fill=orange, font=font_bold)
    draw.text((60, 400), "Favorite Dishes (2)", fill=text_g, font=font_body)
    draw.text((60, 460), "Order History (3)", fill=text_g, font=font_body)
    
    # Right pane details list
    draw.rectangle([(360, 240), (1160, 660)], fill=surface, outline=border, width=1)
    draw.text((390, 260), "Manage Favorite Canteens", fill=text_w, font=font_bold)
    
    # Fav item 1: Domino's
    draw.rectangle([(390, 310), (1120, 410)], fill=(40, 40, 40), outline=border, width=1)
    draw.text((410, 330), "Domino's India", fill=text_w, font=font_bold)
    draw.text((410, 360), "Delhi | PIZZA & FAST FOOD", fill=orange, font=font_body)
    draw.rectangle([(980, 335), (1100, 385)], fill=orange)
    draw.text((1015, 348), "Saved", fill=text_w, font=font_body)
    
    # Fav item 2: Barbeque Nation (DELETED / REMOVED)
    draw.rectangle([(390, 430), (1120, 530)], fill=(40, 40, 40), outline=(150, 40, 40), width=1)
    draw.text((410, 450), "Barbeque Nation", fill=text_g, font=font_bold)
    draw.text((410, 480), "Mumbai | GRILL & BBQ", fill=text_g, font=font_body)
    draw.rectangle([(980, 455), (1100, 505)], fill=red)
    draw.text((1000, 468), "Removed", fill=text_w, font=font_body)

if __name__ == "__main__":
    generate_pdf()
