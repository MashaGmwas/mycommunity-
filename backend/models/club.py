
from extensions import db
from datetime import datetime

class Club(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    contact_email = db.Column(db.String(120))
    location = db.Column(db.String(100)) 
    category = db.Column(db.String(50)) 
    website = db.Column(db.String(200))
    social_media_links = db.Column(db.Text) 
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    image_url = db.Column(db.String(255), nullable=True)


    def __repr__(self):
        return f'<Club {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'contact_email': self.contact_email,
            'location': self.location,
            'category': self.category,
            'website': self.website,
            'social_media_links': self.social_media_links,
            'image_url': self.image_url,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }