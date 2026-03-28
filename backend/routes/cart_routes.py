from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, CartItem, Product

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()['id']
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        "id": ci.id,
        "product_id": ci.product_id,
        "product_name": ci.product.name,
        "product_price": ci.product.price,
        "product_image": ci.product.image_url,
        "quantity": ci.quantity
    } for ci in cart_items]), 200

@cart_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()['id']
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    # Check if item already in cart
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        new_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(new_item)
    
    db.session.commit()
    return jsonify({"message": "Item added to cart"}), 201

@cart_bp.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
def update_cart(id):
    user_id = get_jwt_identity()['id']
    data = request.get_json()
    quantity = data.get('quantity')
    
    cart_item = CartItem.query.filter_by(id=id, user_id=user_id).first_or_404()
    if quantity <= 0:
        db.session.delete(cart_item)
    else:
        cart_item.quantity = quantity
    
    db.session.commit()
    return jsonify({"message": "Cart updated"}), 200

@cart_bp.route('/remove/<int:id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(id):
    user_id = get_jwt_identity()['id']
    cart_item = CartItem.query.filter_by(id=id, user_id=user_id).first_or_404()
    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "Item removed from cart"}), 200
