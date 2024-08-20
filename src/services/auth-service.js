import { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbConnection } from "../config/database.js";

export class AuthService {
    constructor() {
        this.db = dbConnection;
    }

    async authenticate(req, res) {
        const { email, password } = req.body;

        const user = await this.db.user.findUnique({
            where: {
                email
            }
        });

        if (user === null || user === undefined) {
            throw new Error("NOT_FOUND")
        }
        
        let token = null;

        if (compareSync(password, user.password)) {
            delete user.password;
            token = jwt.sign(user, process.env.API_SECRET, { expiresIn: '3600s' });
        } else {
            throw new Error("UNAUTHORIZED");
        }

        return token;
    }
}