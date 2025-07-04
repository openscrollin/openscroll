import React, { useEffect, useRef, useState } from 'react';

function HeroImageManager() {
  const [heroUrl, setHeroUrl] = useState('');
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    fetch('http://localhost:5002/api/admin/hero-image')
      .then(res => res.json())
      .then(data => setHeroUrl(data.url));
  }, []);

  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch('http://localhost:5002/api/admin/hero-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMsg('✅ Hero image updated!');
        setHeroUrl(data.url);
        fileInputRef.current.value = '';
        setImage(null);
      } else setMsg('❌ Upload failed.');
    } catch {
      setMsg('❌ Upload failed.');
    }
  };

  return (
    <div style={{ fontFamily: 'Nunito Sans', maxWidth: 540 }}>
      <h2>Hero Background Image</h2>
      {heroUrl && (
        <img src={heroUrl} alt="Hero Background" style={{ width: '100%', borderRadius: 12, marginBottom: 12 }} />
      )}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
      <button onClick={handleUpload} style={{ marginLeft: 8, padding: '0.6rem 1.3rem', borderRadius: 8, fontWeight: 600 }}>
        Upload / Replace
      </button>
      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </div>
  );
}

export default HeroImageManager;
