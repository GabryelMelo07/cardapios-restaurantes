import { dbConnection } from "../config/database.js";

export const isUserOwnerOrPartnerMiddleware = async (req, res, next) => {
    const { restaurantId } = req.params;
    const requestedBy = req.user.id;

    try {
        const restaurant = await dbConnection.restaurant.findUniqueOrThrow({
            where: {
                id: Number(restaurantId),
            },
            include: {
                sharedWith: true,
            }
        }, new Error("NOT_FOUND"));

        const isSharedWithUser = restaurant.sharedWith.some(user => user.id === requestedBy);

        if (restaurant.userId !== requestedBy && !isSharedWithUser) {
            throw new Error("NOT_ALLOWED");
        }

        next();
    } catch (err) {
        next(err);
    }
};
