const express = require('express');
const cors = require('cors');
const articles = require('./articlesData');

const app = express();
const PORT = process.env.PORT || 5001; // ✅ Use dynamic port for production

// Middlewares
app.use(cors()); // ✅ Enable CORS for frontend-backend communication
app.use(express.json()); // ✅ To parse JSON request bodies

// Routes
app.get('/api/articles', (req, res) => {
  res.json(articles);
});

app.get('/api/articles/:id', (req, res) => {
  const article = articles.find(a => a.id === parseInt(req.params.id));
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ message: 'Article not found' });
  }
});

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  console.log('Signup received:', email);
  // Here you can add real signup logic later
  res.json({ message: 'Signup successful' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login received:', email);
  // Here you can add real login validation later
  const fakeToken = 'FAKE_TOKEN_123456';
  res.json({ message: 'Login successful', token: fakeToken });
});

// Root route
app.get('/', (req, res) => {
  res.send('Paywall Backend Server Running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
