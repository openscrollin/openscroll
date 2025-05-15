import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#2C9CF0', '#10B981'];

function ReaderDashboard() {
  const [purchased, setPurchased] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('openscroll_reader_token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5002/api/reader/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setPurchased(data.purchased || []);
        setFavorites(data.favorites || []);
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardStyle = {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    fontFamily: 'Nunito Sans',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const wrapperStyle = {
    padding: '2rem',
    fontFamily: 'Nunito Sans',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
  };

  const categoryData = categories.map((cat) => ({
    category: cat,
    count: purchased.filter((a) => a.category === cat).length,
  }));

  const pieData = [
    { name: 'Purchased', value: purchased.length },
    { name: 'Favorites', value: favorites.length },
  ];

  return (
    <div style={wrapperStyle}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
        📊 Reader Dashboard
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={cardStyle}>
            <h3>Total Articles Purchased: {purchased.length}</h3>
            <h3>Total Favorites: {favorites.length}</h3>
            <h3>Categories Explored: {categories.length}</h3>
          </div>

          {/* DEBUG: Show raw data */}
          <pre style={{ fontSize: '0.8rem', color: '#4b5563' }}>
            {JSON.stringify({ categoryData, pieData }, null, 2)}
          </pre>

          {/* Bar Chart */}
          {categoryData.length > 0 && (
            <div style={cardStyle}>
              <h3 style={{ marginBottom: '1rem' }}>📘 Articles Purchased by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="category" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2C9CF0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Pie Chart */}
          {(purchased.length > 0 || favorites.length > 0) && (
            <div style={cardStyle}>
              <h3 style={{ marginBottom: '1rem' }}>❤️ Favorites vs Purchased</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReaderDashboard;
