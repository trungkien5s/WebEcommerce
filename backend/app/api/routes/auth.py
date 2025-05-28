from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.security import verify_password, create_access_token,decode_access_token
from app.db.database import SessionLocal
from app.models.account import Account
from app.api.authentication import get_current_user
from app.db.crud.account import create_account
from app.schemas.account import AccountCreate, AccountResponse
from app.api.authentication import oauth2_scheme
from app.db.blacklist import blacklist_tokens  # Import từ file mới

router = APIRouter(tags=["Authentication"])

# Dependency để lấy session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

    
# API: Tạo tài khoản mới
@router.post("/signup", response_model=AccountResponse)
def create_new_account(account: AccountCreate, db: Session = Depends(get_db)):
    try:
        new_account = create_account(db, account)
        return new_account
    except ValueError as e:  # Bắt lỗi trùng lặp từ hàm CRUD
        raise HTTPException(status_code=400, detail=str(e))
#API: đăng kí  
@router.post("/login")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Xử lý xác thực và trả về JWT token.
    """
    # Lấy người dùng từ cơ sở dữ liệu
    user = db.query(Account).filter(Account.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Tạo token
    access_token = create_access_token(data={"sub": user.email, "id": user.id})
    print("cur token", access_token)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(current_user: Account = Depends(get_current_user), token: str = Depends(oauth2_scheme)):
    print("Token extracted by oauth2_scheme:", token)
    print("Current blacklist:", blacklist_tokens)
    if token in blacklist_tokens:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token already blacklisted"
        )
    blacklist_tokens.add(token)
    print("Updated blacklist:", blacklist_tokens)
    return {"message": "Successfully logged out"}
