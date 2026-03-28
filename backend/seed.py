from app import create_app
from models.models import db, User, Product, Category
from werkzeug.security import generate_password_hash

def seed_db():
    app = create_app()
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        # Create Admin
        admin = User(
            username='admin',
            email='admin@firstcry.com',
            password_hash=generate_password_hash('password123', method='pbkdf2:sha256'),
            role='Admin'
        )
        db.session.add(admin)

        # Categories
        cat_baby_care = Category(name='Baby Care', description='Essentials for baby health and hygiene', image_url='https://cdn.fcglcdn.com/brain/images/v2/category/baby-care.jpg')
        cat_toys = Category(name='Toys', description='Fun and educational toys', image_url='https://cdn.fcglcdn.com/brain/images/v2/category/toys.jpg')
        cat_clothing = Category(name='Clothing', description='Stylish and comfortable wear', image_url='https://cdn.fcglcdn.com/brain/images/v2/category/clothing.jpg')
        cat_diapers = Category(name='Diapers', description='Soft and leak-proof diapers', image_url='https://cdn.fcglcdn.com/brain/images/v2/category/diapers.jpg')
        
        db.session.add_all([cat_baby_care, cat_toys, cat_clothing, cat_diapers])
        db.session.commit()

        # Products
        products = [
            Product(name='Baby Lotion 200ml', description='Moisturizing lotion for soft skin', price=15.99, stock=100, category_id=cat_baby_care.id, image_url='https://picsum.photos/seed/babycare1/300/300', rating=4.5),
            Product(name='Baby Shampoo 500ml', description='No-tears formula', price=12.50, stock=80, category_id=cat_baby_care.id, image_url='https://picsum.photos/seed/babycare2/300/300', rating=4.8),
            Product(name='Building Blocks Set', description='Set of 50 colorful blocks', price=29.99, stock=50, category_id=cat_toys.id, image_url='https://picsum.photos/seed/toy1/300/300', rating=4.7),
            Product(name='Plush Bear', description='Soft and cuddly teddy bear', price=19.99, stock=60, category_id=cat_toys.id, image_url='https://picsum.photos/seed/toy2/300/300', rating=4.9),
            Product(name='Cotton Baby Onesie', description='Set of 3 cotton onesies', price=24.99, stock=120, category_id=cat_clothing.id, image_url='https://picsum.photos/seed/cloth1/300/300', rating=4.6),
            Product(name='Baby Diapers Pack', description='Pack of 64 newborn diapers', price=35.00, stock=200, category_id=cat_diapers.id, image_url='https://picsum.photos/seed/diaper1/300/300', rating=4.4),
        ]
        
        db.session.add_all(products)
        db.session.commit()
        print("Database seeded!")

if __name__ == '__main__':
    seed_db()
