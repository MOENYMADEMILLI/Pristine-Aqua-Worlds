// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth'); // Our admin authentication middleware
const CustomerData = require('../models/CustomerData');
const User = require('../models/User'); // For user management

// @route   GET api/admin/dashboard-stats
// @desc    Get basic dashboard stats for admin
// @access  Private (Admin only)
router.get('/dashboard-stats', adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCustomersWithData = await CustomerData.countDocuments();
        // More stats can be added, e.g., upcoming services, recent payments
        res.json({ totalUsers, totalCustomersWithData });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users
// @desc    Get all users (for management)
// @access  Private (Admin only)
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/customerdata
// @desc    Get all customer data (for management)
// @access  Private (Admin only)
router.get('/customerdata', adminAuth, async (req, res) => {
    try {
        // Populate user field to see which user owns the data
        const customerData = await CustomerData.find().populate('user', ['username', 'email']);
        res.json(customerData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/customerdata
// @desc    Create new customer data (e.g., for new client)
// @access  Private (Admin only)
router.post('/customerdata', adminAuth, async (req, res) => {
    // This route would be used by admin to create new customer profiles directly
    // Requires linking to an existing user ID (req.body.userId)
    const { userId, tankName, tankSize, tankType, ...rest } = req.body;
    try {
        const newCustomerData = new CustomerData({
            user: userId,
            tankName,
            tankSize,
            tankType,
            ...rest
        });
        await newCustomerData.save();
        res.json(newCustomerData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/admin/customerdata/:id
// @desc    Update specific customer data
// @access  Private (Admin only)
router.put('/customerdata/:id', adminAuth, async (req, res) => {
    try {
        const updatedData = await CustomerData.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // $set to update only provided fields
            { new: true } // Return the updated document
        );
        if (!updatedData) {
            return res.status(404).json({ msg: 'Customer data not found' });
        }
        res.json(updatedData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/customerdata/:id
// @desc    Delete customer data
// @access  Private (Admin only)
router.delete('/customerdata/:id', adminAuth, async (req, res) => {
    try {
        const deletedData = await CustomerData.findByIdAndDelete(req.params.id);
        if (!deletedData) {
            return res.status(404).json({ msg: 'Customer data not found' });
        }
        res.json({ msg: 'Customer data removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add more routes for managing services, adding specific water parameters/service logs, etc.
// Example: Adding a service log for a specific tank
router.put('/customerdata/:id/add-service-log', adminAuth, async (req, res) => {
    const { date, serviceType, description, technicianNotes, cost } = req.body;
    try {
        const customerData = await CustomerData.findById(req.params.id);
        if (!customerData) {
            return res.status(404).json({ msg: 'Customer data not found' });
        }
        customerData.serviceHistory.unshift({ date, serviceType, description, technicianNotes, cost }); // Add to array
        await customerData.save();
        res.json(customerData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;