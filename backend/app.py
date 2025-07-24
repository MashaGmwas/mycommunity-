
from flask import Flask, Blueprint, jsonify , request 
import os
from dotenv import load_dotenv
from config import DevelopmentConfig, TestingConfig, ProductionConfig
from extensions import db, bcrypt, login_manager
from flask_cors import CORS
from datetime import datetime 
from werkzeug.security import generate_password_hash, check_password_hash 
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity 
from Routes.clubs import clubs_bp
from werkzeug.utils import secure_filename 
from models.club import Club 
from models.user import User 
from Routes.societies import societies_bp
from models.society import Society 
from flask_migrate import Migrate

CONFIG_MAP = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
}
def allowed_file(filename, app_config):
    return '.' in filename and \
         filename.rsplit('.', 1)[1].lower()in app_config['ALLOWED_EXTENSIONS']

def create_app(config_name='development'):
    app = Flask(__name__)
    load_dotenv() 
    UPLOAD_FOLDER = os.path.join(app.root_path, 'uploads')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.config['ALLOWED_EXTENSIONS'] = {'PNG','JPG','jpeg','gif'}
     
    config_class = CONFIG_MAP.get(config_name, DevelopmentConfig)
    app.config.from_object(config_class)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'a-very-strong-and-secret-fallback-key')
    
    migrate = Migrate(app, db)

    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    
    jwt = JWTManager(app)
    
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    from Routes.clubs import clubs_bp
    app.register_blueprint(clubs_bp, url_prefix='/api/clubs')
    
    from Routes.clubs import createclub_bp
    app.register_blueprint(createclub_bp, url_prefix='/api/clubs/createclub')

    from Routes.societies import societies_bp
    app.register_blueprint( societies_bp, url_prefix='/api/societies')

    
    @app.route('/api/register', methods=['POST'])
    def register_user():
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({"msg": "Missing username, email, or password"}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({"msg": "Username already exists"}), 409
        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "Email already exists"}), 409

        new_user = User(username=username, email=email)
        new_user.set_password(password) 

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "User registered successfully", "user_id": new_user.id}), 201

    @app.route('/api/login', methods=['POST'])
    def login_user():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"msg": "Missing username or password"}), 400

        user = User.query.filter_by(username=username).first()
        if user is None or not user.check_password(password):
            return jsonify({"msg": "Bad username or password"}), 401

        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token), 200

    @app.route('/api/protected', methods=['GET'])
    @jwt_required()
    def protected_route():
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user:
            return jsonify(logged_in_as=user.username), 200
        return jsonify({"msg": "User not found"}), 404


    @app.route('/')
    def index():
        return "Welcome to my community Bakend API!"
    
    @app.route('/api/clubs_test')
    def get_clubs():
        return {"message":"Clubs API endpoint - coming soon!"}, 200
    
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        if not allowed_file(filename, app.config):
            return "file type not allowed", 400
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    return app
    
