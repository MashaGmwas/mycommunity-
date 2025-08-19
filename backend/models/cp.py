from extensions import db
from datetime import datetime

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    club_id = db.Column(db.Integer, db.ForeignKey('club.id'), nullable=False)
    club = db.relationship('Club', backref=db.backref('projects', lazy=True))
    
    status = db.Column(db.String(20), default='pending', nullable=False) 
    
    progress_percentage = db.Column(db.Integer, default=0, nullable=False) 
    
    funding_status = db.Column(db.String(20), default='not_funded', nullable=False)
    funding_amount = db.Column(db.Numeric(10, 2), default=0.00) 
      
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    def __repr__(self):
        return f'<Project {self.title}>'



