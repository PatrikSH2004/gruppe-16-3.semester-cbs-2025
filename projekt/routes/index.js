var express = require('express');
var router = express.Router();
var path = require('path');
const createDatabaseConnection = require('../backend/database/database.js');
const passwordConfig = require('../backend/database/config.js');

let database;

// Initialize database connection
(async () => {
    database = await createDatabaseConnection(passwordConfig);
})();

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Add API endpoints for database operations
router.post('/api/start', async (req, res) => {
    try {
        await database.connect();
        res.json({ message: "Database connected" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/api/stop', async (req, res) => {
    try {
        await database.disconnect();
        res.json({ message: "Database disconnected" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;