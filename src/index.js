import express from 'express';

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// Router mapping
import { UserRouter } from './routers/user-router.js';
app.use(UserRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});