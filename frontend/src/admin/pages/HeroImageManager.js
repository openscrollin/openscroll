import React, { useEffect, useRef, useState } from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

function HeroImageManager() {
  const [heroUrl, setHeroUrl] = useState('');
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchHeroImage();
  }, []);

  const fetchHeroImage = async () => {
    try {
      const res = await fetch('https://openscroll-backend.onrender.com/api/admin/hero-image');
      const data = await res.json();
      setHeroUrl(data.url || '');
    } catch (err) {
      console.error('Error fetching hero image:', err);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setMsg('❌ Please select an image first.');
      return;
    }

    setUploading(true);
    setMsg('');

    try {
      // Upload to Firebase Storage
      const timestamp = Date.now();
      const fileName = `${timestamp}_${image.name}`;
      const storageRef = ref(storage, `hero/${fileName}`);
      
      console.log('📤 Uploading hero image to Firebase Storage...');
      
      const snapshot = await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Hero image uploaded successfully:', downloadURL);

      // Save URL to backend database
      const res = await fetch('https://openscroll-backend.onrender.com/api/admin/hero-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: downloadURL }),
      });

      const data = await res.json();
      if (data.success || res.ok) {
        setMsg('✅ Hero image updated successfully!');
        setHeroUrl(downloadURL);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setImage(null);
      } else {
        throw new Error(data.message || 'Failed to save image URL to database');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMsg(`❌ Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!heroUrl) return;
    
    const confirmDelete = window.confirm('Remove the current hero image?');
    if (!confirmDelete) return;

    try {
      // Delete from Firebase Storage
      const imageRef = ref(storage, heroUrl);
      await deleteObject(imageRef);
      
      // Remove from backend database
      const res = await fetch('https://openscroll-backend.onrender.com/api/admin/hero-image', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
        },
      });

      if (res.ok) {
        setMsg('✅ Hero image removed successfully!');
        setHeroUrl('');
      } else {
        throw new Error('Failed to remove image from database');
      }
    } catch (err) {
      console.error('Remove error:', err);
      setMsg(`❌ Remove failed: ${err.message}`);
    }
  };

  return (
    <div style={{ fontFamily: 'Nunito Sans', maxWidth: 600 }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
        Hero Background Image
      </h2>
      
      {heroUrl && (
        <div style={{ marginBottom: '1.5rem' }}>
          <img 
            src={heroUrl} 
            alt="Hero Background" 
            style={{ 
              width: '100%', 
              maxHeight: '300px',
              objectFit: 'cover',
              borderRadius: 12, 
              border: '1px solid #ddd'
            }} 
          />
          <button
            onClick={handleRemove}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Remove Current Image
          </button>
        </div>
      )}

      <div style={{ 
        padding: '1rem', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          onChange={e => setImage(e.target.files[0])}
          style={{ marginBottom: '1rem', width: '100%' }}
        />
        <button 
          onClick={handleUpload}
          disabled={uploading || !image}
          style={{ 
            padding: '0.6rem 1.3rem', 
            backgroundColor: uploading ? '#ccc' : '#2c2c2c',
            color: '#fff',
            border: 'none',
            borderRadius: 8, 
            fontWeight: 600,
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? 'Uploading...' : 'Upload / Replace'}
        </button>
      </div>

      {msg && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem',
          borderRadius: '6px',
          backgroundColor: msg.includes('❌') ? '#f8d7da' : '#d4edda',
          color: msg.includes('❌') ? '#721c24' : '#155724',
          border: `1px solid ${msg.includes('❌') ? '#f5c6cb' : '#c3e6cb'}`,
          fontWeight: 600,
        }}>
          {msg}
        </div>
      )}
    </div>
  );
}

export default HeroImageManager;