from fastapi import FastAPI,Request
from app.api.endpoints import router as endpoints_router  # Import router từ api.routes.account
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

from app.db.blacklist import blacklist_tokens
from app.core.security import decode_access_token
from fastapi.responses import JSONResponse
from app.middleware.checktoken import CheckTokenMiddleware
# Khởi tạo ứng dụng FastAPI
app = FastAPI()

# Thêm middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Thay bằng địa chỉ FE
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả các method (GET, POST, PUT,...)
    allow_headers=["*"],  # Cho phép tất cả headers
)

app.add_middleware(CheckTokenMiddleware)

# Tích hợp router cho Account API
app.include_router(
    endpoints_router
)

