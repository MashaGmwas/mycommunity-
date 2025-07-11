
from flask import Blueprint, jsonify, request
from extensions import db
from models.club import Club 

clubs_bp = Blueprint('clubs', __name__)

@clubs_bp.route('/', methods=['GET'])
def get_all_clubs():
    try:
        clubs = Club.query.all()
        return jsonify([club.to_dict() for club in clubs]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@clubs_bp.route('/<int:club_id>', methods=['GET'])
def get_club(club_id):
    try:
        club = Club.query.get_or_404(club_id)
        return jsonify(club.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@clubs_bp.route('/', methods=['POST'])
def add_club():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({"error": "Name and description are required"}), 400

    try:
        new_club = Club(
            name=data.get('name'),
            description=data.get('description'),
            contact_email=data.get('contact_email'),
            location=data.get('location'),
            category=data.get('category'),
            website=data.get('website'),
            social_media_links=data.get('social_media_links'),
            image_url=data.get('image_url'),  
        )
                
        db.session.add(new_club)
        db.session.commit()
        return jsonify(new_club.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@clubs_bp.route('/<int:club_id>', methods=['DELETE'])
def delete_club(club_id):
    try:

        club = db.session.get(Club, club_id)
        if club is None:
            return jsonify({"message": "Club not found"}), 404
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
        if not data:
            return jsonify({"error": "Request body must contain JSON data"}), 400

       
        club.name = data.get('name', club.name) 
        club.description = data.get('description', club.description)
        club.contact_email = data.get('contact_email', club.contact_email)
        club.location = data.get('location', club.location)
        club.category = data.get('category', club.category)
        club.website = data.get('website', club.website)
        club.social_media_links = data.get('social_media_links', club.social_media_links)
        club.image_url = data.get('image_url', club.image_url)
        club.is_active = data.get('is_active', club.is_active) 

       
        db.session.commit()

    
        return jsonify(club.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating club with ID {club_id}: {e}")
        return jsonify({"message": "Internal Server Error"}), 500
