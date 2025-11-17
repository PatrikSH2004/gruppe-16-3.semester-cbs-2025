const express = require('express');
const multer = require('multer');
var path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../backend/database/cloudinary.js');

const router = express.Router();

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/pages/testUpload.html'));
});

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "test_uploads", // vises som mappe i Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// Simpel test-route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Ingen fil modtaget" });
    }

    console.log("Cloudinary upload info:", req.file);

    res.json({
      message: "Upload successful ✅",
      url: req.file.path,
    });
  } catch (error) {
    console.error("Fejl under upload:", error);
    res.status(500).json({ error: "Noget gik galt under upload" });
  }
});



module.exports = router;