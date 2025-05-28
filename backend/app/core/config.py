from decouple import config

DATABASE_URL = config("DB_URL")  # URL cơ sở dữ liệu
SECRET_KEY = config("SECRET_KEY")  # Khóa bảo mật
DEBUG = config("DEBUG", default=False, cast=bool)  # Chế độ debug


