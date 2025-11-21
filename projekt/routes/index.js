var express = require('express');
var router = express.Router();
var path = require('path');

// Indsætter multer til filhåndtering på backend controlleren i stedet for frontend siden.
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../backend/database/cloudinary.js');
const app = require('../app.js');

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

const rateLimit = require('express-rate-limit'); //rate limiter import til login 

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutter
    max: 5, // Max 5 loginforsøg
    message: "For mange loginforsøg – prøv igen senere."
});

// Post request til at sende customer data.
router.post('/customerSignUp', loginLimiter, async function(req, res) {
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
        console.log("Login payload:", req.body.userMail, req.body.userPassword);

        const matches = await req.app.locals.database.findUserMatch(
            req.body.userMail,
            req.body.userPassword
        );

        // matches kommer som et array af rækker fra database.js
        if (!matches || matches.length === 0) {
            return res.status(401).json({ error: "Ugyldig email eller adgangskode" });
        }

        const dbUser = matches[0]; // brug første række

        // Map felter fra DB 
        const user = {
            id: dbUser.brugerID ?? dbUser.id,
            name: dbUser.brugerNavn ?? dbUser.name,
            email: dbUser.brugerMail ?? dbUser.email
        };

        // Gem i session 
        req.session.user = user;
        req.session.save(err => {
            if (err) {
                console.error('Session save failed', err);
                return res.status(500).json({ error: 'Session error' });
            }
            console.log('Session saved for user:', req.session.user);
            return res.status(200).json({ message: "Login OK" });
        });

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});


router.post("/firmLogin", async function(req, res) {
    try {
        const matches = await req.app.locals.database.findFirmMatch(req.body.firmMail, req.body.firmPassword);
        if (!matches || matches.length === 0) {
            return res.status(401).json({ error: "Ugyldig email eller adgangskode" });
        };

        const firmId = matches[0].virkID;
        if (!firmId) {
            console.error("Kunne ikke finde firm-id:", matches[0]);
            return res.status(500).json({ error: "Server fejl" });
        };

        // Regenerer session (for at forhindre session fixation), sæt firmId og gem
        req.session.regenerate((err) => {
            if (err) {
                console.error("Session regenerate error:", err);
                return res.status(500).json({ error: "Session error" });
            };

            req.session.firmId = firmId;
            req.session.userType = "firm";

            req.session.save((err2) => {
                if (err2) {
                    console.error("Session save error:", err2);
                    return res.status(500).json({ error: "Session save error" });
                }
                // Send svar når session er persisted
                return res.status(200).json({ message: "Logged in", firmId });
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});

router.post("/createReward", async function(req, res) {
    try {
        // Opretter en ny reward i databasen.
        await req.app.locals.database.opretReward(req.session.firmId, req.body.name, req.body.description, req.body.condition, req.body.quotas, 0);
        
        // Finder den nye rewards ID, og en liste med alle kunders ID'er.
        const newRewardID = await req.app.locals.database.getLatestRewardIdByFirmId(req.session.firmId);
        const listCustomerID = await req.app.locals.database.getAllCustomerIds();

        // Tilknytter den nye reward til alle kunder i databasen.
        for(let i = 0 ; i < listCustomerID.length; i++) {
            await req.app.locals.database.lockUserReward(listCustomerID[i], newRewardID);
        };
        
        res.sendStatus(200);

    } catch (error) {
        res.sendStatus(500);
    };
});


module.exports = router; // eksporterer routeren, så den kan bruges i app.js