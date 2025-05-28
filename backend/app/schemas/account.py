from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


class AccountBase(BaseModel):
    """
    Schema cơ bản cho tài khoản, dùng làm nền tảng.
    """
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    password: Optional[str] = None  # Mật khẩu
    role: Optional[bool] = None  # Vai trò (True = Admin, False = User)


class AccountCreate(AccountBase):
    """
    Schema được sử dụng khi tạo tài khoản mới.
    """
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    address: str
    date_of_birth: date
    gender: str
    password: str


class AccountUpdate(AccountBase):
    """
    Schema được sử dụng khi cập nhật tài khoản.
    """
    pass


class AccountResponse(AccountBase):
    """
    Schema được sử dụng để trả về thông tin tài khoản cho client.
    """
    id: int

    class Config:
        orm_mode = True  # Cho phép chuyển đổi từ SQLAlchemy model sang Pydantic schema
