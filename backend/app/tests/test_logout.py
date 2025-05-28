import pytest
from fastapi.testclient import TestClient
from jose import jwt
from app.main import app
from app.core.security import hash_password
from decouple import config

SECRET_KEY = config("SECRET_KEY")
ALGORITHM = config("ALGORITHM")

client = TestClient(app)

@pytest.fixture
def create_user():
    """
    Tạo một người dùng trước khi test.
    """
    user_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": "useraaaaaa@example.com",
        "phone_number": "123456789000a",
        "address": "123 Test Street",
        "password": "string",
        "date_of_birth": "1990-01-01",
        "gender": "male"
    }
    response = client.post("/signup", json=user_data)
    assert response.status_code == 200 or response.status_code == 201, f"Failed to create user: {response.text}"

@pytest.fixture
def login_user(create_user):
    """
    Đăng nhập để lấy token và ID.
    """
    login_data = {
        "username": "useraaaaaa@example.com",
        "password": "string"
    }
    response = client.post("/login", data=login_data)
    assert response.status_code == 200, f"Login failed: {response.text}"
    data = response.json()

    # Giải mã token để lấy ID
    token = data["access_token"]
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    user_id = payload.get("id")
    assert user_id is not None, "Token does not contain user ID"
    
    return {"token": token, "id": user_id}

def test_logout(login_user):
    """
    Kiểm tra tính năng logout.
    """
    token = login_user["token"]
    user_id = login_user["id"]

    # Gọi API bảo vệ trước khi logout
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get(f"/accounts/{user_id}", headers=headers)
    assert response.status_code == 200, "Token hợp lệ không hoạt động."

    # Gọi API logout
    response = client.post("/logout", headers=headers)
    assert response.status_code == 200, "Logout không thành công."
    assert response.json() == {"message": "Successfully logged out"}

    # Gọi lại API bảo vệ sau khi logout
    response = client.get(f"/accounts/{user_id}", headers=headers)
    assert response.status_code == 401, "Token đã logout vẫn hoạt động."
    assert response.json()["detail"] == "Token has been revoked"
