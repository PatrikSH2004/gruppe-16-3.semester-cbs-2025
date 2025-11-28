/* Routes for customer-related operations */
var express = require('express');
var router = express.Router();
var path = require('path');
const app = require('../app.js');
const { encrypt, decrypt } = require('../backend/database/encryption');



// IMPORTER MAIL-SERVICE
const mail = require('./mail');

const { bookingConfirmationTemplate, rewardReminderTemplate,rewardTemplate, mailToUser, router: mailRouter } = mail;

router.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/customer/dashboard.html'));
});

router.get('/data', async function (req, res) {
    // Metode til at hente info for  r.rewardID, v.virkID,  v.virkBillURL, v.virkNavn, r.betingelse, r.beskrivelse
    const info = await req.app.locals.database.getCustomerDashboardInfo(); // Betingelse er vigtig

    // Vi skal også hente counterne for alle brugereRewards med bestem brugerID
    const counters = await req.app.locals.database.countersById(req.session.user.id);

    res.status(200).json({info : info, counters : counters});
});

router.get('/bookTrip', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/customer/bookTrip.html'));
});


router.put('/bookTrip', async (req, res) => {
    try {
        const { date, time, virkNavn, rewardId, reward } = req.body;

        // Starter med at få counteren til at stige med en.
        await req.app.locals.database.counter(req.session.user.id, rewardId);

        // Start først med at hente "betingelse" fra dis.reward og "counter" fra dis.brugerRewards.
        const result = await req.app.locals.database.counterAndCondition(req.session.user.id, rewardId);
        
        const forskel = result[0].betingelse - result[0].counter;

        // Hvis virkNavn ikke sendes, hent det fra databasen
        let virksomhedNavn = virkNavn;
        if (!virksomhedNavn) {
            virksomhedNavn = await req.app.locals.database.getVirkNavnByRewardId(rewardId);
        }

        console.log("USER INFOOOOO HERERER ER WQEWEEEWEWE:",req.session.user);
        const encryptedEmail = decrypt(req.session.user.email);
        console.log("DECRYPTED EMAIL I BOOKTRIP:", encryptedEmail);

        if (forskel < 0) {
            const user = req.session.user;
            const rewardMail = rewardTemplate(user.name, date, time, reward);
            await mailToUser(encryptedEmail, "Reward påmindelse", rewardMail);

            await req.app.locals.database.deleteUserReward(req.session.user.id, rewardId);
            res.status(200).json({ message: "Booking gemt og mail sendt!" });
        } else {
            const user = req.session.user;
            if (!user) {
                return res.status(401).json({ error: "Ikke logget ind" });
            }

            const msg = bookingConfirmationTemplate(user.name, date, time);
            await mailToUser(encryptedEmail, "Booking bekræftelse", msg);

            const reminder = rewardReminderTemplate(user.name, virksomhedNavn, forskel);
            await mailToUser(encryptedEmail, "Reward påmindelse", reminder);

            res.status(200).json({ message: "Booking gemt og mail sendt!" });
        };

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Fejl i booking" });
    }
});



module.exports = router;
