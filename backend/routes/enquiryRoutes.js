const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");
const mongoose = require("mongoose");

// In-memory fallback in case MongoDB credentials are not yet configured
let memoryEnquiries = [];

// Helper to check if DB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   POST /api/enquiries
// @desc    Submit a new enquiry
router.post("/", async (req, res) => {
    try {
        const { name, phone, email, classLevel, board, message } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                error: "Please provide both name and phone number."
            });
        }

        const enquiryData = {
            name: name.trim(),
            phone: phone.trim(),
            email: email ? email.trim() : "",
            classLevel: classLevel || "Class 10",
            board: board || "CBSE",
            message: message ? message.trim() : "",
            status: "New",
            createdAt: new Date()
        };

        if (isDbConnected()) {
            const savedEnquiry = await Enquiry.create(enquiryData);
            return res.status(201).json({
                success: true,
                message: "Enquiry submitted successfully! We will contact you soon.",
                data: savedEnquiry
            });
        } else {
            // DB fallback mode
            const mockEnquiry = {
                _id: "mem_" + Date.now(),
                ...enquiryData
            };
            memoryEnquiries.unshift(mockEnquiry);
            return res.status(201).json({
                success: true,
                message: "Enquiry received successfully! (Saved in session buffer - MongoDB connecting)",
                data: mockEnquiry,
                dbStatus: "MongoDB not connected yet"
            });
        }
    } catch (error) {
        console.error("Error creating enquiry:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to submit enquiry."
        });
    }
});

// @route   GET /api/enquiries
// @desc    Get all enquiries (for Admin)
router.get("/", async (req, res) => {
    try {
        const { status } = req.query;

        if (isDbConnected()) {
            const query = status ? { status } : {};
            const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });
            return res.json({
                success: true,
                count: enquiries.length,
                data: enquiries
            });
        } else {
            let filtered = memoryEnquiries;
            if (status) {
                filtered = filtered.filter(item => item.status === status);
            }
            return res.json({
                success: true,
                count: filtered.length,
                data: filtered,
                note: "Displaying cached enquiries (MongoDB is offline or connecting)"
            });
        }
    } catch (error) {
        console.error("Error fetching enquiries:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch enquiries."
        });
    }
});

// @route   PATCH /api/enquiries/:id
// @desc    Update enquiry status or notes
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (isDbConnected()) {
            const updated = await Enquiry.findByIdAndUpdate(
                id,
                { ...(status && { status }), ...(notes !== undefined && { notes }) },
                { new: true }
            );

            if (!updated) {
                return res.status(404).json({ success: false, error: "Enquiry not found" });
            }

            return res.json({ success: true, data: updated });
        } else {
            const index = memoryEnquiries.findIndex(item => item._id === id);
            if (index === -1) {
                return res.status(404).json({ success: false, error: "Enquiry not found in memory" });
            }
            if (status) memoryEnquiries[index].status = status;
            if (notes !== undefined) memoryEnquiries[index].notes = notes;

            return res.json({ success: true, data: memoryEnquiries[index] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// @route   DELETE /api/enquiries/:id
// @desc    Delete an enquiry
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (isDbConnected()) {
            const deleted = await Enquiry.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ success: false, error: "Enquiry not found" });
            }
            return res.json({ success: true, message: "Enquiry deleted" });
        } else {
            memoryEnquiries = memoryEnquiries.filter(item => item._id !== id);
            return res.json({ success: true, message: "Enquiry deleted from memory" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
