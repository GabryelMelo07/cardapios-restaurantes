import { Router } from "express";
import { isAuth } from "../middlewares/auth-middleware.js";
import { RestaurantController } from "../controllers/restaurant-controller.js";
import { isUserOwnerOrPartnerMiddleware } from "../middlewares/validate-restaurant-ownership-middleware.js";

const RestaurantRouter = Router();

const restaurantController = new RestaurantController();

RestaurantRouter.get('/restaurants', (req, res) => restaurantController.getAll(req, res));
RestaurantRouter.post('/restaurants', isAuth, (req, res, next) => restaurantController.save(req, res, next));
RestaurantRouter.put('/restaurants/:restaurantId', isAuth, isUserOwnerOrPartnerMiddleware, (req, res, next) => restaurantController.update(req, res, next));
RestaurantRouter.delete('/restaurants/:restaurantId/delete', isAuth, (req, res, next) => restaurantController.delete(req, res, next));
RestaurantRouter.patch('/restaurants/:restaurantId/share/:userIdToShare', isAuth, (req, res, next) => restaurantController.share(req, res, next));

export { RestaurantRouter };