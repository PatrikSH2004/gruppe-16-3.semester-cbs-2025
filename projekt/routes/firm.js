/* Routes for customer-related operations */
var express = require('express');
var router = express.Router();
var path = require('path');
const app = require('../app.js');

/* GET users listing. */
router.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/pages/company/dashboard.html'));
});

router.get('/data', async function (req, res) {
  // Finder alle rewards for en virksomhed, ud fra deres virksomheds ID
  allRewards = await req.app.locals.database.getAllRewardsByFirmId(req.session.firmId);
  res.status(200).json({rewards : allRewards});
});

router.get('/create-reward', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/pages/company/create-reward.html'));
});

router.delete('/delete-reward', async function (req, res) {
  // Bruger reward ID for at finde og slette den rigtige reward

  // Vi bliver først nødt til at slette alle tilknyttede kunders rewards.

  // SKRIV NY METODE HER...

  // Vi fjerner rewards til sidst fra databasen.
  await req.app.locals.database.deleteRewardById(req.body.rewardsID);
  res.sendStatus(200);
});

module.exports = router;
