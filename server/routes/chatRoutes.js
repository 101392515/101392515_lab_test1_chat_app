// server/routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const GroupMessage = require('../models/groupMessage');

// Get messages for a specific room
router.get('/:room', authMiddleware, async (req, res) => {
    try {
        const room = req.params.room;

        const messages = await GroupMessage.find({ room }).sort({ date_sent: 'asc' });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
