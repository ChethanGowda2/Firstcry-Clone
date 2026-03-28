from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, Order, OrderItem, CartItem, Product

order_bp = Blueprint('orders', __name__)

@order_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()['id']
    data = request.get_json()
    address = data.get('address')
    
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"message": "Cart is empty"}), 400
    
    total_price = sum(item.product.price * item.quantity for item in cart_items)
    
    new_order = Order(user_id=user_id, total_price=total_price, address=address)
    db.session.add(new_order)
    db.session.flush() # To get order ID
    
    for item in cart_items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )
        db.session.add(order_item)
        # Update stock
        item.product.stock -= item.quantity
        
    # Clear cart
    CartItem.query.filter_by(user_id=user_id).delete()
    
    db.session.commit()
    return jsonify({"message": "Order placed successfully", "order_id": new_order.id}), 201

@order_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()['id']
    orders = Order.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        "id": o.id,
        "status": o.status,
        "total_price": o.total_price,
        "created_at": o.created_at,
        "address": o.address,
        "items": [{
            "product_name": item.product.name,
            "quantity": item.quantity,
            "price": item.price
        } for item in o.items]
    } for o in orders]), 200

@order_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_order_detail(id):
    user_id = get_jwt_identity()['id']
    order = Order.query.filter_by(id=id, user_id=user_id).first_or_404()
    
    return jsonify({
        "id": order.id,
        "status": order.status,
        "total_price": order.total_price,
        "address": order.address,
        "created_at": order.created_at,
        "items": [{
            "product_id": item.product_id,
            "product_name": item.product.name,
            "quantity": item.quantity,
            "price": item.price,
            "image": item.product.image_url
        } for item in order.items]
    }), 200
