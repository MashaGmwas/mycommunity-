import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../app.css';

// Mock user role for demonstration. In a real app, you'd get this from a login context.
const MOCK_USER_ROLE = 'admin'; // Change to 'leader' or 'regular' to test different UIs.

const Cpdashboard = () => {
    // Get the project ID from the URL parameters
    const { projectId } = useParams();

    // State for project data
    const [project, setProject] = useState(null);
    // State for loading, errors, and "not found"
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for update form data
    const [updateForm, setUpdateForm] = useState({
        status: '',
        progress_percentage: 0,
        funding_status: '',
        funding_amount: 0.00
    });

    // Fetch the individual project data from the backend
    useEffect(() => {
        const fetchProject = async () => {
            try {
                // Fetch the project by ID
                const response = await axios.get(`http://127.0.0.1:5000/api/projects/${projectId}`);
                setProject(response.data);
                // Initialize the form with current project data
                setUpdateForm({
                    status: response.data.status,
                    progress_percentage: response.data.progress_percentage,
                    funding_status: response.data.funding_status,
                    funding_amount: response.data.funding_amount
                });
                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError('Project not found.');
                } else {
                    setError('Failed to fetch project details. Please try again.');
                }
                setLoading(false);
                console.error(err);
            }
        };
        fetchProject();
    }, [projectId]); // Re-run effect if projectId changes

    // --- Helper functions for styling ---

    const getStatusClass = (status) => {
        // Same logic as in cp.jsx
        switch (status) {
            case 'pending': return 'status-pending';
            case 'continuing_active': return 'status-active';
            case 'continuing_not_active': return 'status-on-hold';
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    const getProgressBarStyle = (percentage) => {
        // Same logic as in cp.jsx
        const color = percentage >= 100 ? '#4CAF50' : '#2196F3';
        return {
            width: `${percentage}%`,
            backgroundColor: color
        };
    };

    const getFundingClass = (status) => {
        switch (status) {
            case 'fully_funded': return 'funding-fully';
            case 'partially_funded': return 'funding-partially';
            default: return 'funding-not';
        }
    };

    // --- Form handling functions ---

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setUpdateForm(prevState => ({ ...prevState, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:5000/api/projects/${projectId}`, updateForm);
            alert('Project updated successfully!');
            // Re-fetch project data to display latest updates
            const response = await axios.get(`http://127.0.0.1:5000/api/projects/${projectId}`);
            setProject(response.data);
            setUpdateForm({
                status: response.data.status,
                progress_percentage: response.data.progress_percentage,
                funding_status: response.data.funding_status,
                funding_amount: response.data.funding_amount
            });
        } catch (err) {
            alert('Failed to update project.');
            console.error(err);
        }
    };

    // --- Conditional rendering ---

    if (loading) {
        return <div className="loading">Loading project details...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!project) {
        return <div className="no-project">Project data is missing.</div>;
    }

    // Check if the current user can update the project (leader or admin)
    const canUpdate = MOCK_USER_ROLE === 'admin' || (MOCK_USER_ROLE === 'leader' && project.club_id); // Simplified logic

    return (
        <div className="cp-dashboard-container">
            <div className="project-details-card">
                <div className="project-header">
                    <h1>{project.title}</h1>
                    <span className={`project-status ${getStatusClass(project.status)}`}>
                        {project.status.replace('_', ' ')}
                    </span>
                </div>
                <p className="project-description">{project.description}</p>
                
                {/* Associated Club/Society information */}
                <div className="project-info-item">
                    <strong>Associated with:</strong> 
                    {project.club_id ? <span> Club ID {project.club_id}</span> : <span> Independent</span>}
                </div>

                {/* Progress Bar */}
                <div className="project-info-item">
                    <strong>Progress:</strong>
                    <div className="progress-bar-container">
                        <div 
                            className="progress-bar-fill" 
                            style={getProgressBarStyle(project.progress_percentage)}
                        ></div>
                    </div>
                    <small>{project.progress_percentage}% complete</small>
                </div>
                
                {/* Funding Status */}
                <div className="project-info-item">
                    <strong>Funding Status:</strong> 
                    <span className={`funding-status ${getFundingClass(project.funding_status)}`}>
                        {project.funding_status.replace('_', ' ')}
                    </span>
                    {project.funding_amount > 0 && (
                        <small> ({project.funding_amount} funded)</small>
                    )}
                </div>
            </div>

            {/* Update Form - Only visible to authorized users */}
            {canUpdate && (
                <div className="project-update-card">
                    <h2>Update Project Status</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select name="status" id="status" value={updateForm.status} onChange={handleFormChange}>
                                <option value="pending">Pending</option>
                                <option value="continuing_active">Continuing (Active)</option>
                                <option value="continuing_not_active">Continuing (On Hold)</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="progress_percentage">Progress (%)</label>
                            <input 
                                type="number" 
                                name="progress_percentage" 
                                id="progress_percentage" 
                                value={updateForm.progress_percentage} 
                                onChange={handleFormChange}
                                min="0" 
                                max="100" 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="funding_status">Funding Status</label>
                            <select name="funding_status" id="funding_status" value={updateForm.funding_status} onChange={handleFormChange}>
                                <option value="not_funded">Not Funded</option>
                                <option value="partially_funded">Partially Funded</option>
                                <option value="fully_funded">Fully Funded</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="funding_amount">Funding Amount</label>
                            <input 
                                type="number" 
                                name="funding_amount" 
                                id="funding_amount" 
                                value={updateForm.funding_amount} 
                                onChange={handleFormChange}
                                step="0.01" 
                                min="0"
                            />
                        </div>
                        <button type="submit">Update Project</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Cpdashboard;