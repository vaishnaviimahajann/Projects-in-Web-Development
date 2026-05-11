const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// ← Yahi fix hai — '*' ki jagah '/{*path}' use kiya
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend.html'));
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ⚡ ElectroNest Server Started!');
  console.log(`  🌐 Frontend  → http://localhost:${PORT}`);
  console.log(`  🔌 API Base  → http://localhost:${PORT}/api`);
  console.log('');
});