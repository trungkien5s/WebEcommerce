from app.api.authentication import authenticate_user
from app.models.account import Account
from passlib.context import CryptContext

# Mock database query
class MockDBSession:
    def __init__(self, users):
        self.users = users

    def query(self, model):
        self.query_result = self  # Giữ tham chiếu để sử dụng trong filter
        return self

    def filter(self, condition):
        email = condition.right.value  # Lấy giá trị email từ filter condition
        user = next((u for u in self.users if u.email == email), None)
        self.query_result = [user] if user else []  # Lưu kết quả filter
        return self

    def first(self):
        return self.query_result[0] if self.query_result else None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Test data
MOCK_USERS = [
    Account(id=1, email="user@example.com", password=pwd_context.hash("password123")),
    Account(id=2, email="admin@example.com", password=pwd_context.hash("adminpassword")),
]

# Test cases
def test_authenticate_user_success(mocker):
    """
    Test successful user authentication.
    """
    mock_db = MockDBSession(MOCK_USERS)
    mocker.patch("app.core.security.verify_password", return_value=True)  # Mock password verification

    user = authenticate_user(mock_db, "user@example.com", "password123")
    assert user is not None, "User should be authenticated successfully"
    assert user.email == "user@example.com", "Email should match the authenticated user"

def test_authenticate_user_invalid_email(mocker):
    """
    Test authentication with invalid email.
    """
    mock_db = MockDBSession(MOCK_USERS)
    user = authenticate_user(mock_db, "invalid@example.com", "password123")
    assert user is None, "Authentication should fail for invalid email"

def test_authenticate_user_invalid_password(mocker):
    """
    Test authentication with invalid password.
    """
    mock_db = MockDBSession(MOCK_USERS)
    mocker.patch("app.core.security.verify_password", return_value=False)  # Mock password verification

    user = authenticate_user(mock_db, "user@example.com", "wrongpassword")
    assert user is None, "Authentication should fail for invalid password"
