/* Routes for customer-related operations */
var express = require('express');
var router = express.Router();

router.get('/bookTrip', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/customer/bookTrip.html'));
});

module.exports = router;
