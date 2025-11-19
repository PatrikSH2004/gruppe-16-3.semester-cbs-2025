var express = require('express');
var router = express.Router();
var path = require('path');

// Indsætter multer til filhåndtering på backend controlleren i stedet for frontend siden.
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../backend/database/cloudinary.js');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "firm_logos",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});
const upload = multer({ storage });


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

router.post('/firmSignUp', upload.single('companyLogo'), async function(req, res) {
    try {
        // Opsætter data fra vores form
        const firmName = req.body.firmName;
        const firmMail = req.body.firmMail;
        const firmPassword = req.body.firmPassword;
        const logoUrl = req.file ? (req.file.path || req.file.url || req.file.secure_url) : null;

        // Sender data til databasen, inklusiv logo URL.
        await req.app.locals.database.createFirm(firmName, firmMail, firmPassword, logoUrl);

        // Returner succes respons-
        res.status(201).json({ message: "Created"});
    } catch (error) {
        console.error("Error in /firmSignUp:", error);
        res.status(500).json({ error: "Server error" });
    }
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

router.post("/firmLogin", async function(req, res) {
    try {
        const matches = await req.app.locals.database.findFirmMatch(req.body.firmMail, req.body.firmPassword);
        /*
        Stadigvæk noget kode-værk der skal til her, for at få tjekket login oplysninger.
        
        */
        console.log(matches);

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    };
});

router.post("/createReward", async function(req, res) {
    // Der skal modtages to-do data her fra frontend logik fra create-reward.js

    // Bagefter skal payload pakkes ud og sendes til databasen via en ny DB metode.
});


module.exports = router; // eksporterer routeren, så den kan bruges i app.js