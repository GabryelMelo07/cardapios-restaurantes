import express from 'express';
import { PrismaClient } from "@prisma/client";
import { UserRouter } from './routers/user-router.js';
import { RestaurantRouter } from './routers/restaurant-router.js';
import { ErrorHandler } from './middlewares/error-handler.js';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// Router mapping
app.use(UserRouter);
app.use(RestaurantRouter);

// Global Error Handling
app.use(ErrorHandler);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});