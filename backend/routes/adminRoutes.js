const express = require("express");
const router = express.Router();
const { verifyAdmin, getAdminSecret } = require("../middleware/auth");

// @route   POST /api/admin/login
// @desc    Authenticate admin and return session token
router.post("/login", (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            success: false,
            error: "Please enter the admin passcode."
        });
    }

    const currentSecret = getAdminSecret();

    if (password.trim() === currentSecret) {
        return res.json({
            success: true,
            token: currentSecret,
            message: "Authentication successful. Access granted."
        });
    } else {
        return res.status(401).json({
            success: false,
            error: "Incorrect admin passcode. Access denied."
        });
    }
});

// @route   GET /api/admin/verify
// @desc    Verify if stored token is currently valid
router.get("/verify", verifyAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Token is valid."
    });
});

module.exports = router;
