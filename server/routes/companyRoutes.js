
const express = require("express");
const router = express.Router();
const { Company } = require("../models");

// POST: Create a company
router.post("/", async (req, res) => {
  console.log("POST COMPANY ROUTE REACHED");
  console.log("POST COMPANY BODY:", req.body);

  try {
    const { name, location, website } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Company name is required"
      });
    }

    const company = await Company.create({
      name: name.trim(),
      location,
      website
    });

    console.log("COMPANY CREATED:", company.id);

    return res.status(201).json({
      message: "Company created successfully",
      company
    });
  } catch (error) {
    console.error("COMPANY POST ERROR:", error);

    return res.status(500).json({
      message: "Failed to create company",
      error: error.message
    });
  }
});

// GET: Fetch all companies
router.get("/", async (req, res) => {
  console.log("GET COMPANIES ROUTE REACHED");

  try {
    const companies = await Company.findAll();

    return res.status(200).json(companies);
  } catch (error) {
    console.error("COMPANY GET ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch companies",
      error: error.message
    });
  }
});

// GET: Fetch one company by ID
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    return res.status(200).json(company);
  } catch (error) {
    console.error("COMPANY GET BY ID ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch company",
      error: error.message
    });
  }
});

// PUT: Update a company
router.put("/:id", async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    await company.update(req.body);

    return res.status(200).json({
      message: "Company updated successfully",
      company
    });
  } catch (error) {
    console.error("COMPANY UPDATE ERROR:", error);

    return res.status(400).json({
      message: "Failed to update company",
      error: error.message
    });
  }
});

// DELETE: Delete a company
router.delete("/:id", async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    await company.destroy();

    return res.status(200).json({
      message: "Company deleted successfully"
    });
  } catch (error) {
    console.error("COMPANY DELETE ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete company",
      error: error.message
    });
  }
});

module.exports = router;
