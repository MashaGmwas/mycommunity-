import os

class BaseConfig:
    DEBUG = False
    TESTING = False
    SECRET_KEY = 'y0929051acfeecbce5b1292a33dff6e' 
    SQLALCHEMY_DATABASE_URI ='mysql+pymysql://root:gm69766976@localhost3306/mycommunity'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024



class config:
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = 'uploads' 
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    
class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:' 
    WTF_CSRF_ENABLED = False

class ProductionConfig(BaseConfig):
    DEBUG = False
    TESTING = False