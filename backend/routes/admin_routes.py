from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, User, Product, Order, Category

admin_bp = Blueprint('admin', __name__)

def admin_required(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        if identity['role'] != 'Admin':
            return jsonify({"message": "Admin access required"}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    total_users = User.query.count()
    total_products = Product.query.count()
    total_orders = Order.query.count()
    total_revenue = db.session.query(db.func.sum(Order.total_price)).scalar() or 0
    
    return jsonify({
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": total_revenue
    }), 200

@admin_bp.route('/products', methods=['POST'])
@admin_required
def add_product():
    data = request.get_json()
    new_product = Product(
        name=data.get('name'),
        description=data.get('description'),
        price=data.get('price'),
        stock=data.get('stock'),
        category_id=data.get('category_id'),
        image_url=data.get('image_url'),
        rating=0.0
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product added", "product_id": new_product.id}), 201

@admin_bp.route('/products/<int:id>', methods=['PUT', 'DELETE'])
@admin_required
def manage_product(id):
    product = Product.query.get_or_404(id)
    if request.method == 'PUT':
        data = request.get_json()
        product.name = data.get('name', product.name)
        product.description = data.get('description', product.description)
        product.price = data.get('price', product.price)
        product.stock = data.get('stock', product.stock)
        product.category_id = data.get('category_id', product.category_id)
        product.image_url = data.get('image_url', product.image_url)
        db.session.commit()
        return jsonify({"message": "Product updated"}), 200
    
    elif request.method == 'DELETE':
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted"}), 200

@admin_bp.route('/orders', methods=['GET'])
@admin_required
def get_all_orders():
    orders = Order.query.all()
    return jsonify([{
        "id": o.id,
        "username": o.user.username,
        "status": o.status,
        "total_price": o.total_price,
        "created_at": o.created_at
    } for o in orders]), 200

@admin_bp.route('/orders/<int:id>', methods=['PATCH'])
@admin_required
def update_order_status(id):
    order = Order.query.get_or_404(id)
    data = request.get_json()
    order.status = data.get('status', order.status)
    db.session.commit()
    return jsonify({"message": "Order status updated"}), 200
