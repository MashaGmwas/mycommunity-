from flask import Blueprint, request, jsonify
from models.cp import Project
from extensions import db

projects_bp = Blueprint('projects', __name__, url_prefix='/api/projects')

def handle_error(message, status_code):
    return jsonify({'error': message}), status_code


@projects_bp.route('/', methods=['POST'])
def create_project():
    data = request.get_json()
    
    required_fields = ['title', 'description', 'club_id']
    if not all(field in data for field in required_fields):
        return handle_error('Missing required fields', 400)
    
    club = Club.query.get(data['club_id'])
    if not club:
        return handle_error('Club not found', 404)
        
    try:
        new_project = Project(
            title=data['title'],
            description=data['description'],
            club_id=data['club_id'],
            status=data.get('status', 'pending'),
            progress_percentage=data.get('progress_percentage', 0),
            funding_status=data.get('funding_status', 'not_funded'),
            funding_amount=data.get('funding_amount', 0.00)
        )
        db.session.add(new_project)
        db.session.commit()
        return jsonify({'message': 'Project created successfully', 'project_id': new_project.id}), 201
    except Exception as e:
        db.session.rollback()
        return handle_error(f'An error occurred: {str(e)}', 500)

@projects_bp.route('/', methods=['GET'])
def get_projects():
    club_id = request.args.get('club_id')
    
    query = Project.query
    if club_id:
        query = query.filter_by(club_id=club_id)
        
    projects = query.all()
    
    project_list = [
        {
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'status': p.status,
            'progress_percentage': p.progress_percentage,
            'funding_status': p.funding_status,
            'funding_amount': str(p.funding_amount) 
        } for p in projects
    ]
    
    return jsonify(project_list)

@projects_bp.route('/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return handle_error('Project not found', 404)
    
    return jsonify({
        'id': project.id,
        'title': project.title,
        'description': project.description,
        'club_id': project.club_id,
        'status': project.status,
        'progress_percentage': project.progress_percentage,
        'funding_status': project.funding_status,
        'funding_amount': str(project.funding_amount),
        'created_at': project.created_at,
        'updated_at': project.updated_at
    })

@projects_bp.route('/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return handle_error('Project not found', 404)
        
    data = request.get_json()
    
    if 'title' in data:
        project.title = data['title']
    if 'description' in data:
        project.description = data['description']
    if 'status' in data:
        
        project.status = data['status']
    if 'progress_percentage' in data:
        project.progress_percentage = data['progress_percentage']
    if 'funding_status' in data:
        project.funding_status = data['funding_status']
    if 'funding_amount' in data:
        project.funding_amount = data['funding_amount']

    try:
        db.session.commit()
        return jsonify({'message': 'Project updated successfully'})
    except Exception as e:
        db.session.rollback()
        return handle_error(f'An error occurred: {str(e)}', 500)

@projects_bp.route('/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return handle_error('Project not found', 404)
        
    try:
        db.session.delete(project)
        db.session.commit()
        return jsonify({'message': 'Project deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return handle_error(f'An error occurred: {str(e)}', 500)