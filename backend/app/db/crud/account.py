from sqlalchemy.orm import Session
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate
from app.core.security import hash_password



# Thêm tài khoản mới
def create_account(db: Session, account: AccountCreate):
    # Lấy ID cao nhất hiện tại
    existing_email = db.query(Account).filter(Account.email == account.email).first()
    if existing_email:
        raise ValueError(f"Email '{account.email}' đã tồn tại.")

    # Kiểm tra trùng lặp số điện thoại
    existing_phone = db.query(Account).filter(Account.phone_number == account.phone_number).first()
    if existing_phone:
        raise ValueError(f"Số điện thoại '{account.phone_number}' đã tồn tại.")
    max_id = db.query(Account.id).order_by(Account.id.desc()).first()
    new_id = max_id[0] + 1 if max_id else 1  # Nếu không có bản ghi nào, ID bắt đầu từ 1
    
    hashed_password = hash_password(account.password) # mã hóa pass
    
    new_account = Account(
        id=new_id,  # Gán ID thủ công
        first_name=account.first_name,
        last_name=account.last_name,
        email=account.email,
        phone_number=account.phone_number,
        address=account.address,
        date_of_birth=account.date_of_birth,
        gender=account.gender,
        password=hashed_password,  # Lưu mật khẩu
        role=False,  # Mặc định là User
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account


# Lấy danh sách tài khoản
def get_accounts(db: Session):
    return db.query(Account).all()


# Lấy tài khoản theo ID
def get_account_by_id(db: Session, account_id: int):
    return db.query(Account).filter(Account.id == account_id).first()


# Cập nhật tài khoản
def update_account(db: Session, account_id: int, account_update: AccountUpdate):
    account = get_account_by_id(db, account_id)
    if not account:
        return None
    # Kiểm tra trùng lặp email (trừ tài khoản hiện tại)
    if account_update.email:
        existing_email = db.query(Account).filter(Account.email == account_update.email, Account.id != account_id).first()
        if existing_email:
            raise ValueError(f"Email '{account_update.email}' đã tồn tại.")

    # Kiểm tra trùng lặp số điện thoại (trừ tài khoản hiện tại)
    if account_update.phone_number:
        existing_phone = db.query(Account).filter(Account.phone_number == account_update.phone_number, Account.id != account_id).first()
        if existing_phone:
            raise ValueError(f"Số điện thoại '{account_update.phone_number}' đã tồn tại.")

    # Cập nhật các trường được gửi
    update_data = account_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key == "role":
            raise ValueError("Không thể cập nhật vai trò thông qua API này.")  # Bảo vệ trường 'role'
        if key == "password":
            value = hash_password(value)  # Mã hóa lại mật khẩu nếu cập nhật
        setattr(account, key, value)

    db.commit()
    db.refresh(account)
    return account


# Xóa tài khoản
def delete_account(db: Session, account_id: int):
    account = get_account_by_id(db, account_id)
    if not account:
        return None
    db.delete(account)
    db.commit()
    return account
# Thay đổi vai trò của tài khoản (chỉ dành cho Admin)
def change_account_role(db: Session, account_id: int, new_role: bool):
    """
    Thay đổi vai trò của tài khoản. Chỉ dành cho Admin.
    """
    account = get_account_by_id(db, account_id)
    if not account:
        raise ValueError("Account not found.")
    account.role = new_role
    db.commit()
    db.refresh(account)
    return account