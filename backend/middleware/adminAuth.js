// backend/middleware/adminAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model

module.exports = async function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // User ID from JWT

        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: 'Access denied: Admin privileges required' });
        }

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid or expired' });
    }
};