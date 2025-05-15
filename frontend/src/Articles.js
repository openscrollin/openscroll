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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  const categories = ['All', 'Technology', 'Design', 'Marketing', 'Business', 'Education'];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('openscroll_current_user'));
    if (!user) {
      setShowLoginModal(true);
    }

    fetch('http://localhost:5002/api/articles/public')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        localStorage.setItem('openscroll_all_articles', JSON.stringify(data));
        setLoading(false);

        if (!user && data.length > 0) {
          setPromoArticle(data[0]);
        }
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

  const container = {
    maxWidth: '1280px',
    margin: '0 auto',
    paddingTop: isMobile ? '80px' : '90px', // ✅ Responsive but not excessive
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingBottom: '3rem',
    fontFamily: "'Nunito Sans', sans-serif",
    boxSizing: 'border-box',
  };

  const filterBar = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1rem',
  };

  const leftFilters = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    flexGrow: 1,
  };

  const rightFilters = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    justifyContent: 'flex-end',
  };

  const tabButton = (tab) => ({
    padding: '0.45rem 1rem',
    fontSize: '0.9rem',
    borderRadius: '999px',
    border: '1px solid #d1d5db',
    backgroundColor: category === tab ? '#2c2c2c' : '#fff',
    color: category === tab ? '#fff' : '#111827',
    cursor: 'pointer',
  });

  const searchInput = {
    padding: '0.6rem 1rem',
    borderRadius: '999px',
    border: '1px solid #d1d5db',
    fontSize: '0.9rem',
    minWidth: '220px',
    flexGrow: 1,
  };

  const select = {
    padding: '0.6rem 1rem',
    borderRadius: '999px',
    border: '1px solid #d1d5db',
    fontSize: '0.9rem',
    backgroundColor: '#fff',
    color: '#111827',
    appearance: 'none',
  };

  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  };

  const skeletonCard = {
    backgroundColor: '#c9c9c9',
    borderRadius: '16px',
    height: '420px',
    animation: 'pulse 1.0s infinite ease-in-out',
  };

  return (
    <>
      {showLoginModal && promoArticle && (
        <LoginPromoModal
          onClose={() => setShowLoginModal(false)}
          adArticle={promoArticle}
        />
      )}
      <div style={container}>
        <div style={filterBar}>
          <div style={leftFilters}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} style={tabButton(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div style={rightFilters}>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchInput}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={select}
            >
              <option value="All">All</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <div style={grid}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={skeletonCard}></div>
              ))
            : filteredArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </>
  );
}

export default Articles;
