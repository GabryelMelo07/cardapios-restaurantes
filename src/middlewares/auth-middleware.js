import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
    const token = req.headers.authorization;

    try {
        const data = jwt.verify(token, process.env.API_SECRET);
        req.user = data;
        next();
    } catch (error) {
        console.log({ error });
        res.status(401).json({ error_message: "Not authenticated." });
    }
}
