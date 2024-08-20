export const ErrorHandler = (err, req, res, next) => {
    if (err.message === "UNAUTHORIZED") {
        return res.status(401).json({ error: "Unauthorized access. Check your credentials." });
    } else if (err.message === "FORBIDDEN") {
        return res.status(403).json({ error: "You don't have permission to access this resource." });
    } else if (err.message === "NOT_FOUND") {
        return res.status(404).json({ error: "Resource not found." });
    } else if (err.message === "VALIDATION_ERROR") {
        return res.status(400).json({ error: "Validation error. Please check the data provided." });
    } else {
        return res.status(500).json({ error: `Internal server error ${err.message}` });
    }
};
