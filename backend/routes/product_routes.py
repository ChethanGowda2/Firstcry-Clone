from flask import Blueprint, request, jsonify
from models.models import db, Product, Category

product_bp = Blueprint('products', __name__)

@product_bp.route('/', methods=['GET'])
def get_products():
    category_id = request.args.get('category_id')
    query = Product.query
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    # Simple pagination
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    products_pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    products = products_pagination.items
    
    return jsonify({
        "products": [{
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "image_url": p.image_url,
            "rating": p.rating,
            "category_id": p.category_id
        } for p in products],
        "total_pages": products_pagination.pages,
        "current_page": products_pagination.page
    }), 200

@product_bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify({
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "stock": product.stock,
        "image_url": product.image_url,
        "rating": product.rating,
        "category_id": product.category_id
    }), 200

@product_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        "id": c.id,
        "name": c.name,
        "description": c.description,
        "image_url": c.image_url
    } for c in categories]), 200
