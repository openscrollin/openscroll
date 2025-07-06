const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const articleRoutes = require('./routes/articles');
const paymentRoutes = require('./routes/payment');
const writerEarningsRoute = require('./routes/writerEarnings');
const readerPurchasesRoute = require('./routes/readerPurchases');
const adminRoutes = require('./routes/admin');
const adminAuthRoutes = require('./routes/adminAuth');
const aiEnhanceRoute = require('./routes/aiEnhance');
const heroImageRoutes = require('./routes/heroImage');
const carouselRoutes = require('./routes/carouselRoutes');
const addArticleRoute = require('./api/addArticle'); // ✅ Added

const app = express();
const PORT = process.env.PORT || 5002;

// ✅ Connect to DB
connectDB();

// ✅ CORS setup
const allowedOrigins = [
  'http://localhost:3000',
  'https://openscroll.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/writer', writerEarningsRoute);
app.use('/api/reader', readerPurchasesRoute);
app.use('/api', aiEnhanceRoute);
app.use('/api/admin/hero-image', heroImageRoutes);
app.use('/api/admin/carousel-images', carouselRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/addArticle', addArticleRoute); // ✅ Mounted addArticle

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});

// ✅ Global error handler
app.use(errorHandler);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
