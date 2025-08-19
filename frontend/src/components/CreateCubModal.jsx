import React, { useState } from 'react';
import './Createmodal.css'; 

const CreateClubModal = ({ isOpen, onClose, onClubCreated }) => {
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [contactEmail, setContactEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [socialMediaLinks, setSocialMediaLinks] = useState('');

    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    
    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setIsLoading(true); 
        setError(null); 

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('category', category);
        formData.append('contact_email', contactEmail);
        formData.append('website', website);
        formData.append('social_media_links', socialMediaLinks); 


        if  (imageFile) {
            formData.append('image', imageFile);
        }

        try {   
            const response = await fetch('http://localhost:5000/api/clubs/createclub', {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                try{
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || 'Failed to create club');
                } catch (parseError){                
                throw new Error(response.statusText || 'An unknown server error occurred');
                }
            }

            const result = await response.json(); 
            alert('Club created successfully!'); 
            onClubCreated(result.club); 
            onClose(); 

            setName('');
            setDescription('');
            setLocation('');
            setCategory('');
            setImageFile(null);
            setContactEmail(''); 
            setWebsite('');
            setSocialMediaLinks('');

        } catch (err) {
            console.error('Error creating club:', err);
            setError(err.message); 
        } finally {
            setIsLoading(false); 
        }
    };

    
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={handleContentClick}>
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Create New Club</h2>
                {error && <p className="error-message">{error}</p>} 
                <form onSubmit={handleSubmit}>
                    <label>
                        Club Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </label>
                    <label>
                        Location:
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Category:
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Club Image (Optional):
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </label>
                    <label>
                        Contact Email:
                        <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}                            
                        />
                    </label>
                    <label>
                        Website URL:
                        <input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </label>
                    <label>
                        Social Media Links:
                        <input
                            type="text" 
                            value={socialMediaLinks}
                            onChange={(e) => setSocialMediaLinks(e.target.value)}
                        />
                    </label>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateClubModal;