import { RestaurantService } from "../services/restaurant-service.js";

export class RestaurantController {
    constructor() {
        this.restaurantService = new RestaurantService();
    }

    async getAll(req, res) {
        const restaurants = await this.restaurantService.getAll();
        return res.json(restaurants);
    }

    async save(req, res, next) {
        try {
            const { name, location, openingHours, description } = req.body;
            const userId = req.user.id;
            const restaurant = await this.restaurantService.save(name, location, openingHours, description, userId);

            return res.json(restaurant);
        } catch (error) {
            return next(error);
        }
    }

    async share(req, res, next) {
        const { restaurantId, userIdToShare } = req.params;
        const ownerId = req.user.id;

        try {
            const restaurant = await this.restaurantService.share(restaurantId, userIdToShare, ownerId);
            return res.json(restaurant);
        } catch (error) {
            return next(error);
        }
    }

    async delete(req, res, next) {
        const { restaurantId } = req.params;
        const requestedBy = req.user.id;

        try {
            await this.restaurantService.delete(restaurantId, requestedBy);
            res.status(200).json({ message: "Restaurant successfully deleted." });
        } catch (error) {
            return next(error);
        }
    }

    async update(req, res, next) {
        const { restaurantId } = req.params;
        const requestedBy = req.user.id;
        const { name, location, openingHours, description } = req.body;

        try {
            const updatedRestaurant = await this.restaurantService.update(restaurantId, requestedBy, name, location, openingHours, description);
            res.status(200).json(updatedRestaurant);
        } catch (error) {
            return next(error);
        }
    }

}