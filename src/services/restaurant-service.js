import { dbConnection } from "../config/database.js";

export class RestaurantService {
    constructor() {
        this.db = dbConnection;
    }

    async getAll() {
        return await this.db.restaurant.findMany({
            orderBy: [
                { id: 'asc' }
            ]
        });
    }

    async save(name, location, openingHours, description, userId) {
        const newRestaurant = await this.db.restaurant.create({
            data: {
                name,
                location,
                openingHours,
                description,
                owner: {
                    connect: { id: userId }
                }
            }
        });

        return newRestaurant;
    }

    async share(restaurantId, userIdToShare, ownerId) {
        const restaurant = await this.db.restaurant.update({
            where: {
                id: Number(restaurantId),
                userId: ownerId
            },
            data: {
                sharedWith: {
                    connect: { id: userIdToShare }
                }
            }
        });

        return restaurant;
    }

}