// Admin Authentication Middleware
const getAdminSecret = () => process.env.ADMIN_SECRET || "shashwat@2026";

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers["authorization"] || req.headers["x-admin-key"];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized: Admin authentication token required to access student records."
        });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : authHeader.trim();

    if (token !== getAdminSecret()) {
        return res.status(403).json({
            success: false,
            error: "Forbidden: Invalid or expired admin credentials."
        });
    }

    next();
};

module.exports = {
    verifyAdmin,
    getAdminSecret
};
