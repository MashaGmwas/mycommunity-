import os 
from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from extensions import db 
from models.society import Society 

societies_bp = Blueprint('societies', __name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS'] 

@societies_bp.route('/', methods=['GET'])
def get_all_societies():
    try:
        societies = Society.query.all()
        return jsonify([society.to_dict() for society in societies]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@societies_bp.route('/<int:society_id>', methods=['GET'])
def get_society(society_id):
    try:
        society = Society.query.get_or_404(society_id)
        return jsonify(society.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@societies_bp.route('/', methods=['POST'])
def add_club():
    name = request.form.get('name')
    description = request.form.get('description')

    if not name or not description:
        return jsonify({"error": "Name and description are required"}), 400
    name= request.form.get('name')
    description= request.form.get('description')
    contact_email= request.form.get('contact_email')
    location= request.form.get('location')
    category= request.form.get('category')
    website= request.form.get('website')
    social_media_links= request.form.get('social_media_links')

    filename = None
    imageFile = None 
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
                image_url =f"/uploads/{filename}"
            except Exception as e:
                return jsonify({"error": f"Failed to save image: {str(e)}"}), 500
        else:
            return jsonify({"error": "Invalid file type for image. Allowed   types are: " +
                            ",".join(current_app.config['ALLOWED_EXTENSIONS'])}), 400

    try:
        new_society = Society(
            name=name,
            description=description,
            contact_email=contact_email,
            location=location,
            category=category,
            website=website,
            social_media_links=social_media_links,
            image_url=image_url    
        )
                
        db.session.add(new_society)
        db.session.commit()
        return jsonify(new_society.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        if image_url and os.path.exists(os.path.join(current_app.config['UPLOAD_FOLDER'], filename)):
            os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        return jsonify({"error": str(e)}), 500

@societies_bp.route('/<int:society_id>', methods=['DELETE'])
def delete_club(society_id):
    try:
        society = db.session.get(Society, society_id)
        if society is None:
            return jsonify({"message": "Society not found"}), 404
        if society.image_url:
            filename = os.path.basename(society.image_url)
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    print(f"Deleted old file: {file_path}")
                except Exception as e:
                    print(f"Warning: Could not delete image file {file_path}: {e}")

        db.session.delete(society)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting society with ID {society_id}: {e}")
        return jsonify({"message": "Internal Server Error"}), 500


@societies_bp.route('/<int:society_id>', methods=['PUT'])
def update_society(society_id):
    try:
        society = db.session.get(Society, society_id)
        if society is None:
            return jsonify({"message": "Society not found"}), 404

        data = request.get_json()
        image_url= society.image_url 

        if 'image' in request.files:
            file = request.files['image']
            if file.filename == '':
                pass
            elif file and allowed_file(file.filename, current_app.config):
                if society.image_url:
                    old_filename = os.path.basename(society.iamge_url)
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
       
                                
       
        society.name = data.get('name', society.name) 
        society.description = data.get('description', society.description)
        society.contact_email = data.get('contact_email', society.contact_email)
        society.location = data.get('location', society.location)
        society.category = data.get('category', society.category)
        society.website = data.get('website', society.website)
        society.social_media_links = data.get('social_media_links', society.social_media_links)
        
        is_active_str = data.get('is_active')
        if is_active_str is not None:
            society.is_active = is_active_str.lower() == 'true'
        else:
            society.is_active = society.is_active 

        society.image_url = image_url
       
        db.session.commit()
    
        return jsonify(society.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating society with ID {society_id}: {e}")
        return jsonify({"message": "Internal Server Error"}), 500
