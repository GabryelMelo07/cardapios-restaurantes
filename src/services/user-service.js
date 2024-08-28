import { hashSync } from "bcrypt";
import { dbConnection } from "../config/database.js";

export class UserService {
    constructor() {
        this.db = dbConnection;
    }

    async getAll() {
        return await this.db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                active: true,
                createdAt: true,
                updatedAt: true
            },
            where: {
                active: true
            },
            orderBy: [
                { name: 'asc' }
            ]
        });
    }

    async save(email, name, password, phone) {
        const encryptedPassword = hashSync(password, 12);

        const newUser = await this.db.user.create({
            data: {
                email,
                name,
                password: encryptedPassword,
                phone
            }
        });

        delete newUser['password'];
        return newUser;
    }

    async disable(userId) {
        await this.db.user.update({
            where: {
                id: userId
            },
            data: {
                active: false
            }
        });
    }

    async update(requestedBy, name, password, phone) {
        const user = await this.db.user.findUniqueOrThrow({
            where: {
                id: requestedBy
            }
        }, new Error("NOT_FOUND"));

        if (user.id !== requestedBy) {
            throw new Error("FORBIDDEN")
        }

        const encryptedPassword = hashSync(password, 12);
        
        const updatedUser = await this.db.user.update({
            where: {
                id: requestedBy
            },
            data: {
                name,
                password: encryptedPassword,
                phone
            }
        });

        delete updatedUser['password'];
        return updatedUser;
    }

}