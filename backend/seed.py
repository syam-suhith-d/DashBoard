import asyncio
from app.db.session import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_data():
    db = SessionLocal()
    try:
        logger.info("Checking for demo user...")
        user = db.query(User).filter(User.email == "demo@example.com").first()
        
        if not user:
            logger.info("Creating demo user...")
            demo_user = User(
                email="demo@example.com",
                hashed_password=get_password_hash("password123"),
                name="Demo User",
                is_active=True,
                is_superuser=False,
            )
            db.add(demo_user)
            logger.info("✅ Demo user created: demo@example.com / password123")

        admin = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin:
            logger.info("Creating admin user...")
            admin_user = User(
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                name="Admin User",
                is_active=True,
                is_superuser=True,
            )
            db.add(admin_user)
            logger.info("✅ Admin user created: admin@example.com / admin123")
            
        db.commit()
        else:
            logger.info("ℹ️ Demo user already exists.")
            
    except Exception as e:
        logger.error(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
