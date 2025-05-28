import pytest
from datetime import timedelta
from core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

# Test hash_password
def test_hash_password():
    """
    Test if password hashing works correctly.
    """
    password = "secure_password"
    hashed = hash_password(password)
    assert password != hashed, "Password and hash should not be the same"
    assert len(hashed) > 0, "Hashed password should not be empty"

# Test verify_password
def test_verify_password():
    """
    Test if password verification works correctly.
    """
    password = "secure_password"
    hashed = hash_password(password)
    assert verify_password(password, hashed), "Correct password should verify successfully"
    assert not verify_password("wrong_password", hashed), "Wrong password should not verify"

# Test create_access_token
def test_create_access_token():
    """
    Test if a JWT token is created correctly.
    """
    data = {"user_id": 1}
    token = create_access_token(data)
    assert isinstance(token, str), "Token should be a string"
    assert len(token) > 0, "Token should not be empty"

# Test decode_access_token with valid token
def test_decode_access_token_valid():
    """
    Test if a valid token is decoded correctly.
    """
    data = {"user_id": 1}
    token = create_access_token(data)
    decoded = decode_access_token(token)
    assert decoded["user_id"] == data["user_id"], "Decoded token should contain correct payload"

# Test decode_access_token with expired token
def test_decode_access_token_expired():
    """
    Test if decoding an expired token raises an error.
    """
    data = {"user_id": 1}
    token = create_access_token(data, expires_delta=timedelta(seconds=1))
    import time
    time.sleep(2)  # Wait for token to expire
    with pytest.raises(ValueError, match="Token không hợp lệ"):
        decode_access_token(token)

# Test decode_access_token with invalid token
def test_decode_access_token_invalid():
    """
    Test if decoding an invalid token raises an error.
    """
    invalid_token = "invalid.token.string"
    with pytest.raises(ValueError, match="Token không hợp lệ"):
        decode_access_token(invalid_token)
