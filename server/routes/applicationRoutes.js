
const express = require("express");
const router = express.Router();
const { Application, Student, JobOpening, Company } = require("../models");

// Create a job application
router.post("/", async (req, res) => {
  try {
    const { studentId, jobOpeningId } = req.body;

    if (!studentId || !jobOpeningId) {
      return res.status(400).json({
        message: "studentId and jobOpeningId are required"
      });
    }

    const application = await Application.create({
      studentId,
      jobOpeningId,
      status: "Applied"
    });

    res.status(201).json({
      message: "Application created successfully",
      application
    });
  } catch (error) {
    console.error("Application POST error:", error);

    res.status(400).json({
      message: "Failed to create application",
      error: error.message
    });
  }
});

// Get all applications with student and job details
router.get("/", async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [
        { model: Student },
        { model: JobOpening, include: [{ model: Company }] }
      ]
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Application GET error:", error);

    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message
    });
  }
});

// Update application status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Selected",
      "Rejected"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        allowedStatuses
      });
    }

    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    await application.update({ status });

    res.status(200).json({
      message: "Application status updated",
      application
    });
  } catch (error) {
    console.error("Application status error:", error);

    res.status(500).json({
      message: "Failed to update application",
      error: error.message
    });
  }
});

module.exports = router;
