/* Routes for customer-related operations */
var express = require('express');
var router = express.Router();
var path = require('path');


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


router.post('/bookTrip', async (req, res) => {
    try {
        const { date, time } = req.body;

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
