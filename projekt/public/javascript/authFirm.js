const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../backend/database/cloudinary.js');

const router = express.Router();

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "test_uploads", // vises som mappe i Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });


document.addEventListener("DOMContentLoaded", () =>{
    // Henter form data
    const formRegisterFirm = document.getElementById("firmRegisterForm");

    // Event når bruger trykker submit
    formRegisterFirm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const firmName = document.getElementById("companyName").value;
        const firmMail = document.getElementById("email").value;
        const firmPassword = document.getElementById("password").value;
        const firmLogo = document.getElementById("companyLogo").value;

        /* Vi skal først have opsat vores Cloudinary API, så vi kan få et 
        URL der kan gemmes i databasen. Indtil videre ændre jeg det til at
        databasen viser null, indtil vi har opsat Cloudinary.*/

        // Cloudinary API her til fetch request ...

        const respons = await fetch("/firmSignUp", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({firmName, firmMail, firmPassword})
        });

        //Tjekker om vi har successfuld respons og informer brugeren.
        if (respons.ok) {
            alert("Konto er oprettet successfuldt");
        } else {
            alert("Noget gik galt. Prøv igen senere");
        };

    });
});