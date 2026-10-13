
const express = require("express");
const router = express.Router();
const { JobOpening } = require("../models");

// Add a job opening
router.post("/", async (req, res) => {
  try {
    const job = await JobOpening.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all job openings
router.get("/", async (req, res) => {
  try {
    const jobs = await JobOpening.findAll({
      include: ["Company"]
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
