import os 
from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from extensions import db
from models.club import Club

clubs_bp = Blueprint('clubs', __name__)

def allowed_file(filename, app_config):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


@clubs_bp.route('/', methods=['GET'])
def get_all_clubs():
    #try:
    clubs = Club.query.all()
    return jsonify([club.to_dict() for club in clubs]), 200
    #except Exception as e:
     #   return jsonify({"error": str(e)}), 500

@clubs_bp.route('/<int:club_id>', methods=['GET'])
def get_club(club_id):
    try:
        club = Club.query.get_or_404(club_id)
        return jsonify(club.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 404

   
@clubs_bp.route('/createclub', methods=['POST'])
def add_club():
    name = request.form.get('name')
    description = request.form.get('description')

    if not name or not description:     
        return jsonify({"error": "Name and description are required"}), 400
    
    contact_email= request.form.get('contact_email')
    location= request.form.get('location')
    category= request.form.get('category')
    website= request.form.get('website')
    social_media_links= request.form.get('social_media_links')

    filename = None
    image_url = None
   
    if 'image' in request.files:
        file = request.files['image']
        if file.filename =='':
            pass
        elif file and allowed_file(file.filename, current_app.config):
            filename = secure_filename(file.filename)
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            try:
                file.save(file_path)
                image_url =f"http://localhost:5000/uploads/{filename}"
            except Exception as e:
                return jsonify({"error": f"Failed to save image: {str(e)}"}), 500
        else:
            return jsonify({"error": "Invalid file type for image. Allowed   types are: " +
                            ",".join(current_app.config['ALLOWED_EXTENSIONS'])}), 400

    try:
        new_club = Club(
            name=name,
            description=description,
            contact_email=contact_email,
            location=location,
            category=category,
            website=website,
            social_media_links=social_media_links,
            image_url=image_url    
        )
                
        db.session.add(new_club)
        db.session.commit()
        return jsonify(new_club.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        if image_url and os.path.exists(os.path.join(current_app.config['UPLOAD_FOLDER'], filename)):
            os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        return jsonify({"error": str(e)}), 500

@clubs_bp.route('/<int:club_id>', methods=['DELETE'])
def delete_club(club_id):
    try:
        club = db.session.get(Club, club_id)
        if club is None:
            return jsonify({"message": "Club not found"}), 404
        if club.image_url:
            filename = os.path.basename(club.image_url)
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    print(f"Deleted old file: {file_path}")
                except Exception as e:
                    print(f"Warning: Could not delete image file {file_path}: {e}")

        db.session.delete(club)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting club with ID {club_id}: {e}")
        return jsonify({"message": "Internal Server Error"}), 500


@clubs_bp.route('/<int:club_id>', methods=['PUT'])
def update_club(club_id):
    try:
        club = db.session.get(Club, club_id)
        if club is None:
            return jsonify({"message": "Club not found"}), 404

        data = request.get_json()
        image_url= club.image_url 

        if 'image' in request.files:
            file = request.files['image']
            if file.filename == '':
                pass
            elif file and allowed_file(file.filename, current_app.config):
                if club.image_url:
                    old_filename = os.path.basename(club.image_url)
                    old_file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], old_filename)
                    if os.path.exists(old_file_path):
                        try:
                            os.remove(old_file_path)
                            print(f"Deleted old image file: {old_file_path}")
                        except Exception as e:
                            print(f"Warning: Could not delete old image file {old_file_path}: {e}")
                
                filename = secure_filename(file.filename)
                file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                try:
                    file.save(file_path)
                    image_url = f"/uploads/{filename}"
                except Exception as e:
                    return jsonify({"error": f"Failed to  save new image: {str(e)}"}), 500
            else:
                return jsonify({"error": "Invalid file type for image. Allowed   types are: " +
                            ",".join(current_app.config['ALLOWED_EXTENSIONS'])}), 400
       
                                
       
        club.name = data.get('name', club.name) 
        club.description = data.get('description', club.description)
        club.contact_email = data.get('contact_email', club.contact_email)
        club.location = data.get('location', club.location)
        club.category = data.get('category', club.category)
        club.website = data.get('website', club.website)
        club.social_media_links = data.get('social_media_links', club.social_media_links)
        
        is_active_str = data.get('is_active')
        if is_active_str is not None:
            club.is_active = is_active_str.lower() == 'true'
        else:
            club.is_active = club.is_active 

        club.image_url = image_url
       
        db.session.commit()
    
        return jsonify(club.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating club with ID {club_id}: {e}")
        return jsonify({"message": "Internal Server Error"}), 500
