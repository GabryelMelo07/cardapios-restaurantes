import { UserService } from "../services/user-service.js";

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async getAll(req, res) {
        const users = await this.userService.getAll();
        return res.json(users);
    }

    async save(req, res) {
        try {
            const { email, name, password, phone } = req.body;
            const user = await this.userService.save(email, name, password, phone);
            return res.json(user);
        } catch (error) {
            res.status(500).send(`Internal server error ${error}`);
        }
    }

}

export { UserController };