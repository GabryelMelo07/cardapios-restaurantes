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

}