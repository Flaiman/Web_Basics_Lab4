const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Image = require("../models/Image");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { author, filename } = req.body;
    const imagePath = "/uploads/" + req.file.filename;
    const newImage = new Image({ author, filename, imagePath });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadDate: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", upload.single("image"), async (req, res) => { 
  try {
    const { author, filename } = req.body;
    const updateData = { author, filename };

    if (req.file) {
      updateData.imagePath = "/uploads/" + req.file.filename; 
    }

    const updated = await Image.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Updated successfully", image: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;