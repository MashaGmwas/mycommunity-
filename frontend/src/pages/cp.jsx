import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './cp.css'; // Assuming you'll have a CSS file for styling

const CommunityProjects = () => {
    // State to hold the list of projects
    const [projects, setProjects] = useState([]);
    // State to handle loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch projects from the backend API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Adjust the API endpoint as needed
                const response = await axios.get('http://127.0.0.1:5000/api/projects');
                setProjects(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch projects. Please try again later.');
                setLoading(false);
                console.error(err);
            }
        };
        fetchProjects();
    }, []); // The empty array ensures this runs only once on component mount

    // --- Helper components and functions ---

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'continuing_active': return 'status-active';
            case 'continuing_not_active': return 'status-on-hold';
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    const getFundingClass = (status) => {
        switch (status) {
            case 'fully_funded': return 'funding-fully';
            case 'partially_funded': return 'funding-partially';
            default: return 'funding-not';
        }
    };

    const getProgressBarStyle = (percentage) => {
        const color = percentage >= 100 ? '#4CAF50' : '#2196F3';
        return {
            width: `${percentage}%`,
            backgroundColor: color
        };
    };

    // --- Conditional rendering based on state ---

    if (loading) {
        return <div className="loading">Loading community projects...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }
    
    // --- The main component JSX ---

    return (
        <div className="community-projects-container">
            <h2>Community Projects</h2>
            <div className="project-list">
                {projects.length > 0 ? (
                    projects.map(project => (
                        <div key={project.id} className="project-card">
                            <div className="project-header">
                                <h3>{project.title}</h3>
                                <span className={`project-status ${getStatusClass(project.status)}`}>
                                    {project.status.replace('_', ' ')}
                                </span>
                            </div>
                            <p>{project.description}</p>
                            
                            {/* Progress Bar Section */}
                            <div className="progress-bar-container">
                                <div 
                                    className="progress-bar-fill" 
                                    style={getProgressBarStyle(project.progress_percentage)}
                                ></div>
                            </div>
                            <small>Progress: {project.progress_percentage}%</small>

                            {/* Funding Status Section */}
                            <div className="funding-info">
                                <strong>Funding:</strong> 
                                <span className={`funding-status ${getFundingClass(project.funding_status)}`}>
                                    {project.funding_status.replace('_', ' ')}
                                </span>
                                {project.funding_amount > 0 && (
                                    <small> ({project.funding_amount} funded)</small>
                                )}
                            </div>

                            {/* Display if the project belongs to a club/society */}
                            {project.club_id && (
                                <div className="project-association">
                                    Associated with Club ID: {project.club_id}
                                </div>
                            )}

                            {/* You could add more details here, like buttons for 'Join' or 'View Details' */}
                        </div>
                    ))
                ) : (
                    <div className="no-projects">No community projects found at the moment.</div>
                )}
            </div>
        </div>
    );
};

export default CommunityProjects;