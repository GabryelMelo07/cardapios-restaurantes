import { dbConnection } from "../config/database.js";

export class MenuService {
    constructor() {
        this.db = dbConnection;
    }

    async getAll() {
        return await this.db.menu.findMany({
            orderBy: [
                {
                    id: 'asc'
                }
            ],
            include: {
                categories: {
                    include: {
                        products: true
                    }
                }
            }
        });
    }

    async getByRestaurantId(restaurantId) {
        const menu = await this.db.menu.findUnique({
            where: {
                restaurantId: Number(restaurantId)
            },
            include: {
                categories: {
                    include: {
                        products: true
                    }
                }
            }
        });

        if (!menu) {
            throw new Error("NOT_FOUND");
        }

        return menu;
    }

    async getRestaurantByFilter(page, pageSize, searchTerm) {
        const skip = (page - 1) * pageSize;
        searchTerm = searchTerm ? searchTerm.toLowerCase() : '';

        const totalRecords = await this.db.restaurant.count();

        const restaurants = await this.db.restaurant.findMany({
            skip: Number(skip),
            take: Number(pageSize),
            where: searchTerm ? {
                OR: [
                    {
                        menu: {
                            categories: {
                                some: {
                                    name: {
                                        contains: searchTerm,
                                    }
                                }
                            }
                        }
                    },
                    {
                        menu: {
                            categories: {
                                some: {
                                    products: {
                                        some: {
                                            name: {
                                                contains: searchTerm,
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            } : {},
            select: {
                id: true,
                name: true,
                location: true,
                openingHours: true,
                description: true,
                menu: {
                    select: {
                        id: true,
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

        return {
            totalRecords,
            totalPages: Math.ceil(totalRecords / pageSize),
            currentPage: Number(page),
            content: restaurants
        };
    }

    async createMenuFromPayload(restaurantId, categories) {
        const existingMenu = await this.db.menu.findUnique({
            where: {
                id: Number(restaurantId),
            },
            include: {
                categories: {
                    include: {
                        products: true,
                    },
                },
            },
        });

        if (existingMenu) {
            for (const category of categories) {
                const existingCategory = existingMenu.categories.find(c => c.name === category.name);

                if (existingCategory) {
                    for (const product of category.products) {
                        const existingProduct = existingCategory.products.find(p => p.name === product.name);

                        if (!existingProduct) {
                            await this.db.product.create({
                                data: {
                                    name: product.name,
                                    description: product.description,
                                    price: product.price,
                                    image: product.image,
                                    categoryId: existingCategory.id,
                                },
                            });
                        }
                    }
                } else {
                    await this.db.category.create({
                        data: {
                            name: category.name,
                            menuId: existingMenu.id,
                            products: {
                                create: category.products.map(product => ({
                                    name: product.name,
                                    description: product.description,
                                    price: product.price,
                                    image: product.image,
                                })),
                            },
                        },
                    });
                }
            }
        } else {
            await this.db.menu.create({
                data: {
                    restaurantId: Number(restaurantId),
                    categories: {
                        create: categories.map(category => ({
                            name: category.name,
                            products: {
                                create: category.products.map(product => ({
                                    name: product.name,
                                    description: product.description,
                                    price: product.price,
                                    image: product.image,
                                })),
                            },
                        })),
                    },
                },
            });
        }

        return await this.getByRestaurantId(restaurantId);
    }

    async addNewCategory(restaurantId, categoryName) {
        let existingMenu = await this.db.menu.findUnique({
            where: {
                restaurantId: Number(restaurantId)
            },
            include: {
                categories: true
            }
        });

        if (!existingMenu) {
            existingMenu = await this.db.menu.create({
                data: {
                    restaurant: {
                        connect: {
                            id: Number(restaurantId)
                        }
                    }
                }
            });
        }

        const newCategory = await this.db.category.create({
            data: {
                name: categoryName,
                menu: {
                    connect: {
                        id: existingMenu.id
                    }
                }
            }
        });

        existingMenu.categories.push(newCategory);

        return existingMenu;
    }

    async addProductToCategory(restaurantId, categoryId, name, description, price, image) {
        const product = await this.db.product.findUnique({
            where: {
                categoryId: Number(categoryId),
                name: name
            }
        });

        if (!product) {
            await this.db.product.create({
                data: {
                    name,
                    description,
                    price,
                    image,
                    category: {
                        connect: {
                            id: Number(categoryId)
                        }
                    }
                }
            });
        } else {
            await this.db.product.update({
                where: {
                    categoryId: Number(categoryId)
                },
                data: {
                    name,
                    description,
                    price,
                    image
                }
            });
        }

        return await this.db.menu.findUnique({
            where: {
                restaurantId: Number(restaurantId)
            },
            include: {
                categories: {
                    include: {
                        products: true
                    }
                }
            }
        });
    }

    async deleteCategory(categoryId) {
        await this.db.category.delete({
            where: {
                id: Number(categoryId)
            }
        });
    }

    async deleteProductFromCategory(productId) {
        await this.db.product.delete({
            where: {
                id: Number(productId)
            }
        });
    }

    async updateCategory(categoryId, categoryName) {
        const updatedCategory = await this.db.category.update({
            where: {
                id: Number(categoryId)
            },
            data: {
                name: categoryName
            }
        });

        return updatedCategory;
    }

    async updateProduct(productId, name, description, price, image) {
        try {
            const updatedProduct = await this.db.product.update({
                where: {
                    id: Number(productId)
                },
                data: {
                    name,
                    description,
                    price,
                    image
                }
            });

            return updatedProduct;
        } catch (error) {
            if (error.message.includes("Invalid `prisma.product.update()` invocation") && error.message.includes("Unique constraint failed on the fields: (`name`)")) {
                throw new Error("VALIDATION_ERROR");
            }

            throw error;
        }
    }

}