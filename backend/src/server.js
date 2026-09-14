require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const priceEngine = require('./services/priceEngine');
const authRoutes = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const walletRoutes = require('./routes/walletRoutes');
const kycRoutes = require('./routes/kycRoutes');
const adminRoutes = require('./routes/adminRoutes');
const marketRoutes = require('./routes/marketRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Initialize Realtime Price Simulation & Trading Engine
priceEngine.init(io);

// Socket.io connection handling
io.on('connection', (socket) => {
  // Client can join their private room for user-specific trade alerts
  socket.on('join_user', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
    }
  });

  // Client requests initial market snapshot
  socket.on('get_initial_prices', () => {
    socket.emit('price_snapshot', priceEngine.getAllPrices());
  });

  socket.on('disconnect', () => {});
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/market', marketRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Aventra FX Institutional Trading Engine',
    time: new Date().toISOString()
  });
});

// Serve frontend static assets in production
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
const fs = require('fs');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Aventra FX Trading Backend running on port ${PORT}`);
  console.log(`📊 Socket.io server active for real-time market data`);
  console.log(`👑 Admin credentials: admin@royalfx.com / admin123`);
  console.log(`👤 Demo Trader: trader@royalfx.com / trader123`);
  console.log(`====================================================`);
});
