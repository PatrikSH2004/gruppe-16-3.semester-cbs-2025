/* Routes for customer-related operations */
var express = require('express');
var router = express.Router();
var path = require('path');

/* GET users listing. */
router.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/pages/company/dashboard.html'));
});

module.exports = router;
