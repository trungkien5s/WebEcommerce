from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from decouple import config
from app.db.blacklist import blacklist_tokens
# JWT Settings
SECRET_KEY = config("SECRET_KEY")
ALGORITHM = config("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# 1. Hàm mã hóa mật khẩu
def hash_password(password: str) -> str:
    """
    Mã hóa mật khẩu người dùng bằng bcrypt.
    """
    return pwd_context.hash(password)


# 2. Hàm xác minh mật khẩu
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Xác minh mật khẩu người dùng so với mật khẩu đã mã hóa.
    """
    return pwd_context.verify(plain_password, hashed_password)


# 3. Hàm tạo JWT token
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Tạo JWT token với payload.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# 4. Hàm giải mã JWT token
def decode_access_token(token: str) -> dict:
    """
    Giải mã JWT token và trả về payload.
    """
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.JWTError as e:
        raise ValueError(f"Token không hợp lệ: {e}")