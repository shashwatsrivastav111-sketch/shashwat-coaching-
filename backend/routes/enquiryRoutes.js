const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");
const mongoose = require("mongoose");
const { verifyAdmin } = require("../middleware/auth");

// In-memory fallback in case MongoDB credentials are not yet configured
let memoryEnquiries = [];

// Helper to check if DB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// Basic sanitization helper to prevent XSS
const sanitize = (str) => {
    if (typeof str !== "string") return "";
    return str
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim();
};

// @route   POST /api/enquiries
// @desc    Submit a new enquiry (Public, with validation & sanitization)
router.post("/", async (req, res) => {
    try {
        const { name, phone, email, classLevel, board, message } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                error: "Please provide both student/parent name and mobile number."
            });
        }

        const cleanPhone = phone.toString().replace(/\D/g, "");
        if (cleanPhone.length < 10) {
            return res.status(400).json({
                success: false,
                error: "Please enter a valid 10-digit mobile number."
            });
        }

        const sanitizedName = sanitize(name);
        const sanitizedEmail = email ? sanitize(email) : "";
        const sanitizedMessage = message ? sanitize(message) : "";
        const sanitizedClass = classLevel ? sanitize(classLevel) : "Class 10";
        const sanitizedBoard = board ? sanitize(board) : "CBSE";

        const enquiryData = {
            name: sanitizedName,
            phone: cleanPhone,
            email: sanitizedEmail,
            classLevel: sanitizedClass,
            board: sanitizedBoard,
            message: sanitizedMessage,
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
                message: "Enquiry received successfully! (Saved in session buffer)",
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
// @desc    Get all enquiries (Protected: Admin Only)
router.get("/", verifyAdmin, async (req, res) => {
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
// @desc    Update enquiry status or notes (Protected: Admin Only)
router.patch("/:id", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const updateFields = {};
        if (status) updateFields.status = sanitize(status);
        if (notes !== undefined) updateFields.notes = sanitize(notes);

        if (isDbConnected()) {
            const updated = await Enquiry.findByIdAndUpdate(
                id,
                updateFields,
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
            if (status) memoryEnquiries[index].status = updateFields.status;
            if (notes !== undefined) memoryEnquiries[index].notes = updateFields.notes;

            return res.json({ success: true, data: memoryEnquiries[index] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// @route   DELETE /api/enquiries/:id
// @desc    Delete an enquiry (Protected: Admin Only)
router.delete("/:id", verifyAdmin, async (req, res) => {
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
