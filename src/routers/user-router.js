import { Router } from "express";
const UserRouter = Router();

import { UserController } from '../controllers/user-controller.js';
const userController = new UserController();

UserRouter.get('/users', (req, res) => userController.getAll(req, res));
UserRouter.post('/users', (req, res) => userController.save(req, res));

export { UserRouter };