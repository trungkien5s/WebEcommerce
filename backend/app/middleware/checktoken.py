from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from app.db.blacklist import blacklist_tokens  # Danh sách token bị thu hồi (blacklist)

class CheckTokenMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Bước 1: Lấy header Authorization
        auth_header = request.headers.get("Authorization")
        
        if auth_header:  # Nếu header tồn tại
            # Bước 2: Lấy token từ header
            token = auth_header.replace("Bearer ", "")
            
            # Bước 3: Kiểm tra token trong blacklist
            if token in blacklist_tokens:
                # Nếu token đã bị thu hồi, trả lỗi 401 Unauthorized
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has been revoked"
                )
        
        # Bước 4: Nếu token hợp lệ, tiếp tục request
        response = await call_next(request)
        return response
