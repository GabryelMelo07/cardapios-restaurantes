import { MenuService } from "../services/menu-service.js";

export class MenuController {
    constructor() {
        this.menuService = new MenuService();
    }

    async getAll(req, res) {
        const menus = await this.menuService.getAll();
        return res.json(menus);
    }

    async getByRestaurantId(req, res, next) {
        const { restaurantId } = req.params;

        try {
            const menus = await this.menuService.getByRestaurantId(restaurantId);
            return res.json(menus);
        } catch (error) {
            return next(error);
        }
    }

    async getRestaurantByFilter(req, res, next) {
        const { page = 1, pageSize = 10, searchTerm = "" } = req.query;
        const restaurants = await this.menuService.getRestaurantByFilter(page, pageSize, searchTerm);
        return res.json(restaurants);
    }


    async addNewCategory(req, res, next) {
        const { restaurantId } = req.params;
        const { categoryName } = req.body;

        try {
            const menu = await this.menuService.addNewCategory(restaurantId, categoryName);
            return res.status(201).json(menu);
        } catch (error) {
            return next(error);
        }
    }

    async addProductToCategory(req, res, next) {
        const { restaurantId, categoryId } = req.params;
        const { name, description } = req.body;
        const price = parseFloat(req.body.price);

        const image = req.file;

        try {
            const menu = await this.menuService.addProductToCategory(restaurantId, categoryId, name, description, price, image);
            return res.status(201).json(menu);
        } catch (error) {
            return next(error);
        }
    }

    async createMenuFromPayload(req, res, next) {
        const { restaurantId } = req.params;
        const { categories } = req.body;

        try {
            const menu = await this.menuService.createMenuFromPayload(restaurantId, categories);
            return res.status(201).json(menu);
        } catch (error) {
            return next(error);
        }
    }

    async deleteCategory(req, res, next) {
        const { restaurantId, categoryId } = req.params;

        try {
            await this.menuService.deleteCategory(restaurantId, categoryId);
            return res.status(200).json({ message: "Category deleted successfully." });
        } catch (error) {
            return next(error);
        }
    }

    async deleteProductFromCategory(req, res, next) {
        const { categoryId, productId } = req.params;

        try {
            await this.menuService.deleteProductFromCategory(categoryId, productId);
            return res.status(200).json({ message: "Product deleted from category successfully." });
        } catch (error) {
            return next(error);
        }
    }

    async updateCategory(req, res, next) {
        const { categoryId } = req.params;
        const { categoryName } = req.body;

        try {
            await this.menuService.updateCategory(categoryId, categoryName);
            return res.status(200).json({ message: "Category updated successfully." });
        } catch (error) {
            return next(error);
        }
    }

    async updateProduct(req, res, next) {
        const { productId } = req.params;
        const { name, description } = req.body;
        const price = parseFloat(req.body.price);
        const image = req.file;

        try {
            await this.menuService.updateProduct(productId, name, description, price, image);
            return res.status(200).json({ message: "Product updated successfully." });
        } catch (error) {
            return next(error);
        }
    }

    async uploadProductImage(req, res, next) {
        const { productId } = req.params;
        const image = req.file;

        try {
            await this.menuService.uploadProductImage(productId, image);
            return res.status(200).json({ message: "Product image uploaded successfully." });
        } catch (error) {
            return next(error);
        }
    }

}