import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhotos();
  }, [filterCategory]);

  const getAuthHeader = () => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if (!email || !password) {
      alert("Sesión expirada. Inicia sesión nuevamente.");
      navigate("/login");
      return;
    }
    const credentials = btoa(`${email}:${password}`);
    if (!credentials) return null;
    return { Authorization: `Basic ${credentials}` };
  };

  const fetchPhotos = async () => {
    const headers = getAuthHeader();
    if (!headers) {
      alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      navigate("/login");
      return;
    }

    try {
      let url = 'http://localhost:8080/api/photos';
      if (filterCategory.trim() !== '') {
        url = `http://localhost:8080/api/photos/category/${filterCategory}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      } else {
        console.error('Error al obtener fotos. Status:', response.status);
      }
    } catch (error) {
      console.error('Error al hacer fetch:', error);
    }
  };

  const handleDelete = async (photoId) => {
    const confirm = window.confirm('¿Estás seguro de que quieres eliminar esta foto?');
    if (!confirm) return;

    const headers = getAuthHeader();
    if (!headers) {
      alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/photos/${photoId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        setPhotos(photos.filter(photo => photo.id !== photoId));
      } else {
        console.error('Error al eliminar la foto. Status:', response.status);
      }
    } catch (error) {
      console.error('Error al eliminar la foto:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📸 Galería de Fotos</h2>

      <div style={styles.filterContainer}>
        <label style={styles.filterLabel}>Filtrar por categoría:</label>
        <input
          type="text"
          placeholder="Vacaciones, Cumpleaños, etc."
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.gallery}>
        {photos.map(photo => (
          <div key={photo.id} style={styles.card}>
            <img
              src={photo.url}
              alt={photo.description}
              style={styles.image}
            />
            <p style={styles.category}><strong>Categoría:</strong> {photo.category}</p>
            <p style={styles.description}>{photo.description}</p>
            <button onClick={() => handleDelete(photo.id)} style={styles.deleteButton}>
              🗑 Eliminar
            </button>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          style={styles.backButton}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#ff8787'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f9f9fb',
    minHeight: '100vh'
  },
  title: {
    textAlign: 'center',
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#333'
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2rem',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  filterLabel: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#333'
  },
  searchInput: {
    padding: '0.7rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '10px',
    fontSize: '1rem',
    width: '300px',
    outline: 'none',
    backgroundColor: '#fff',
    transition: '0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  gallery: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '2rem'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
    padding: '1rem',
    width: '220px',
    textAlign: 'center',
    transition: 'transform 0.2s ease-in-out'
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    marginBottom: '1rem'
  },
  category: {
    fontSize: '0.95rem',
    color: '#666',
    marginBottom: '0.5rem'
  },
  description: {
    fontSize: '1rem',
    color: '#444',
    marginBottom: '1rem'
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff5c5c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  backButton: {
    padding: '0.7rem 1.5rem',
    backgroundColor: '#ff6b6b',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s ease'
  }
};

export default PhotoGallery;
