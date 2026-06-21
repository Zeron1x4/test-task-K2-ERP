from flask import Flask
from extensions import db
from routes import register_routes


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    from models import Client, Product, Order, OrderItem

    with app.app_context():
        db.create_all()

    register_routes(app)
    return app

app = create_app()


if __name__ == '__main__':
    app.run(debug=True)