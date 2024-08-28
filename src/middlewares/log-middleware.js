import { dbConnection } from "../config/database.js";

export const logInfo = async (req, res, next) => {
    const { method, path, user = undefined } = req;

    await dbConnection.logs.create({
        data: {
            action: method,
            userId: user ? user.id : undefined,
            path: path
        }
    });
    
    next();
};