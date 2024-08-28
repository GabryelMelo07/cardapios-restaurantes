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
            select: {
                id: true,
                name: true,
                location: true,
                openingHours: true,
                description: true,
                userId: true,
                sharedWith: true,
                menu: {
                    select: {
                        categories: {
                            select: {
                                id: true,
                                name: true,
                                products: {
                                    select: {
                                        id: true,
                                        name: true,
                                        description: true,
                                        price: true,
                                        image: true,
                                    }
                                }
                            }
                        }
                    }
                }
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
        try {
            const restaurant = await this.db.restaurant.update({
                where: {
                    id: Number(restaurantId),
                    userId: ownerId
                },
                include: {
                    sharedWith: true
                },
                data: {
                    sharedWith: {
                        connect: { id: userIdToShare }
                    }
                }
            });
    
            return restaurant;
        } catch (error) {
            if (error.message.includes("Invalid `prisma.restaurant.update()` invocation") && error.message.includes("Required exactly one parent ID to be present for connect query")) {
                throw new Error("NOT_ALLOWED");
            }

            throw error;
        }
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

    async update(restaurantId, name, location, openingHours, description) {
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