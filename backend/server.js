const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const enquiryRoutes = require("./routes/enquiryRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Security Headers Middleware
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
});

// 2. Simple In-Memory Rate Limiter for Enquiry Submissions (Anti-Spam)
const submissionTracker = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ENQUIRIES_PER_WINDOW = 15;

const enquiryRateLimiter = (req, res, next) => {
    if (req.method === "POST" && req.path === "/") {
        const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown_ip";
        const now = Date.now();
        const clientData = submissionTracker.get(clientIp) || { count: 0, firstSeen: now };

        if (now - clientData.firstSeen > RATE_LIMIT_WINDOW) {
            clientData.count = 1;
            clientData.firstSeen = now;
        } else {
            clientData.count += 1;
        }

        submissionTracker.set(clientIp, clientData);

        if (clientData.count > MAX_ENQUIRIES_PER_WINDOW) {
            return res.status(429).json({
                success: false,
                error: "Too many enquiries submitted from this IP. Please wait 15 minutes or connect directly via WhatsApp."
            });
        }
    }
    next();
};

// Middleware
app.use(cors());
app.use(express.json({ limit: "50kb" })); // Body limit to prevent oversized payload attacks

// Serve frontend static files (supporting root, public, and parent locations)
app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.static(path.resolve(__dirname, "..")));
app.use(express.static(__dirname));

// Explicit Root Route
app.get("/", (req, res) => {
    const publicIndex = path.resolve(__dirname, "public", "index.html");
    const parentIndex = path.resolve(__dirname, "..", "index.html");
    const localIndex = path.resolve(__dirname, "index.html");

    if (fs.existsSync(publicIndex)) {
        return res.sendFile(publicIndex);
    } else if (fs.existsSync(parentIndex)) {
        return res.sendFile(parentIndex);
    } else if (fs.existsSync(localIndex)) {
        return res.sendFile(localIndex);
    } else {
        return res.send(`
            <div style="font-family:sans-serif; text-align:center; padding:50px;">
                <h2>Shashwat Coaching Centre API is Running!</h2>
                <p>Status: OK</p>
            </div>
        `);
    }
});

// Admin Route Direct Shortcut
app.get("/admin", (req, res) => {
    const publicAdmin = path.resolve(__dirname, "public", "admin.html");
    const parentAdmin = path.resolve(__dirname, "..", "admin.html");

    if (fs.existsSync(publicAdmin)) {
        return res.sendFile(publicAdmin);
    } else if (fs.existsSync(parentAdmin)) {
        return res.sendFile(parentAdmin);
    } else {
        return res.redirect("/admin.html");
    }
});

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/enquiries", enquiryRateLimiter, enquiryRoutes);
app.use("/api/notices", noticeRoutes);

// Health check / Info route
app.get("/api/health", (req, res) => {
    res.json({
        message: "Shashwat Coaching Centre API is Running!",
        dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Connecting/Offline",
        security: {
            authRequired: true,
            rateLimitEnabled: true,
            securityHeaders: true
        },
        endpoints: [
            "POST /api/admin/login - Authenticate admin",
            "POST /api/enquiries - Submit enquiry (Public)",
            "GET /api/enquiries - List enquiries (Protected: Token Required)",
            "PATCH /api/enquiries/:id - Update enquiry status (Protected)",
            "DELETE /api/enquiries/:id - Delete enquiry (Protected)",
            "GET /api/notices - List announcements (Public)"
        ]
    });
});

// Start listening (in local/standard server environments)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Shashwat Coaching Backend running at http://localhost:${PORT}`);
    });
}

// Connect to MongoDB
if (process.env.MONGO_URI) {
    if (process.env.MONGO_URI.includes("<db_password>")) {
        console.warn("\n⚠️  [MongoDB Warning]: Your .env file still contains '<db_password>'. Please replace it with your actual MongoDB Atlas password to persist data in the cloud. In the meantime, the server will store leads in memory safely!\n");
    } else {
        mongoose
            .connect(process.env.MONGO_URI)
            .then(() => {
                console.log("✅ MongoDB Connected Successfully!");
            })
            .catch((error) => {
                console.error("❌ MongoDB connection error:", error.message);
            });
    }
} else {
    console.warn("⚠️  MONGO_URI not specified in .env. Running in offline/in-memory mode.");
}

// Export for Vercel Serverless Functions
module.exports = app;
