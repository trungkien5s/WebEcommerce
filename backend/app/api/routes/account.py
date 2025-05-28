from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.account import AccountCreate, AccountResponse, AccountUpdate
from app.db.crud.account import (
    create_account,
    get_accounts,
    get_account_by_id,
    update_account,
    delete_account,
    change_account_role,
)
from app.db.database import SessionLocal
from app.api.authentication import get_current_user, get_current_admin_user


router = APIRouter(prefix="/accounts", tags=["accounts"])  # Đặt tags nhất quán (chữ cái đầu viết hoa)

# Dependency để lấy session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# API: Lấy danh sách tài khoản
@router.get("/", response_model=list[AccountResponse])
def list_all_accounts(db: Session = Depends(get_db), current_user: dict = Depends(get_current_admin_user)):
    """
    Chỉ Admin mới có thể lấy danh sách tài khoản.
    """
    return get_accounts(db)


# API: Lấy thông tin tài khoản theo ID
@router.get("/{account_id}", response_model=AccountResponse)
def retrieve_account(account_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Lấy thông tin tài khoản. Người dùng chỉ có thể xem thông tin của mình.
    """
    account = get_account_by_id(db, account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # Chỉ Admin hoặc chủ tài khoản có thể xem thông tin
    if current_user.id != account.id and not current_user.role:
        raise HTTPException(status_code=403, detail="Permission denied")

    return account


# API: Cập nhật tài khoản
@router.put("/{account_id}", response_model=AccountResponse)
def update_existing_account(
    account_id: int, 
    account_update: AccountUpdate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)  # Lấy thông tin người dùng hiện tại
):
    # Kiểm tra nếu người dùng đang cố gắng cập nhật tài khoản của người khác
    if current_user.id != account_id and not current_user.role:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to update this account"
        )
    
    try:
        updated_account = update_account(db, account_id, account_update)
        return updated_account
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
# API: Xóa tài khoản
@router.delete("/{account_id}")
def delete_existing_account(
    account_id: int, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)  # Lấy thông tin người dùng hiện tại
):
    # Kiểm tra nếu người dùng đang cố gắng xóa tài khoản của người khác
    if current_user.id != account_id and not current_user.role:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to delete this account"
        )
    
    deleted_account = delete_account(db, account_id)
    if not deleted_account:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"message": "Account deleted successfully"}

# API: Thay đổi vai trò (Admin-only)
@router.put("/{account_id}/role")
def change_user_role(account_id: int, new_role: bool, db: Session = Depends(get_db), current_user: dict = Depends(get_current_admin_user)):
    """
    Chỉ Admin mới có quyền thay đổi vai trò của tài khoản khác.
    """
    try:
        updated_account = change_account_role(db, account_id, new_role)
        return {"message": f"User role updated to {'Admin' if new_role else 'User'}"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))