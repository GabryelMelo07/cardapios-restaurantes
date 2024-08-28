import { Router } from "express";
import { isAuth } from "../middlewares/auth-middleware.js";
import { MenuController } from "../controllers/menu-controller.js";
import { isUserOwnerOrPartnerMiddleware } from "../middlewares/validate-restaurant-ownership-middleware.js";
import { logInfo } from "../middlewares/log-middleware.js";

const MenuRouter = Router();

const menuController = new MenuController();

MenuRouter.get('/menus', (req, res) => menuController.getAll(req, res));
MenuRouter.get('/menu/restaurant/:restaurantId', isAuth, (req, res, next) => menuController.getByRestaurantId(req, res, next));
MenuRouter.get('/menus/find', isAuth, (req, res, next) => menuController.getRestaurantByFilter(req, res, next));
MenuRouter.post('/menus/restaurant/:restaurantId/create', isAuth, isUserOwnerOrPartnerMiddleware, logInfo, (req, res, next) => menuController.createMenuFromPayload(req, res, next));
MenuRouter.post('/menus/restaurant/:restaurantId/add-category', isAuth, isUserOwnerOrPartnerMiddleware, logInfo, (req, res, next) => menuController.addNewCategory(req, res, next));
MenuRouter.post('/menus/restaurant/:restaurantId/category/:categoryId/add-product', isAuth, isUserOwnerOrPartnerMiddleware, logInfo, (req, res, next) => menuController.addProductToCategory(req, res, next));
MenuRouter.delete('/menus/restaurant/:restaurantId/category/:categoryId/delete', isAuth, isUserOwnerOrPartnerMiddleware, logInfo, (req, res, next) => menuController.deleteCategory(req, res, next));
MenuRouter.delete('/menus/restaurant/:restaurantId/category/:categoryId/product/:productId/delete', isAuth, isUserOwnerOrPartnerMiddleware, logInfo, (req, res, next) => menuController.deleteProductFromCategory(req, res, next));
MenuRouter.patch('/menus/restaurant/:restaurantId/category/:categoryId/update-name', isAuth, isUserOwnerOrPartnerMiddleware, logInfo, (req, res, next) => menuController.updateCategory(req, res, next));
MenuRouter.put('/menus/restaurant/:restaurantId/product/:productId/update', isAuth, isUserOwnerOrPartnerMiddleware, logInfo, (req, res, next) => menuController.updateProduct(req, res, next));

export { MenuRouter };