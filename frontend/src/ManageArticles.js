import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Minimal icons for this project (replace with your own or a library if needed)
const Eye = () => <span role="img" aria-label="views"></span>;
//const Edit = () => <span role="img" aria-label="edit">✍️</span>;
const Trash2 = () => <span role="img" aria-label="delete">Delete</span>;
const Plus = () => <span role="img" aria-label="plus">➕</span>;
const Clock = () => <span role="img" aria-label="draft"></span>;
const CheckCircle = () => <span role="img" aria-label="published">Published</span>;
const Star = () => <span role="img" aria-label="featured">Featured</span>;
const Zap = () => <span role="img" aria-label="zap">⚡</span>;

function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
    // eslint-disable-next-line
  }, [articles, searchTerm, statusFilter]);

  const fetchArticles = async () => {
    setLoading(true);
    const writer = JSON.parse(localStorage.getItem('openscroll_current_user'));
    const token = localStorage.getItem('writerToken');
    if (!writer || !token) return;
    try {
      const res = await fetch(`https://openscroll-backend.onrender.com/api/writer/earnings/${writer.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (error) {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    switch (statusFilter) {
      case 'published':
        filtered = filtered.filter(article => article.isPublished || article.is_published);
        break;
      case 'draft':
        filtered = filtered.filter(article => !(article.isPublished || article.is_published));
        break;
      case 'premium':
        filtered = filtered.filter(article => article.isPremium || article.is_premium);
        break;
      default:
        break;
    }
    setFilteredArticles(filtered);
  };

  const deleteArticle = async (articleId) => {
    const writer = JSON.parse(localStorage.getItem('openscroll_current_user'));
    const token = localStorage.getItem('writerToken');
    if (!writer || !token) return;
    try {
      await fetch(`https://openscroll-backend.onrender.com/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(prev => prev.filter(article => article._id !== articleId));
      setShowDeleteModal(false);
      setSelectedArticle(null);
    } catch (error) {
      // handle error
    }
  };

  const togglePublishStatus = async (articleId, currentStatus) => {
    const writer = JSON.parse(localStorage.getItem('openscroll_current_user'));
    const token = localStorage.getItem('writerToken');
    if (!writer || !token) return;
    try {
      await fetch(`https://openscroll-backend.onrender.com/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      setArticles(prev =>
        prev.map(article =>
          article._id === articleId
            ? { ...article, isPublished: !currentStatus }
            : article
        )
      );
    } catch (error) {
      // handle error
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: '#07080a', fontFamily: "'Nunito Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>
            My Articles
          </h1>
          <p style={{ color: '#d0f330', opacity: 0.7, fontFamily: 'monospace', fontWeight: 600, letterSpacing: 2 }}>
            CONTENT.MANAGEMENT
          </p>
        </div>
        <Link to="/writer/new-article">
          <button style={{
            background: 'linear-gradient(90deg, #d0f330 60%, #b0e000 100%)',
            color: '#111',
            fontWeight: 700,
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: '12px',
            padding: '0.9rem 2rem',
            boxShadow: '0 0 24px #d0f33055',
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            cursor: 'pointer',
            transition: 'background 0.18s, color 0.18s'
          }}>
            <Plus /> New Article <Zap />
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: '0.7rem 1rem',
            borderRadius: 10,
            border: '1px solid #d0f33044',
            background: '#181a13',
            color: '#fff',
            width: 240,
            fontSize: 16,
            outline: 'none'
          }}
        />
        {['all', 'published', 'draft', 'premium'].map(filter => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: 8,
              border: statusFilter === filter ? '2px solid #d0f330' : '1px solid #d0f33044',
              background: statusFilter === filter ? '#d0f33022' : 'transparent',
              color: statusFilter === filter ? '#d0f330' : '#b6c2b6',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 15,
              transition: 'all 0.18s'
            }}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div style={{ color: '#b6c2b6', textAlign: 'center', marginTop: 40 }}>Loading...</div>
      ) : filteredArticles.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {filteredArticles.map(article => (
            <div key={article._id} style={{
              background: 'rgba(24,26,19,0.85)',
              borderRadius: 16,
              boxShadow: '0 4px 32px #d0f33011',
              border: '1.5px solid #d0f33022',
              padding: 24,
              marginBottom: 0,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 320,
              position: 'relative'
            }}>
              {/* Status Indicators */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                {article.isPublished || article.is_published ? (
                  <span style={{ color: '#4ade80', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle /> LIVE</span>
                ) : (
                  <span style={{ color: '#facc15', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>DRAFT</span>
                )}
                {(article.isFeatured || article.is_featured) && (
                  <span style={{ color: '#d0f330', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><Star /> FEATURED</span>
                )}
                {(article.isPremium || article.is_premium) && (
                  <span style={{ color: '#d0f330', fontWeight: 700, fontSize: 13, marginLeft: 8 }}>
                    {formatCurrency(article.price)}
                  </span>
                )}
              </div>
              {/* Cover Image */}
              {article.coverImage || article.cover_image ? (
                <img
                  src={article.coverImage || article.cover_image}
                  alt={article.title}
                  style={{
                    width: '100%',
                    height: 120,
                    objectFit: 'cover',
                    borderRadius: 12,
                    marginBottom: 12,
                    border: '1px solid #d0f33022'
                  }}
                />
              ) : null}
              {/* Content */}
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {article.title}
              </h3>
              <p style={{ color: '#b6c2b6', fontSize: 15, marginBottom: 12, minHeight: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {article.excerpt}
              </p>
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {article.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      style={{
                        fontSize: 12,
                        padding: '2px 8px',
                        background: '#d0f33022',
                        color: '#d0f330',
                        borderRadius: 8,
                        marginRight: 4
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span style={{
                      fontSize: 12,
                      padding: '2px 8px',
                      background: '#444',
                      color: '#b6c2b6',
                      borderRadius: 8
                    }}>
                      +{article.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
              {/* Stats */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#b6c2b6', fontSize: 13, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye /> {article.views || 0}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>❤️ {article.likes || 0}</span>
                </div>
                <span style={{ fontFamily: 'monospace' }}>
                  {new Date(article.createdAt || article.created_at).toLocaleDateString()}
                </span>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link to={`/article/${article._id}`} style={{ flex: 1 }}>
                  <button style={{
                    background: 'none',
                    color: '#d0f330',
                    border: '1px solid #d0f33044',
                    borderRadius: 8,
                    padding: '0.5rem 1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 15,
                    width: '100%'
                  }}>
                    <Eye /> View
                  </button>
                </Link>
                <button
                  onClick={() => togglePublishStatus(article._id, article.isPublished || article.is_published)}
                  style={{
                    background: 'none',
                    color: '#fff',
                    border: '1px solid #d0f33044',
                    borderRadius: 8,
                    padding: '0.5rem 1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 15
                  }}
                >
                  {article.isPublished || article.is_published ? <Clock /> : <CheckCircle />}
                </button>
                <button
                  onClick={() => {
                    setSelectedArticle(article);
                    setShowDeleteModal(true);
                  }}
                  style={{
                    background: 'none',
                    color: '#f87171',
                    border: '1px solid #d0f33044',
                    borderRadius: 8,
                    padding: '0.5rem 1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 15
                  }}
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'rgba(24,26,19,0.85)',
          borderRadius: 16,
          boxShadow: '0 4px 32px #d0f33011',
          border: '1.5px solid #d0f33022',
          padding: 48,
          marginTop: 32,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, color: '#b6c2b6', marginBottom: 12 }}>📄</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>No Articles Found</h3>
          <p style={{ color: '#b6c2b6', marginBottom: 24 }}>
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start creating your first article'
            }
          </p>
          <Link to="/writer/new-article">
            <button style={{
              background: 'linear-gradient(90deg, #d0f330 60%, #b0e000 100%)',
              color: '#111',
              fontWeight: 700,
              fontSize: '1.1rem',
              border: 'none',
              borderRadius: '12px',
              padding: '0.9rem 2rem',
              boxShadow: '0 0 24px #d0f33055',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.7rem',
              cursor: 'pointer',
              transition: 'background 0.18s, color 0.18s'
            }}>
              <Plus /> Create Article
            </button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedArticle && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#181a13',
            borderRadius: 16,
            padding: 32,
            minWidth: 320,
            maxWidth: '90vw',
            color: '#fff',
            boxShadow: '0 4px 32px #000a'
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Delete Article</h3>
            <p style={{ color: '#b6c2b6', marginBottom: 24 }}>
              Are you sure you want to delete "<span style={{ color: '#fff', fontWeight: 600 }}>{selectedArticle.title}</span>"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  background: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.6rem 1.2rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 15
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteArticle(selectedArticle._id)}
                style={{
                  background: '#f87171',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.6rem 1.2rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 15
                }}
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageArticles;