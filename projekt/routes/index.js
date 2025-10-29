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
    res.sendFile(path.join(__dirname, '../public/pages/index.html'));
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

router.get('/customerLogin', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/customer/login.html'));
});

router.get('/firmLogin', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/company/login.html'));
});

router.get('/customerSignUp', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/customer/register.html'));
});

router.get('/firmSignUp', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/company/register.html'));
});

// tænker vi kan bruge den her til at logge ud. 
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Fejl ved logout:', err);
            res.status(500).json({ error: 'Der opstod en fejl ved logout' });
        } else {
            res.status(200).json({ message: 'Logget ud succesfuldt' });
        }
    });
});

module.exports = router; // eksporterer routeren, så den kan bruges i app.js



module.exports = router;