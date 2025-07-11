import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css'; 

function Clubspage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedClubId, setExpandedClubId] = useState(null);

  const navigate = useNavigate();

  const [newClubName, setNewClubName] = useState('');
  const [newClubDescription, setNewClubDescription] = useState('');
  const [newClubLocation, setNewClubLocation] = useState('');
  const [newClubCategory, setNewClubCategory] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api/clubs/';

  useEffect(() => {
    const fetchClubs = async () => {
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

    fetchClubs();
  }, []); 

  const toggleExpand = (id) => {
   setExpandedClubId(expandedClubId === id ? null : id);
  };

  const handleAddClub = async (e) => {
    e.preventDefault(); 
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newClubName,
          description: newClubDescription,
          location: newClubLocation,
          category: newClubCategory,
          contact_email: 'info@example.com', 
          website: 'http://example.com', 
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const addedClub = await response.json();
      setClubs([...clubs, addedClub]); 
      setNewClubName('');
      setNewClubDescription('');
      setNewClubLocation('');
      setNewClubCategory('');
    } catch (e) {
      setError(e.message);
    }
  };


  if (loading) return <div>Loading clubs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <header className="App-header" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#282c34', color: 'white' }}>
        <h1> Community Hub: Clubs</h1>
      </header>

      <main style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        <section>
          <h2>Add New Club</h2>
          <form onSubmit={handleAddClub} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Club Name"
              value={newClubName}
              onChange={(e) => setNewClubName(e.target.value)}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              placeholder="Description"
              value={newClubDescription}
              onChange={(e) => setNewClubDescription(e.target.value)}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
             <input
              type="text"
              placeholder="Location"
              value={newClubLocation}
              onChange={(e) => setNewClubLocation(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
             <input
              type="text"
              placeholder="Category"
              value={newClubCategory}
              onChange={(e) => setNewClubCategory(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={{ gridColumn: '1 / span 2', padding: '10px 15px', backgroundColor: '#61dafb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Add Club
            </button>
          </form>
        </section>

        <section>
          <h2>Existing Clubs</h2>
          {clubs.length === 0 ? (
            <p>No clubs found. Add some above!</p>
          ) : (
            <div className="clubs-grid">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className={`club-card ${expandedClubId === club.id ? 'expanded' : ''}`} 
                  onClick={() => toggleExpand(club.id)} 
                >
                  {}
                  <img
                     src={club.image_url || 'https://via.placeholder.com/250x150?text=Club+Image'} 
                     alt={club.name}
                     className="club-image"
                  />
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
                      style={{ 
                        marginTop: '10px',
                        padding: '8px 15px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        width: '100%', 
                        boxSizing: 'border-box'
                      }}
                      >
                        View CLub 
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Clubspage;