const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Student/Parent name is required"],
            trim: true
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true
        },
        email: {
            type: String,
            trim: true,
            default: ""
        },
        classLevel: {
            type: String,
            required: [true, "Class is required"],
            default: "Class 10"
        },
        board: {
            type: String,
            default: "CBSE"
        },
        message: {
            type: String,
            trim: true,
            default: ""
        },
        status: {
            type: String,
            enum: ["New", "Contacted", "Demo Scheduled", "Enrolled", "Closed"],
            default: "New"
        },
        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
