var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/index.html'));
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

// Post request til at sende customer data.
router.post('/customerSignUp', async function(req, res) {
    try {
        // Vi tjekker om dataen allerede eksisterer (logik funktion).

        // Hvis det ikke eksister, sender vi den nye til databasen.
        await req.app.locals.database.createCustomer(req.body.userName, req.body.userMail, req.body.userPassword);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    };

    
});

router.post('/firmSignUp', async function(req, res) {
    try {
        // Vi tjekker om dataen allerede eksisterer (logik funktion).
        
        // Hvis det ikke eksister, sender vi den nye til databasen.
        await req.app.locals.database.createFirm(req.body.firmName, req.body.firmMail, req.body.firmPassword);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    };

    
});

router.post("/customerLogin", async function(req, res) {
    try {
        console.log(req.body.userMail, req.body.userPassword);

        const matches = await req.app.locals.database.findUserMatch(req.body.userMail, req.body.userPassword);
        /*
        Stadigvæk noget kode-værk der skal til her, for at få tjekket login oplysninger.
        
        */
        console.log(matches);

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    };
});

module.exports = router; // eksporterer routeren, så den kan bruges i app.js