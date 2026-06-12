from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

MENU = [
    {"id": 1, "name": "Masala Dosa", "category": "South Indian", "price": 80, "emoji": "🫓", "desc": "Crispy golden dosa with chutneys", "rating": 4.8, "time": "15 min"},
    {"id": 2, "name": "Idli Sambar", "category": "South Indian", "price": 60, "emoji": "🍚", "desc": "Soft idlis with hot sambar", "rating": 4.7, "time": "10 min"},
    {"id": 3, "name": "Chicken Biryani", "category": "Rice", "price": 180, "emoji": "🍛", "desc": "Aromatic rice with tender chicken", "rating": 4.9, "time": "25 min"},
    {"id": 4, "name": "Butter Chicken", "category": "North Indian", "price": 200, "emoji": "🍗", "desc": "Creamy tomato curry with chicken", "rating": 4.9, "time": "20 min"},
    {"id": 5, "name": "Paneer Tikka", "category": "North Indian", "price": 160, "emoji": "🧀", "desc": "Chargrilled paneer with spices", "rating": 4.6, "time": "18 min"},
    {"id": 6, "name": "Samosa", "category": "Snacks", "price": 40, "emoji": "🥟", "desc": "Crispy pastry with spiced potatoes", "rating": 4.5, "time": "5 min"},
    {"id": 7, "name": "Mango Lassi", "category": "Drinks", "price": 70, "emoji": "🥭", "desc": "Thick chilled mango yoghurt drink", "rating": 4.8, "time": "5 min"},
    {"id": 8, "name": "Gulab Jamun", "category": "Desserts", "price": 60, "emoji": "🍮", "desc": "Soft dumplings in rose sugar syrup", "rating": 4.9, "time": "5 min"},
]

CATEGORIES = ["All", "South Indian", "North Indian", "Rice", "Snacks", "Drinks", "Desserts"]

@app.route('/')
def index():
    return render_template('index.html', menu=MENU, categories=CATEGORIES)

@app.route('/place-order', methods=['POST'])
def place_order():
    data = request.get_json()
    name = data.get('name', '')
    phone = data.get('phone', '')
    address = data.get('address', '')
    items = data.get('items', [])
    if not name or not phone or not address or not items:
        return jsonify({'success': False, 'message': 'Fill all fields!'})
    order_id = f"ORD{abs(hash(name + phone)) % 90000 + 10000}"
    return jsonify({'success': True, 'order_id': order_id})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)