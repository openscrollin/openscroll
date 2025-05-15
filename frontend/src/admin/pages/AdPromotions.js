import React, { useEffect, useState } from 'react';

function AdPromotions() {
  const [articles, setArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5002/api/articles/public')
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error('Error fetching articles:', err));
  }, []);

  const toggleSelection = (id) => {
    setSaved(false);
    if (selectedArticles.includes(id)) {
      setSelectedArticles((prev) => prev.filter((a) => a !== id));
    } else if (selectedArticles.length < 3) {
      setSelectedArticles((prev) => [...prev, id]);
    } else {
      alert('You can only promote up to 3 articles.');
    }
  };

  const handleSave = () => {
    fetch('http://localhost:5002/api/admin/feature-article', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
      },
      body: JSON.stringify({ articleIds: selectedArticles }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSaved(true);
      })
      .catch((err) => console.error('Error saving promotion:', err));
  };

  const containerStyle = {
    maxWidth: '700px',
    fontFamily: 'Nunito Sans',
  };

  const cardStyle = (isSelected) => ({
    border: isSelected ? '2px solid #2C9CF0' : '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: isSelected ? '#ecf8ff' : '#fff',
    cursor: 'pointer',
  });

  const buttonStyle = {
    backgroundColor: '#2c2c2c',
    color: '#fff',
    padding: '0.7rem 1.2rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
        Ad Promotions
      </h1>

      <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
        Select up to 3 articles to promote. Priority is based on selection order.
      </p>

      {articles.map((article) => {
        const isSelected = selectedArticles.includes(article._id);
        const order = selectedArticles.indexOf(article._id);
        return (
          <div
            key={article._id}
            style={cardStyle(isSelected)}
            onClick={() => toggleSelection(article._id)}
          >
            <h3 style={{ margin: '0 0 0.3rem' }}>{article.title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#555' }}>{article.category}</p>
            <p style={{ fontSize: '0.85rem', color: '#777' }}>
              {isSelected ? `Selected as priority ${order + 1}` : 'Click to promote'}
            </p>
          </div>
        );
      })}

      <button style={buttonStyle} onClick={handleSave} disabled={selectedArticles.length === 0}>
        Save Promotions
      </button>

      {saved && (
        <p style={{ color: '#16a34a', marginTop: '1rem' }}>✅ Promotions saved successfully!</p>
      )}
    </div>
  );
}

export default AdPromotions;
