import React, { useState, useEffect } from 'react';
import CreateClubModal from '../components/CreateCubModal';
import { useNavigate } from 'react-router-dom';
import '../app.css'; 
import './Clubspage.css'

function Clubspage(){
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedClubId, setExpandedClubId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000/api/clubs/';

  const fetchClubs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL); 
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClubs(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
   
   useEffect(() => {
    fetchClubs();
    }, []); 

   const toggleExpand = (id) => {
   setExpandedClubId(expandedClubId === id ? null : id);
   };

   const handleClubCreated = (newClub) => {
    fetchClubs();
    setIsModalOpen(false);
   };

   if (loading) return <div>Loading clubs...</div>;
   if (error) return <div>Error: {error}</div>;

   return (
     <div className="clubs-page-container"> 
      <header className="App-header">
        <h1> Clubs</h1>
      </header>

      <main className="main-content"> 
        <div className="create-club-button-wrapper">
            <button
                className="create-club-button"
                onClick={() => setIsModalOpen(true)}
            >
                Create Club
            </button>
        </div>

        <section>
          <h2>Existing Clubs</h2>
          {clubs.length === 0 ? (
            <p>No clubs found. Be the first to create one!</p>
          ) : (
            <div className="clubs-grid">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className={`club-card ${expandedClubId === club.id ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(club.id)}
                  style={{ backgroundImage: `url(${club.image_url || 'https://via.placeholder.com/250x150?text=Club+Image'})`}}
                >                  
                  <h3 className="club-name">{club.name}</h3>
                  {expandedClubId === club.id && (
                    <div className="club-details">
                      <p><strong>Description:</strong> {club.description}</p>
                      <p><strong>Location:</strong> {club.location}</p>
                      <p><strong>Category:</strong> {club.category}</p>
                      {club.contact_email && <p><strong>Contact:</strong> {club.contact_email}</p>}
                      {club.website && <p><strong>Website:</strong> <a href={club.website} target="_blank" rel="noopener noreferrer">{club.website}</a></p>}
                      <button
                        className="view_club_button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/clubs/${club.id}`);
                        }}
                       
                      >
                        View Club
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <CreateClubModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClubCreated={handleClubCreated}
      />
    </div>
   );
  } 
export default Clubspage;