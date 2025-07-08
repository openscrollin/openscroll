import React, { useEffect, useRef, useState } from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

function CarouselManager() {
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const fetchImages = async () => {
    try {
      const res = await fetch('https://openscroll-backend.onrender.com/api/admin/carousel-images', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
        },
      });
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error('Error fetching carousel images:', err);
      setMessage('❌ Failed to fetch images.');
      setMessageType('error');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleUpload = async () => {
    if (!newImage) {
      setMessage('❌ Please select an image first.');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      // Upload to Firebase Storage
      const timestamp = Date.now();
      const fileName = `${timestamp}_${newImage.name}`;
      const storageRef = ref(storage, `carousel/${fileName}`);
      
      console.log('📤 Uploading carousel image to Firebase Storage...');
      
      const snapshot = await uploadBytes(storageRef, newImage);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Carousel image uploaded successfully:', downloadURL);

      // Save URL to backend database
      const res = await fetch('https://openscroll-backend.onrender.com/api/admin/carousel-images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: downloadURL }),
      });

      const data = await res.json();
      if (data.success || res.ok) {
        setMessage('✅ Image uploaded successfully!');
        setMessageType('success');
        setNewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchImages();
      } else {
        throw new Error(data.message || 'Failed to save image URL to database');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMessage(`❌ Upload failed: ${err.message}`);
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    const confirmDelete = window.confirm('Delete this image?');
    if (!confirmDelete) return;

    try {
      // Delete from backend database
      const res = await fetch(`https://openscroll-backend.onrender.com/api/admin/carousel-images/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
        },
      });

      if (res.ok) {
        // Delete from Firebase Storage
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
          console.log('✅ Image deleted from Firebase Storage');
        } catch (storageError) {
          console.warn('Could not delete from Firebase Storage:', storageError);
        }

        setMessage('✅ Image deleted successfully!');
        setMessageType('success');
        fetchImages();
      } else {
        throw new Error('Failed to delete image from database');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setMessage(`❌ Delete failed: ${err.message}`);
      setMessageType('error');
    }
  };

  return (
    <div style={{ maxWidth: '700px', fontFamily: 'Nunito Sans' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
        🖼️ Carousel Manager
      </h1>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
          style={{ marginBottom: '1rem', width: '100%' }}
        />
        <button
          onClick={handleUpload}
          disabled={uploading || !newImage}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: uploading ? '#ccc' : '#2c2c2c',
            color: '#fff',
            borderRadius: '6px',
            border: 'none',
            cursor: uploading ? 'not-allowed' : 'pointer',
            marginLeft: '0.5rem',
          }}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>

      {message && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            borderRadius: '6px',
            backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            fontWeight: 600,
          }}
        >
          {message}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>
          Current Images ({images.length}):
        </h2>
        
        {images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No carousel images uploaded yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {images.map((img) => (
              <div key={img._id} style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                overflow: 'hidden',
                backgroundColor: '#fff'
              }}>
                <img
                  src={img.url}
                  alt="carousel"
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <div style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDelete(img._id, img.url)}
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem 1rem',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CarouselManager;