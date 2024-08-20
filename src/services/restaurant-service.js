import { dbConnection } from "../config/database.js";

export class RestaurantService {
    constructor() {
        this.db = dbConnection;
    }

    async getAll() {
        return await this.db.restaurant.findMany({
            orderBy: [
                { id: 'asc' }
            ],
            include: {
                sharedWith: true
            }
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

    async delete(restaurantId, requestedBy) {
        const restaurant = await this.db.restaurant.findUniqueOrThrow({
            where: { id: Number(restaurantId) }
        }, new Error("NOT_FOUND"));

        if (restaurant.userId !== requestedBy) {
            throw new Error("RESOURCE_NOT_OWNED");
        }

        await this.db.restaurant.delete({
            where: {
                id: Number(restaurantId)
            }
        });
    }

    async update(restaurantId, requestedBy, name, location, openingHours, description) {
        const restaurant = await this.db.restaurant.findUniqueOrThrow({
            where: {
                id: Number(restaurantId),
            },
            include: {
                sharedWith: true
            }
        }, new Error("NOT_FOUND"));

        if (!restaurant) {
            throw new Error("NOT_FOUND");
        }

        const isSharedWithUser = restaurant.sharedWith.some(user => user.id === requestedBy);

        if (restaurant.userId !== requestedBy && !isSharedWithUser) {
            throw new Error("NOT_ALLOWED");
        }

        const updatedRestaurant = await this.db.restaurant.update({
            where: {
                id: Number(restaurantId)
            },
            data: {
                name,
                location,
                openingHours,
                description
            }
        });

        return updatedRestaurant;
    }

}