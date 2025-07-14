// backend/models/CustomerData.js
const mongoose = require('mongoose');

const CustomerDataSchema = new mongoose.Schema({
    user: { // Links to the User who owns this data
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tankName: {
        type: String,
        required: true
    },
    tankSize: {
        type: Number, // in gallons
        required: true
    },
    tankType: { // e.g., 'Freshwater', 'Saltwater', 'Pond'
        type: String,
        required: true
    },
    lastServiceDate: {
        type: Date
    },
    nextServiceDate: {
        type: Date
    },
    notes: { // Any specific notes about the tank
        type: String
    },
    waterParameters: [{ // Array of water parameter readings
        date: { type: Date, default: Date.now },
        ph: Number,
        ammonia: Number,
        nitrite: Number,
        nitrate: Number,
        // Add more as needed (salinity, alkalinity, calcium etc.)
    }],
    serviceHistory: [{ // Array of service records
        date: { type: Date, default: Date.now },
        serviceType: String, // e.g., 'Weekly Maintenance', 'Setup'
        description: String,
        technicianNotes: String,
        cost: Number
    }],
    // Add other fields relevant to what you want customers to track
});

module.exports = mongoose.model('CustomerData', CustomerDataSchema);