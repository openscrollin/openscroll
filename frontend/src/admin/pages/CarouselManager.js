import React, { useEffect, useRef, useState } from 'react';

function CarouselManager() {
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // for coloring
  const fileInputRef = useRef();

  const fetchImages = () => {
    fetch('http://localhost:5002/api/admin/carousel-images', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setImages(data.images || []))
      .catch((err) => {
        console.error('Error fetching carousel images:', err);
        setMessage('❌ Failed to fetch images.');
        setMessageType('error');
      });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Remove message after 2.5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleUpload = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append('image', newImage);

    try {
      const res = await fetch('http://localhost:5002/api/admin/carousel-images', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Image uploaded successfully!');
        setMessageType('success');
        setNewImage(null);
        // Reset file input value
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchImages();
      } else {
        setMessage('❌ Upload failed.');
        setMessageType('error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('❌ Upload failed.');
      setMessageType('error');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Delete this image?');
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5002/api/admin/carousel-images/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
        },
      });
      fetchImages();
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('❌ Delete failed.');
      setMessageType('error');
    }
  };

  return (
    <div style={{ maxWidth: '700px', fontFamily: 'Nunito Sans' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
        🖼️ Carousel Manager
      </h1>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setNewImage(e.target.files[0])}
        style={{ marginBottom: '1rem' }}
      />
      <button
        onClick={handleUpload}
        style={{
          padding: '0.6rem 1.2rem',
          backgroundColor: '#2c2c2c',
          color: '#fff',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '0.5rem',
        }}
      >
        Upload Image
      </button>
      {message && (
        <p
          style={{
            marginTop: '0.7rem',
            color: messageType === 'success' ? '#22c55e' : '#ef4444',
            fontWeight: 600,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          {messageType === 'success' ? '✅' : '❌'} {message.replace(/^[✅❌]\s*/, '')}
        </p>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Current Images:</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1rem' }}>
          {images.map((img) => (
            <div key={img._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={img.url}
                alt="carousel"
                style={{
                  width: '160px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              />
              <button
                onClick={() => handleDelete(img._id)}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 1.1rem',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '0.25rem'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarouselManager;
