from extensions import db
from models import Client, Product, Order, OrderItem

def create_order_service(client_id, product_id, quantity):
    if not client_id:
        return None, "Оберіть кліента"
        
    if not product_id:
        return None, "Оберіть товар"

    if not quantity:
        return None, "Оберіть кількість"

    client = Client.query.get(client_id)
    product = Product.query.get(product_id)

    if not client:
        return None, "Кліента не знайдено"
    if not product:
        return None, "Товар не знайдено"
    try:
        quantity = int(quantity)
    except ValueError:
        return None, "Кількість має бути числом"
        
    if quantity <= 0:
        return None, "Кількість має бути більше 0"
        
    if quantity > product.quantity:
        return None, 'Недостатньо товару на складі'

    line_total = product.price * quantity

    
    order = Order(client_id=client.id, total_price=line_total)

    db.session.add(order)
    db.session.flush()

    order_item = OrderItem(
        order_id=order.id,
        product_id=product.id,
        quantity=quantity,
        price=product.price,
        line_total=line_total
    )

    product.quantity -= quantity

    db.session.add(order_item)
    db.session.commit()

    return order, None