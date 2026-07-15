from flask import render_template, request, redirect, jsonify
from models import Client, Product
from extensions import db
from services import create_order_service

def register_routes(app):
    @app.route('/')
    def index():
        clients = Client.query.all()
        return render_template('index.html', clients=clients)


    @app.route('/create-client')
    def create_client_page():
        return render_template('create_client.html')

    
    @app.route('/api/clients', methods=["POST"])
    def create_client_api():
        client_data = request.get_json(silent=True) or {}

        name = str(client_data.get('name') or '').strip()
        email = str(client_data.get('email') or '').strip()

        if not name:
            return jsonify({
                'success': False,
                'message': "Введіть им'я клієнта"
            }), 400
        
        if not email:
            return jsonify({
                'success': False,
                'message': 'Введіть email клієнта'
            }), 400

        client = Client(name=name, email=email)

        try:
            db.session.add(client)
            db.session.commit()

            return jsonify({
                'success': True,
                'message': 'Клієнта успішно створено',
                'client': {
                    'id': client.id,
                    'name': client.name,
                    'email': client.email
                }
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': 'Не вдалося сворити клієнта'
            }), 500



    @app.route('/create-product')
    def create_product_page():
        return render_template('create_product.html')
    

    @app.route('/api/products', methods=['POST'])
    def create_product_api():
        product_data = request.get_json(silent=True) or {}

        name = str(product_data.get('name') or '').strip()
        price = str(product_data.get('price') or '').strip()
        quantity = str(product_data.get('quantity') or '').strip()

        if not name:
            return jsonify({
                'success': False,
                'message': 'Введіть назву товару'
            }), 400
        
        if not price:
            return jsonify({
                'success': False,
                'message': 'Введіть ціну товару'
            }), 400
        
        if not quantity:
            return jsonify({
                'success': False,
                'message': 'Введіть кількість товару'
            }), 400
        
        product = Product(name=name, price=price, quantity=quantity)

        try:
            db.session.add(product)
            db.session.commit()

            return jsonify({
                'success': True,
                'message': 'Товар успішно створено',
                'product': {
                    'id': product.id,
                    'name': product.name,
                    'price': product.price,
                    'quantity': product.quantity
                }
            }), 201
        except Exception:
            db.session.rollback()

            return jsonify({
                'success': False,
                'message': 'Не вдалося сворити товар'
            }), 500


    @app.route('/create-order')
    def create_order_page():
        clients = Client.query.all()
        products = Product.query.all()
        return render_template('create_order.html', clients=clients, products=products)
    

    @app.route('/api/order', methods=['POST'])
    def create_order_api():
        order_data = request.get_json(silent=True) or ''

        try:
            order, error = create_order_service(
                client_id=order_data.get('client_id'),
                product_id=order_data.get('product_id'),
                quantity=order_data.get('quantity')
            )

            if error:
                return jsonify({
                    'success': False,
                    'message': error
                })
            return jsonify({
                'success': True,
                'message': 'Змовлення успішно створено',
                'order': {
                    'id': order.id,
                    'client_id': order.client_id,
                    'total_price': order.total_price
                }
            }), 201
        except Exception:
            db.session.rollback()

        return jsonify({
            'success': False,
            'message': 'Не вдалося створити замовлення'
        }), 500


    @app.route('/client-details/<int:id>')
    def client_details(id):
        client_details = Client.query.get_or_404(id)
        return render_template('client_details.html', client_details=client_details)