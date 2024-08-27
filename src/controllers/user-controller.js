import { UserService } from "../services/user-service.js";
import { AuthService } from "../services/auth-service.js";

export class UserController {
    constructor() {
        this.userService = new UserService();
        this.authService = new AuthService();
    }

    async login(req, res, next) {
        try {
            const token = await this.authService.authenticate(req, res);
            return res.status(200).json({ token });
        } catch (error) {
            return next(error);
        }
    }

    async getAll(req, res) {
        const users = await this.userService.getAll();
        return res.json(users);
    }

    async save(req, res, next) {
        try {
            const { email, name, password, phone } = req.body;
            const user = await this.userService.save(email, name, password, phone);
            return res.status(201).json(user);
        } catch (error) {
            return next(error);
        }
    }

    async disable(req, res, next) {
        try {
            const { userId } = req.params;
            const user = req.user;

            if (user.id !== userId) { // Only the user can deactivate their profile.
                throw new Error('Cannot deactivate profile without permission.');
            }
            
            await this.userService.disable(userId);
            return res.status(200).json({ error_message: "User disabled" });
        } catch (error) {
            return next(error);
        }
    }

    async update(req, res, next) {
        const requestedBy = req.user.id;
        const { name, password, phone } = req.body;

        try {
            const updatedUser = await this.userService.update(requestedBy, name, password, phone);
            return res.status(200).json(updatedUser);
        } catch (error) {
            return next(error);
        }
    }

}
