import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from './components/Loader';

// Simple Line Chart using Chart.js (requires chart.js and react-chartjs-2)
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function WriterEarnings() {
  const [earnings, setEarnings] = useState(0);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);

  useEffect(() => {
    const writer = JSON.parse(localStorage.getItem('openscroll_current_user'));
    const token = localStorage.getItem('writerToken');
    if (!writer || !token || writer.role !== 'writer') {
      window.location.href = '/writer/login';
      return;
    }
    fetch(`https://openscroll-backend.onrender.com/api/writer/earnings/${writer.email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setEarnings(data.totalEarnings || 0);
        setArticles(data.articles || []);
        setLoading(false);

        // Calculate monthly earnings
        const earningsByMonth = {};
        (data.articles || []).forEach(article => {
          if (article.earnings && article.createdAt) {
            const date = new Date(article.createdAt);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            earningsByMonth[month] = (earningsByMonth[month] || 0) + (article.earnings || 0);
          }
        });
        // Sort months
        const months = Object.keys(earningsByMonth).sort();
        setMonthlyEarnings(
          months.map(month => ({
            month,
            earnings: earningsByMonth[month],
          }))
        );
      })
      .catch(() => setLoading(false));
  }, []);

  // Prepare chart data
  const chartData = {
    labels: monthlyEarnings.map(m => m.month),
    datasets: [
      {
        label: 'Earnings (₹)',
        data: monthlyEarnings.map(m => m.earnings),
        fill: false,
        borderColor: '#d0f330',
        backgroundColor: '#d0f330',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => `₹${ctx.parsed.y}` } },
    },
    scales: {
      x: {
        title: { display: true, text: 'Month', color: '#b6c2b6' },
        ticks: { color: '#b6c2b6' },
        grid: { color: '#222' },
      },
      y: {
        title: { display: true, text: 'Earnings (₹)', color: '#b6c2b6' },
        ticks: { color: '#b6c2b6' },
        grid: { color: '#222' },
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <Loader message="Loading earnings..." type="dashboard" />;
  }

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: '#07080a', fontFamily: "'Nunito Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>
            Earnings
          </h1>
          <p style={{ color: '#d0f330', opacity: 0.7, fontFamily: 'monospace', fontWeight: 600, letterSpacing: 2 }}>
            REVENUE.INSIGHTS
          </p>
        </div>
        <Link to="/writer/dashboard">
          <button style={{
            background: '#d0f330',
            color: '#111',
            fontWeight: 700,
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: '12px',
            padding: '0.7rem 2rem',
            boxShadow: '0 0 24px #d0f33055',
            cursor: 'pointer'
          }}>
            Back to Dashboard
          </button>
        </Link>
      </div>
      {loading ? (
        <Loader type="dashboard" message="Loading earnings data..." />
      ) : (
        <>
          <div style={{
            background: 'rgba(24,26,19,0.85)',
            borderRadius: 16,
            boxShadow: '0 4px 32px #d0f33011',
            border: '1.5px solid #d0f33022',
            padding: 32,
            marginBottom: 32,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 32, color: '#d0f330', fontWeight: 700, fontFamily: 'monospace' }}>
              ₹{earnings}
            </div>
            <div style={{ color: '#b6c2b6', marginTop: 8, fontSize: 16 }}>
              Total Earnings
            </div>
          </div>
          {/* Line Chart for Earnings by Month */}
          <div style={{
            background: 'rgba(24,26,19,0.85)',
            borderRadius: 16,
            boxShadow: '0 4px 32px #d0f33011',
            border: '1.5px solid #d0f33022',
            padding: 32,
            marginBottom: 32,
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#fff', marginBottom: 18, fontWeight: 600 }}>Earnings Over Time</h3>
            {monthlyEarnings.length > 0 ? (
              <Line data={chartData} options={chartOptions} height={220} />
            ) : (
              <div style={{ color: '#b6c2b6' }}>No earnings data to display.</div>
            )}
          </div>
          <div style={{ marginBottom: 24, color: '#fff', fontWeight: 600, fontSize: 18 }}>
            Article Earnings Breakdown
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {articles.length > 0 ? articles.map(article => (
              <div key={article._id} style={{
                background: 'rgba(24,26,19,0.85)',
                borderRadius: 12,
                border: '1px solid #d0f33022',
                padding: 20,
                color: '#fff'
              }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: '#d0f330' }}>
                  {article.title}
                </div>
                <div style={{ color: '#b6c2b6', fontSize: 14, marginBottom: 8 }}>
                  {article.isPublished || article.is_published ? 'Published' : 'Draft'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>Views: {article.views || 0}</span>
                  <span>Likes: {article.likes || 0}</span>
                  <span>Earnings: ₹{article.earnings || 0}</span>
                </div>
              </div>
            )) : (
              <div style={{ color: '#b6c2b6', textAlign: 'center', gridColumn: '1/-1' }}>
                No articles found.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default WriterEarnings;