/* Routes for customer-related operations */
var express = require('express');
var router = express.Router();
var path = require('path');
const app = require('../app.js');


// IMPORTER MAIL-SERVICE
const mail = require('./mail');

const { bookingConfirmationTemplate, rewardReminderTemplate, mailToUser, router: mailRouter } = mail;

router.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/customer/dashboard.html'));
});

router.get('/data', async function (req, res) {
    const info = await req.app.locals.database.getCustomerDashboardInfo();
    res.status(200).json({info : info});
});

router.get('/bookTrip', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/customer/bookTrip.html'));
});


router.put('/bookTrip', async (req, res) => {
    try {
        const { date, time } = req.body;

        // Starter med at få counteren til at stige med en.
        await req.app.locals.database.counter(req.session.user.id, req.body.rewardId);

        // Efterfølgende skal vi have noget mailværk her.

        // Start først med at hente "betingelse" fra dis.reward og "counter" fra dis.brugerRewards.

        // Fratræk værdierne for at afgøre, hvor mange bookninger de mangler for deres reward.

        // Brug forskellen på tallet til at sende en mail til brugeren om deres opdaterede status.

        console.log("Received booking:", date, time);
        // Hent brugerdata fra session
        const user = req.session.user;
        console.log("hitting booking route", user);

        if (!user) {
            return res.status(401).json({ error: "Ikke logget ind" });
        }

        // SEND BOOKING-BEKRÆFTELSE
        const msg = bookingConfirmationTemplate(user.name, date, time);
        await mailToUser(user.email, "Booking bekræftelse", msg);

        const reminder = rewardReminderTemplate(user.name, "Virksomhedsnavn");
        await mailToUser(user.email, "Booking bekræftelse", reminder);

        res.status(200).json({ message: "Booking gemt og mail sendt!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Fejl i booking" });
    }
});



module.exports = router;
