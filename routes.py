from flask import render_template, request, redirect
from models import Client, Product
from extensions import db
from services import create_order_service

def register_routes(app):
    @app.route('/')
    def index():
        clients = Client.query.all()
        return render_template('index.html', clients=clients)


    @app.route('/create-client', methods=["POST", "GET"])
    def create_client():
        if request.method == "POST":
            name = request.form.get('name')
            email = request.form.get('email')

            if not name:
                return "Вкажіть ім'я клієнта"
            if not email:
                return "Вкажіть email клієнта"

            clients = Client(name=name, email=email)

            try:
                db.session.add(clients)
                db.session.commit()
                return redirect('/')
            except Exception as e:
                db.session.rollback()
                return f'Помилка при додаванні: {e}'
        return render_template('create_client.html')


    @app.route('/create-product', methods=["POST", "GET"])
    def create_product():
        if request.method == "POST":
            name = request.form.get("name")
            price = request.form.get("price")
            quantity = request.form.get("quantity")

            if not name:
                return 'Вкажіть назву товару'


            try:
                price = int(price)
                quantity = int(quantity)
            except ValueError:
                return "Ціна та кількість мають бути числом"

            if price <= 0:
                return 'Ціна має бути більшою за 0'

            if quantity < 0:
                return 'Кількість не може бути від’ємною'


            product = Product(name=name, price=price, quantity=quantity)

            try:
                db.session.add(product)
                db.session.commit()
                return redirect('/')
            except Exception as e:
                db.session.rollback()
                return f'Помилка при додаванні: {e}'
        return render_template('create_product.html')


    @app.route('/create-order', methods=['POST', 'GET'])
    def create_order():
        clients = Client.query.all()
        products = Product.query.all()

        if request.method == 'POST':
            order, error = create_order_service(
                client_id=request.form.get('client_id'),
                product_id=request.form.get('product_id'),
                quantity=request.form.get('quantity')
            )

            if error:
                return error
            return redirect('/')

        return render_template(
            'create_order.html', 
            clients=clients, 
            products=products
            )


    @app.route('/client-details/<int:id>')
    def client_details(id):
        client_details = Client.query.get_or_404(id)
        return render_template('client_details.html', client_details=client_details)