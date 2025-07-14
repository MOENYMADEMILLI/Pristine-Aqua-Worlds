// backend/routes/customer.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our custom auth middleware
const CustomerData = require('../models/CustomerData');

// @route   GET api/customer/me
// @desc    Get logged in user's customer data
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const customerData = await CustomerData.findOne({ user: req.user.id });
        if (!customerData) {
            // If no customer data exists, return a message or allow creation
            return res.status(200).json({ msg: 'No customer data found for this user. Please create one.' });
        }
        res.json(customerData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/customer
// @desc    Create or update customer data
// @access  Private
router.post('/', auth, async (req, res) => {
    const { tankName, tankSize, tankType, lastServiceDate, nextServiceDate, notes, waterParameters, serviceHistory } = req.body;

    // Build customer data object
    const customerDataFields = {};
    customerDataFields.user = req.user.id; // Link to the authenticated user
    if (tankName) customerDataFields.tankName = tankName;
    if (tankSize) customerDataFields.tankSize = tankSize;
    if (tankType) customerDataFields.tankType = tankType;
    if (lastServiceDate) customerDataFields.lastServiceDate = lastServiceDate;
    if (nextServiceDate) customerDataFields.nextServiceDate = nextServiceDate;
    if (notes) customerDataFields.notes = notes;
    if (waterParameters) customerDataFields.waterParameters = waterParameters; // This would typically be appended, not overwritten
    if (serviceHistory) customerDataFields.serviceHistory = serviceHistory; // This would typically be appended, not overwritten

    try {
        let customerData = await CustomerData.findOne({ user: req.user.id });

        if (customerData) {
            // Update
            customerData = await CustomerData.findOneAndUpdate(
                { user: req.user.id },
                { $set: customerDataFields },
                { new: true }
            );
            return res.json(customerData);
        }

        // Create
        customerData = new CustomerData(customerDataFields);
        await customerData.save();
        res.json(customerData);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add routes for specific updates (e.g., add new service history, update water parameters)
// @route   PUT api/customer/service-history
// @desc    Add a new service history entry
// @access  Private
router.put('/service-history', auth, async (req, res) => {
    const { date, serviceType, description, technicianNotes, cost } = req.body;
    const newService = { date, serviceType, description, technicianNotes, cost };

    try {
        const customerData = await CustomerData.findOne({ user: req.user.id });
        if (!customerData) {
            return res.status(404).json({ msg: 'Customer data not found' });
        }

        customerData.serviceHistory.unshift(newService); // Add to the beginning of the array
        await customerData.save();
        res.json(customerData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add more routes for specific actions (e.g., adding water parameters, deleting tanks)
// Remember to handle validation and error checking thoroughly for all routes

module.exports = router;