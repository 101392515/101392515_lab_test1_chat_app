// server/controllers/chatController.js

const GroupMessage = require('../models/groupMessage');

exports.getRoomMessages = async (req, res) => {
    try {
        const room = req.params.room;

        const messages = await GroupMessage.find({ room }).sort({ date_sent: 'asc' });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
