import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from './components/Loader';

function WriterDashboard() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const writer = JSON.parse(localStorage.getItem('openscroll_current_user'));
    const token = localStorage.getItem('writerToken');
    if (!writer || !token || writer.role !== 'writer') {
      navigate('/writer/login');
      return;
    }

    fetch(`https://openscroll-backend.onrender.com/api/writer/earnings/${writer.email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles || []);
        setEarnings(data.totalEarnings || 0);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate('/writer/login');
      });
  }, [navigate]);

  const publishedArticles = articles.filter(a => a.isPublished || a.is_published).length;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalLikes = articles.reduce((sum, a) => sum + (a.likes || 0), 0);

  const statCards = [
    {
      title: 'Total Articles',
      value: articles.length,
      icon: '📝',
      color: '#d0f330',
    },
    {
      title: 'Published',
      value: publishedArticles,
      icon: '👁️',
      color: '#38bdf8',
    },
    {
      title: 'Total Views',
      value: totalViews,
      icon: '📈',
      color: '#a78bfa',
    },
    {
      title: 'Total Likes',
      value: totalLikes,
      icon: '❤️',
      color: '#f87171',
    },
    {
      title: 'Earnings',
      value: `₹${earnings}`,
      icon: '💸',
      color: '#4ade80',
    },
  ];

  if (loading) {
    return <Loader message="Loading dashboard..." type="dashboard" />;
  }

  return (
    <div style={{ padding: '5rem 2rem 2rem 2rem', minHeight: '100vh', background: '#07080a', fontFamily: "'Nunito Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff',marginBottom: '0.5rem' }}>
            Writer Dashboard
          </h1>
          <p style={{ color: '#d0f330', opacity: 0.7, fontFamily: 'monospace', fontWeight: 600, letterSpacing: 2 }}>
            CREATE.INSPIRE.EARN
          </p>
        </div>
        <Link to="/writer/new-article" style={{ textDecoration: 'none' }}>
          <button className="new-article-btn" style={{
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
            <span style={{ fontSize: '1.3rem' }}>➕</span> New Article <span style={{ fontSize: '1.1rem' }}></span>
          </button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <Link to="/writer/new-article" style={{ textDecoration: 'none' }}>
          <GlassCard>
            <div className="neon-glow" style={iconCircle('#d0f330')}>
              <span style={{ fontSize: 32 }}>✍️</span>
            </div>
            <h3 style={cardTitle}>Write New Article</h3>
            <p style={cardDesc}>Start creating your next masterpiece</p>
          </GlassCard>
        </Link>
        <Link to="/writer/articles" style={{ textDecoration: 'none' }}>
          <GlassCard>
            <div style={iconCircle('#38bdf8')}>
              <span style={{ fontSize: 32 }}>🗂️</span>
            </div>
            <h3 style={cardTitle}>Manage Articles</h3>
            <p style={cardDesc}>Edit and organize your content</p>
          </GlassCard>
        </Link>
        <Link to="/writer/earnings" style={{ textDecoration: 'none' }}>
          <GlassCard>
            <div style={iconCircle('#4ade80')}>
              <span style={{ fontSize: 32 }}>💸</span>
            </div>
            <h3 style={cardTitle}>View Earnings</h3>
            <p style={cardDesc}>Track your revenue and analytics</p>
          </GlassCard>
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
        {statCards.map((stat, idx) => (
          <GlassCard key={stat.title} style={{ minHeight: 120 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 8 }}>
              <div style={iconCircle(stat.color)}>
                <span style={{ fontSize: 24 }}>{stat.icon}</span>
              </div>
              <span style={{ color: '#b6c2b6', fontSize: 14 }}>{stat.title}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
              {stat.value}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Recent Articles & AI Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Recent Articles */}
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>Recent Articles</h3>
            <span style={{ fontSize: 20, color: '#d0f330' }}>📝</span>
          </div>
          <div>
            {articles.length > 0 ? (
              articles.slice(0, 5).map((article) => (
                <div key={article._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(208,243,48,0.04)',
                  borderRadius: 10,
                  padding: '0.8rem 1rem',
                  marginBottom: 12,
                  border: '1px solid #d0f33011'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 15, marginBottom: 2, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {article.title}
                    </div>
                    <div style={{ display: 'flex', gap: 12, color: '#b6c2b6', fontSize: 13 }}>
                      <span>👁️ {article.views || 0}</span>
                      <span>❤️ {article.likes || 0}</span>
                    </div>
                  </div>
                  <div>
                    {article.isPublished || article.is_published ? (
                      <span style={{ color: '#4ade80', fontWeight: 700, fontSize: 13 }}>LIVE</span>
                    ) : (
                      <span style={{ color: '#facc15', fontWeight: 700, fontSize: 13 }}>DRAFT</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: '#b6c2b6' }}>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>✍️</span>
                No articles yet. <br />
                <Link to="/writer/new-article">
                  <button style={{
                    marginTop: 16,
                    background: '#d0f330',
                    color: '#111',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0.6rem 1.2rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: 15,
                  }}>
                    Create First Article
                  </button>
                </Link>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
      {/* Neon-glow animation */}
      <style>{`
        @keyframes pulse {
          0% { text-shadow: 0 0 8px #d0f33055; }
          100% { text-shadow: 0 0 24px #d0f330; }
        }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .new-article-btn {
            font-size: 0.95rem !important;
            padding: 0.6rem 1rem !important;
            border-radius: 8px !important;
            gap: 0.4rem !important;
          }
      } 
      `}</style>
    </div>
  );
}

// GlassCard component for glassmorphism effect
function GlassCard({ children, style }) {
  return (
    <div
      style={{
        background: 'rgba(24,26,19,0.85)',
        borderRadius: 16,
        boxShadow: '0 4px 32px #d0f33011',
        border: '1.5px solid #d0f33022',
        padding: 24,
        marginBottom: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const iconCircle = (color) => ({
  width: 44,
  height: 44,
  borderRadius: 12,
  background: color + '22',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 8,
  border: `1.5px solid ${color}55`,
  boxShadow: `0 0 12px ${color}33`,
});

const cardTitle = {
  fontSize: 17,
  fontWeight: 600,
  color: '#fff',
  margin: '12px 0 4px 0',
};

const cardDesc = {
  color: '#b6c2b6',
  fontSize: 14,
  marginBottom: 0,
};

export default WriterDashboard;
