import { Router } from "express";
import { isAuth } from "../middlewares/auth-middleware.js";
import { UserController } from '../controllers/user-controller.js';

const UserRouter = Router();

const userController = new UserController();

UserRouter.post('/auth', (req, res, next) => userController.login(req, res, next));
UserRouter.get('/users', (req, res) => userController.getAll(req, res));
UserRouter.post('/users', (req, res, next) => userController.save(req, res, next));
UserRouter.put('/users/update/profile', isAuth, (req, res, next) => userController.update(req, res, next));
UserRouter.patch('/users/disable/:userId', isAuth, (req, res, next) => userController.disable(req, res, next));

export { UserRouter };