const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const enquiryRoutes = require("./routes/enquiryRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

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
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/notices", noticeRoutes);

// Health check / Info route
app.get("/api/health", (req, res) => {
    res.json({
        message: "Shashwat Coaching Centre API is Running!",
        dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Connecting/Offline",
        endpoints: [
            "POST /api/enquiries - Submit enquiry",
            "GET /api/enquiries - List enquiries (Admin)",
            "PATCH /api/enquiries/:id - Update enquiry status",
            "DELETE /api/enquiries/:id - Delete enquiry",
            "GET /api/notices - List announcements"
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
