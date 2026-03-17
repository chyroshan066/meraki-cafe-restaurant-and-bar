const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require("./routes/userRoutes");
const { handleSubscription, getSubscribers } = require('./controllers/newsletterController');

const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://meraki-cafe-restaurant-and-bar.vercel.app",
  "https://www.merakirestro.com",
  "https://meraki-cafe-restaurant-and-bar-dun.vercel.app"
];

// CORS configuration
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE', 'PATCH' ,'OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
};

// Apply CORS before all routes/middleware
app.use(cors(corsOptions));
// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.post('/api/subscribe', handleSubscription);
app.get('/api/subscribers', getSubscribers); 

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;