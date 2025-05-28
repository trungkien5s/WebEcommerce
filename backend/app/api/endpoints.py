import fastapi
from app.api.routes.account import router as account_router
from app.api.routes.auth import router as auth_router

router = fastapi.APIRouter()

# Tích hợp các router từ account.py và auth.py
router.include_router(account_router)
router.include_router(auth_router)  # Import router từ auth.py
