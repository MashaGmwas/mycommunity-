import sys 
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)


from app import create_app 
from config import config


config_name = os.environ.get('FLASK_ENV', 'development')


app = create_app(config_name)

if __name__ == '__main__':
   
    app.run(debug=True, port=5000)
