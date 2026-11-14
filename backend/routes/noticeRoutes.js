const express = require("express");
const router = express.Router();

// Preset notices/announcements for coaching institute
const notices = [
    {
        id: "1",
        title: "Admissions Open for Session 2026-27",
        category: "Admission",
        badge: "New",
        date: "Nov 2026",
        description: "Enrolment open for Class 9th, 10th (CBSE/ICSE) & 11th-12th Science batches. Limited seats per batch for personalized attention."
    },
    {
        id: "2",
        title: "STSE (Shashwat Talent Search Exam) 2026",
        category: "Scholarship",
        badge: "Upcoming",
        date: "Sunday, 10:00 AM",
        description: "Appear for the scholarship entrance exam and get up to 50% waiver on tuition fees. Open for Classes 8, 9, 10 & 11."
    },
    {
        id: "3",
        title: "Class 10th Board Exam Booster Batches",
        category: "Batches",
        badge: "Urgent",
        date: "Starting Every Monday",
        description: "Intensive revision on Science numericals, diagrams, and Mathematics sample paper solving."
    },
    {
        id: "4",
        title: "Weekend Doubt Clearing & Numerical Practice",
        category: "Academics",
        badge: "Regular",
        date: "Every Saturday & Sunday",
        description: "One-on-one session for students needing extra support in Physics numericals and Chemistry reactions."
    }
];

// @route GET /api/notices
router.get("/", (req, res) => {
    res.json({
        success: true,
        data: notices
    });
});

module.exports = router;
