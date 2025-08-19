import React, { useState, useEffect } from 'react';
import CreateSocietyModal from '../components/CreateSocietyModal';
import { useNavigate } from 'react-router-dom';
import '../app.css';
import './Societiespage.css'

function SocietiesPage(){
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedSocietyId, setExpandedSocietyId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000/api/societies/';

  const fetchSocieties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSocieties(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
   
   useEffect(() => {
    fetchSocieties();
    }, []);

   const toggleExpand = (id) => {
    setExpandedSocietyId(expandedSocietyId === id ? null : id);
   };

   const handleSocietyCreated = (newSociety) => {
    fetchSocieties();
    setIsModalOpen(false);
   };

   if (loading) return <div>Loading societies...</div>;
   if (error) return <div>Error: {error}</div>;

   return (
     <div className="societies-page-container">
      <header className="App-header">
        <h1> Societies</h1>
      </header>

      <main className="main-content">
        <div className="create-society-button-wrapper">
            <button
                className="create-society-button"
                onClick={() => setIsModalOpen(true)}
            >
                Create Society
            </button>
        </div>

        <section>
          <h2>Existing Societies</h2>
          {societies.length === 0 ? (
            <p>No societies found. Be the first to create one!</p>
          ) : (
            <div className="societies-grid">
              {societies.map((society) => (
                <div
                  key={society.id}
                  className={`society-card ${expandedSocietyId === society.id ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(society.id)}
                  style={{ backgroundImage: `url(${society.image_url || 'https://via.placeholder.com/250x150?text=Society+Image'})`}}
                >
                  <h3 className="society-name">{society.name}</h3>
                  {expandedSocietyId === society.id && (
                    <div className="society-details">
                      <p><strong>Description:</strong> {society.description}</p>
                      <p><strong>Location:</strong> {society.location}</p>
                      <p><strong>Category:</strong> {society.category}</p>
                      {society.contact_email && <p><strong>Contact:</strong> {society.contact_email}</p>}
                      {society.website && <p><strong>Website:</strong> <a href={society.website} target="_blank" rel="noopener noreferrer">{society.website}</a></p>}
                      <button
                        className="view_society_button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/societies/${society.id}`);
                        }}
                        
                      >
                        View Society
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <CreateSocietyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSocietyCreated={handleSocietyCreated}
      />
    </div>
   );
 }
export default SocietiesPage;