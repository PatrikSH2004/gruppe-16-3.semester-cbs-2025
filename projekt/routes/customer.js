/* Routes for customer-related operations */
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/bookTrip', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/customer/bookTrip.html'));
});

router.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/customer/dashboard.html'));
});

module.exports = router;
