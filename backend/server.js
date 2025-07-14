// backend/server.js (Full example)
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // Install this: npm install cors

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error(err));

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS - IMPORTANT for frontend/backend communication if on different ports/domains

// Serve static files from the 'public' directory
// IMPORTANT: This should be after your API routes if you have overlapping paths,
// or use a separate subdomain for your API.
app.use(express.static(path.join(__dirname, '../public')));

// Define API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customer', require('./routes/customer'));
app.use('/api/admin', require('./routes/admin')); // Admin routes

// Handle requests for non-existent routes (send index.html for SPA if you go that route)
// For a multi-page static site with a separate backend, this might not be strictly needed,
// or you can configure a 404 handler. For now, it serves index.html if no API route matches.
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

// 10. Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access your public site at http://localhost:${PORT}`);
    console.log(`Access admin login at http://localhost:${PORT}/admin-login.html`);
});