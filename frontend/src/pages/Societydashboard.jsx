import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../app.css';

function Societydashboard() {
  const { id } = useParams();
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isMember, setIsMember] = useState(false);
  const [isSocietyLeader, setIsSocietyLeader] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api/societies/';

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSociety(data);

        if (id === '1') {
          setIsMember(true);
        }
        if (id === '2') {
          setIsMember(true);
          setIsSocietyLeader(true);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSociety();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading society dashboard...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Error: {error}</div>;
  if (!society) return <div style={{ textAlign: 'center', padding: '20px' }}>Society not found.</div>;

  return (
    <div className="society-detail-page" style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <div className="society-sidebar" style={{ flex: '0 0 250px', background: '#f0f2f5', padding: '15x', borderRadius: '8px', boxshadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <h3 style={{ marginTop: '0' }}>{society.name} Sections</h3>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          <li><a href="#overview" style={{ textDecoration: 'none', color: '#007bff' }}>Overview</a></li>
          {isMember && (
            <>
              <li><a href="#notice-board" style={{ textDecoration: 'none', color: '#007bff' }}>Notice Board</a></li>
              <li><a href="#chat-space" style={{ textDecoration: 'none', color: '#007bff' }}>Chat Space</a></li>
              <li><a href="#members" style={{ textDecoration: 'none', color: '#007bff' }}>Members</a></li>
              <li><a href="#calendar" style={{ textDecoration: 'none', color: '#007bff' }}>Calendar</a></li>
              {}
            </>
          )}
        </ul>
        <Link to="/societies" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none', color: '#666' }}>
          &lt; Back to All Societies
        </Link>
      </div>
      <div className="society-main-content" style={{ flex: '1', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <section id="overview" style={{ marginBottom: '30px' }}>
          <h2 style={{ marginTop: '0' }}>Overview: {society.name}</h2>
            <img
              src={society.image_url || 'https://via.placeholder.com/400x250?text=Society+Image'}
              alt={society.name}
              className="society-detail-image"
              style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto 20px auto', borderRadius: '8px' }}
            />
            <p><strong>Description:</strong> {society.description}</p>
            <p><strong>Location:</strong> {society.location}</p>
            <p><strong>Category:</strong> {society.category}</p>
            {society.contact_email && <p><strong>Contact:</strong> {society.contact_email}</p>}
            {society.website && <p><strong>Website:</strong> <a href={society.website} target="_blank" rel="noopener noreferrer">{society.website}</a></p>}
            {society.social_media_links && <p><strong>Social Media:</strong> {society.social_media_links}</p>}
            {society.created_at && <p><strong>Founded:</strong> {new Date(society.created_at).toLocaleDateString()}</p>}
        </section>

        {!isMember ? (
          <section className="restricted-content" style={{ background: '#fff3cd', paddig: '20px', borderRadius: '8px', border: '1px solid #ffeeba', textAlign: 'center', marginTop: '30px'}}>
            <h2>Join Us to See More!</h2>
            <p>Register and become an approved member to access the full society dashboard, including notice board, chat, members list, and calendar.</p>
            <button style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Request to Join
            </button>
          </section>
        ) : (
          <>
            <section id="notice-board" style={{ marginBottom: '30px' }}>
              <h2>Notice Board</h2>
              {isSocietyLeader && (
                <div style={{ marginBottom: '15px', padding: '10px', background: '#e9ecef', borderRadius: '5px' }}>
                  <textarea placeholder="Post a new message..." style={{ width: '100%', minHeight: '80px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}></textarea>
                  <button style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' }}>
                    Post Message
                  </button>
                </div>
              )}
              <div className="notice-list">
                <p>No new notices. (Messages from society leaders will appear here)</p>
              </div>
            </section>

            <section id="chat-space" style={{ marginBottom: '30px' }}>
              <h2>Chat Space</h2>
              <div style={{ height: '200px', border: '1px solid #ccc', borderRadius: '5px', overflowY: 'auto', padding: '10px', marginBottom: '10px', background: '#f8f9fa' }}>
                <p>Welcome to the chat! (Chat messages will appear here)</p>
              </div>
              <input type="text" placeholder="Type your message..." style={{ width: 'calc(100% - 70px)', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <button style={{ width: '60px', padding: '8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '5px' }}>Send</button>
            </section>

            <section id="members" style={{ marginBottom: '30px' }}>
              <h2>Society Members</h2>
              <ul style={{ listStyle: 'none', padding: '0' }}>
                <li>Member 1</li>
                <li>Member 2</li>
                <li>Member 3</li>
                {}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default Societydashboard;