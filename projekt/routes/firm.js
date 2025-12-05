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
  try {
    const db = req.app.locals.database;
    const firmId = req.session.firmId;

    // 1. Hent alle rewards for firmaet
    let allRewards = await db.getAllRewardsByFirmId(firmId);

    // 2. For hver reward → tilføj eligibleCount
    for (let reward of allRewards) {
      reward.eligibleCount = await db.countEligibleUsersForReward(reward.rewardID);
    }

    // 3. Send tilbage til frontend
    res.status(200).json({ rewards: allRewards });

  } catch (error) {
    console.error("Fejl i /data route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/create-reward', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/pages/company/create-reward.html'));
});

router.delete('/delete-reward', async function (req, res) {
  // Vi tjekker først, om personen der vil slette en reward har tilladelse til det.
  if (req.session.firmId){
    // Vi bliver først nødt til at slette alle tilknyttede kunders rewards.
    await req.app.locals.database.deleteUserRewards(targetID);

    // Vi fjerner rewards til sidst fra databasen.
    await req.app.locals.database.deleteRewardById(req.body.rewardsID);
  
    res.sendStatus(200);
  } else {
    res.sendStatus(403); // Forbidden
  };
 
});

module.exports = router;
