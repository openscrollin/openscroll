import React, { useEffect, useState, useMemo } from 'react';
import ArticleCard from './ArticleCard';
import LoginPromoModal from './components/LoginPromptModal';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [promoArticle, setPromoArticle] = useState(null);

  const categories = ['All', 'Technology', 'Design', 'Marketing', 'Business', 'Education'];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('openscroll_current_user'));
    if (!user) setShowLoginModal(true);

    fetch('https://openscroll-backend.onrender.com/api/articles/public')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        localStorage.setItem('openscroll_all_articles', JSON.stringify(data));
        setLoading(false);
        if (!user && data.length > 0) setPromoArticle(data[0]);
      })
      .catch((err) => {
        console.error('Error fetching articles:', err);
        setLoading(false);
      });
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase());
      const priceValue = Number(article.price);
      const matchesFilter =
        filter === 'Free' ? priceValue === 0 : filter === 'Paid' ? priceValue > 0 : true;
      const matchesCategory = category === 'All' || article.category === category;
      return matchesSearch && matchesFilter && matchesCategory;
    });
  }, [articles, search, filter, category]);

  return (
    <div className="cyber-bg">
      {showLoginModal && promoArticle && (
        <LoginPromoModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          promotedArticles={[promoArticle]}
        />
      )}

      <div className="container-cyber">
        {/* Header */}
        <div className="header-cyber">
          <div className="neon-badge">Explore</div>
          <h2 className="page-title neon-text">OpenScroll Articles</h2>
          <div className="page-subtitle">AI-powered digital storytelling</div>
        </div>

        {/* Filters & Search */}
        <div className="cyber-card card-filters">
          {/* Mobile: Search and select in a row */}
          <div className="filter-search-row">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="cyber-input"
              style={{ flex: 1, marginRight: 8 }}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="cyber-input"
              style={{ width: 100, minWidth: 64 }}
            >
              <option value="All">All</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          {/* Categories: horizontal scroll on mobile */}
          <div className="left-filters-cyber responsive-scroll" style={{ marginTop: 12 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cyber-btn${category === cat ? " selected" : ""}`}
                onClick={() => setCategory(cat)}
                style={{ minWidth: 90 }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* + New Article: full width and OUTSIDE card */}
        <button
          className="cyber-btn btn-full"
          onClick={() => window.location = '/writer/new-article'}
          style={{ margin: '18px 0 8px 0' }}
        >
          + New Article
        </button>

        {/* Results count */}
        <div className="stories-found">
          {filteredArticles.length} stories found{search && ` for "${search}"`}
        </div>

        {/* Grid */}
        <div className="grid-cyber">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card-cyber"></div>
            ))
            : filteredArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
        </div>
      </div>

      {/* Neon/Cyber Styles (Mobile Responsive) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;700&family=Nunito+Sans:wght@700&display=swap');
        body, html { font-family: 'Nunito Sans', 'Fira Mono', monospace, sans-serif; margin: 0; color: #fff; }
        .cyber-bg {
          position: relative;
          min-height: 100vh;
          background: #07080a;
          overflow-x: hidden;
        }
        .cyber-bg:before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            repeating-linear-gradient(to right, #d0f33010 0 1px, transparent 1px 80px),
            repeating-linear-gradient(to bottom, #d0f33010 0 1px, transparent 1px 80px);
          z-index: 0;
          pointer-events: none;
          animation: cyberbgmove 8s linear infinite;
        }
        @keyframes cyberbgmove {
          0%   { background-position: 0 0, 0 0; }
          100% { background-position: 80px 80px, 80px 80px; }
        }
        .container-cyber {
          max-width: 1280px;
          margin: 0 auto;
          padding-top: 36px;
          padding-left: 1rem;
          padding-right: 1rem;
          padding-bottom: 3rem;
          padding-top: 5rem;
          position: relative;
          z-index: 2;
        }
        .header-cyber {
          text-align: center;
          margin: 2.2rem 0 1.5rem 0;
        }
        .neon-badge {
          display: inline-block;
          background: rgba(208,243,48,0.10);
          border: 1.5px solid rgba(208,243,48,0.35);
          color: #d0f330;
          font-family: 'Fira Mono', monospace;
          font-size: 0.92rem;
          border-radius: 22px;
          padding: 4px 16px;
          margin-bottom: 8px;
          letter-spacing: 0.03em;
        }
        .neon-text {
          color: #d0f330;
          animation: neonPulse 1.4s infinite alternate;
        }
        @keyframes neonPulse {
          0%, 100% { text-shadow: 0 0 12px #d0f330, 0 0 2px #d0f330;}
          50%      { text-shadow: 0 0 28px #d0f330, 0 0 8px #d0f330; }
        }
        .page-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0.4em 0 0.3em 0;
          font-family: 'Nunito Sans', sans-serif;
          letter-spacing: -0.5px;
        }
        .page-subtitle {
          font-size: 1.1rem;
          color: #d0f330bb;
          font-family: 'Fira Mono', monospace;
        }
        .card-filters {
          max-width: 1100px;
          margin: 0 auto 2rem auto;
          padding: 1.2rem 1rem;
        }
        .cyber-card {
          background: rgba(208,243,48,0.07);
          border: 2px solid #d0f33099;
          box-shadow: 0 0 60px 10px #d0f33033, 0 0 2px #d0f330;
          border-radius: 18px;
          position: relative;
          z-index: 1;
          overflow: visible;
          transition: box-shadow .18s, border-color .18s;
        }
        .cyber-card:hover {
          box-shadow: 0 0 90px 24px #d0f33077, 0 0 2px #d0f330;
          border-color: #d0f330;
        }
        .filter-bar-cyber {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.3rem;
        }
        .left-filters-cyber {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          flex-grow: 1;
        }
        .right-filters-cyber {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
          justify-content: flex-end;
          align-items: center;
          min-width: 0;
        }
        .cyber-btn {
          background: rgba(208,243,48,0.09);
          border: 2px solid #d0f33099;
          color: #d0f330;
          border-radius: 9px;
          padding: 0.55em 1.2em;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          box-shadow: 0 0 14px #d0f33022;
          transition: background .16s, box-shadow .16s, color .14s;
          cursor: pointer;
          outline: none;
        }
        .cyber-btn.selected,
        .cyber-btn:active,
        .cyber-btn:focus {
          background: #070617;
          color: #fff700;
          box-shadow: 0 0 22px #fff70099, 0 0 4px #fff700;
          border-color: #fff700;
        }
        .cyber-btn:hover {
          background: #d0f33011;
          color: #fff700;
          box-shadow: 0 0 18px #fff70088;
        }
        .cyber-input {
          background: rgba(208,243,48,0.10);
          border: 2px solid #d0f33099;
          color: #d0f330;
          border-radius: 12px;
          padding: 0.7em 1em;
          outline: none;
          font-size: 1rem;
          box-shadow: 0 0 10px #d0f33033;
          transition: border-color .15s, box-shadow .15s, color .15s;
          font-family: 'Nunito Sans', sans-serif;
        }
        .cyber-input:focus {
          border-color: #fff700;
          color: #fff700;
          box-shadow: 0 0 18px #d0f33099, 0 0 3px #fff700;
        }
        .stories-found {
          color: #d0f330;
          font-family: "Fira Mono", monospace;
          margin-bottom: 20px;
          font-size: 1rem;
        }
        .grid-cyber {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 1.2rem;
          margin-top: 1.1rem;
        }
        .skeleton-card-cyber {
          background: linear-gradient(135deg,#e4f5c4 10%, #c9c9c9 90%);
          border-radius: 15px;
          height: 370px;
          animation: pulse 1.0s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        /* Mobile Styles */
        @media (max-width: 900px) {
          .container-cyber { padding-left: 0.2rem; padding-right: 0.2rem; }
          .grid-cyber { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .header-cyber { margin: 1.1rem 0 1rem 0; }
          .card-filters {
            padding: 0.7rem 0.3rem;
          }
          .filter-bar-cyber,
          .right-filters-cyber {
            display: none !important; /* Hide old layouts on mobile */
          }
          .filter-search-row {
            display: flex;
            flex-direction: row;
            gap: 0.38rem;
            margin-bottom: 0.6rem;
            width: 100%;
          }
          .left-filters-cyber.responsive-scroll {
            flex-wrap: nowrap;
            overflow-x: auto;
            gap: 0.38rem;
            padding-bottom: 2px;
            margin-bottom: 0.3rem;
            margin-top: 12px; /* Ensure margin top is applied */
          }
          .left-filters-cyber.responsive-scroll::-webkit-scrollbar {
            display: none;
          }
          .cyber-btn {
            padding: 0.4em 0.9em;
            font-size: 0.97rem;
            border-radius: 7px;
            min-width: 80px;
            flex: 0 0 auto;
            margin-bottom: 0;
            margin-right: 0.12rem;
          }
          .cyber-input {
            width: 100%;
            font-size: 0.97rem;
            border-radius: 7px;
          }
          .btn-full {
            width: 100%;
            display: block;
            font-size: 1.07rem;
            margin-top: 0.5rem;
            margin-bottom: 0.1rem;
          }
        }
        @media (max-width: 400px) {
          .page-title { font-size: 1.3rem; }
          .neon-badge, .page-subtitle { font-size: 0.77rem; }
        }
      `}</style>
    </div>
  );
}

export default Articles;