const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const articleRoutes = require('./routes/articles');       // ✅ Article routes
const paymentRoutes = require('./routes/payment');
const writerEarningsRoute = require('./routes/writerEarnings');
const readerPurchasesRoute = require('./routes/readerPurchases');
const adminRoutes = require('./routes/admin');            // ✅ Protected admin features
const adminAuthRoutes = require('./routes/adminAuth');    // ✅ Admin login route

const app = express();
const PORT = process.env.PORT || 5002;

// ✅ Connect to DB
connectDB();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ API Routes (after middleware)
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/articles', articleRoutes); // ✅ Article route properly placed here
app.use('/api/payment', paymentRoutes);
app.use('/api/writer', writerEarningsRoute);
app.use('/api/reader', readerPurchasesRoute);
app.use('/api/admin', adminRoutes);       // ✅ Admin protected routes (e.g. /feature-article)
app.use('/api/admin', adminAuthRoutes);   // ✅ Admin login route (/login)

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});

// ✅ Global Error Handler
app.use(errorHandler);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
