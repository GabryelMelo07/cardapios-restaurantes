import { Router } from "express";
import { isAuth } from "../middlewares/auth-middleware.js";
import { RestaurantController } from "../controllers/restaurant-controller.js";

const RestaurantRouter = Router();

const restaurantController = new RestaurantController();

RestaurantRouter.get('/restaurants', (req, res) => restaurantController.getAll(req, res));
RestaurantRouter.post('/restaurants', isAuth, (req, res, next) => restaurantController.save(req, res, next));
RestaurantRouter.patch('/restaurants/:restaurantId/share/:userIdToShare', isAuth, (req, res, next) => restaurantController.share(req, res, next));

export { RestaurantRouter };