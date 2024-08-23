import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/products/product.entity';
import { Repository, In } from 'typeorm';
import * as dataCategory from './dataCategory.json';
import * as dataProducts from './dataProducts.json';
import * as dataUser from './dataUser.json';
import * as dataTestimony from './dataTestimony.json';
import { Coffee } from 'src/entities/products/product-coffee.entity';
import { Chocolate } from 'src/entities/products/product-chocolate.entity';
import { Mate } from 'src/entities/products/product-mate.entity';
import { Te } from 'src/entities/products/product-te.entity';
import { Endulzante } from 'src/entities/products/product-endulzante.entity';
import { Accesorio } from 'src/entities/products/product-accesorio.entity';
import { User } from 'src/entities/user.entity';
import { OrderService } from 'src/modules/order/order.service';
import { Subproduct } from 'src/entities/products/subprodcut.entity';
import * as bcrypt from 'bcrypt';
import { Testimony } from 'src/entities/testimony.entity';

@Injectable()
export class PreloadService implements OnModuleInit {
    private repositories: { [key: string]: { repository: Repository<any>, class: any } };

    constructor(
        @InjectRepository(Testimony) private testimonyRepository: Repository<Testimony>,
        @InjectRepository(Subproduct) private subproductRepository: Repository<Subproduct>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Coffee) private coffeeRepository: Repository<Coffee>,
        @InjectRepository(Chocolate) private chocolateRepository: Repository<Chocolate>,
        @InjectRepository(Mate) private mateRepository: Repository<Mate>,
        @InjectRepository(Te) private teRepository: Repository<Te>,
        @InjectRepository(Endulzante) private endulzanteRepository: Repository<Endulzante>,
        @InjectRepository(Accesorio) private accesorioRepository: Repository<Accesorio>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly orderService: OrderService,
    ) {
        this.repositories = {
            "Coffee": { repository: coffeeRepository, class: Coffee },
            "Chocolate": { repository: chocolateRepository, class: Chocolate },
            "Mate": { repository: mateRepository, class: Mate },
            "Tea": { repository: teRepository, class: Te },
            "Sweetener": { repository: endulzanteRepository, class: Endulzante },
            "Accesory": { repository: accesorioRepository, class: Accesorio },
        }
    }

    async addDefaultCategories() {
        await Promise.all(dataCategory.map(async (category) => {
            try {
                await this.categoryRepository
                    .createQueryBuilder()
                    .insert()
                    .into(Category)
                    .values({ name: category })
                    .orIgnore()
                    .execute();
            } catch (error) {
                console.error(`Error al insertar la categoría ${category}: ${error.message}`);
            }
        }));
        console.log(`Precarga de categorías exitosa.`);
    }

    async addDefaultProducts(dataProducts) {
        await Promise.all(dataProducts.map(async (product) => {
            try {
                const existCategory = await this.categoryRepository.findOne({ where: { name: product.category } });
                if (!existCategory) throw new Error(`Categoría ${product.category} no encontrada en la base de datos.`);

                const repository = this.repositories[product.category].repository;

                const createdProduct = repository.create({
                    ...product,
                    category: existCategory.id
                });

                await repository.save(createdProduct);

                if (product.subproducts && product.subproducts.length > 0) {
                    const subproductRepository = this.subproductRepository;

                    const subproducts = product.subproducts.map(subproduct => {
                        return subproductRepository.create({
                            ...subproduct,
                            product: createdProduct
                        });
                    });

                    await subproductRepository.save(subproducts);
                }
            } catch (error) {
                console.error(`Error al insertar el producto ${product.name}: ${error.message}`);
            }
        }));
        console.log(`Precarga de productos exitosa.`);
    }

    async addDefaultUser(dataUser) {
        const existingUsers = await this.userRepository.find({ where: { id: In(dataUser.map(user => user.id)) } });

        await Promise.all(dataUser.map(async (user) => {
            try {
                if (user.password) {
                    const hashedPassword = await bcrypt.hash(user.password, 10);
                    if (!hashedPassword) throw new BadRequestException('Error encriptando la contraseña.');
                    user.password = hashedPassword;
                }

                const existingUser = existingUsers.find(existing => existing.id === user.id);
                if (!existingUser) {
                    const objUser = this.userRepository.create({ ...user });
                    await this.userRepository.save(objUser);
                }
            } catch (error) {
                console.error(`Error al insertar el usuario ${user.id}: ${error.message}`);
            }
        }));

        console.log("Precarga de usuarios exitosa.");
    }

    async addDefaultOrder() {
        try {
            const users = await this.userRepository.find();
            const product1 = await this.productRepository.findOneBy({ id: "71eb1c05-21e5-4286-8ad6-617332062210" });
            const product2 = await this.productRepository.findOneBy({ id: "5da19309-b219-44b7-9111-1e56adebe1c7" });
            if (!product1 || !product2) {
                throw new Error("Productos no encontrados en la base de datos");
            }  

            await this.orderService.createOrder(users[0].id, [
                { id: product1.id, quantity: 2 },
                { id: product2.id, quantity: 3 }
            ], "Tienda", false);

            console.log("Precarga de preorder exitosa.");
        } catch (error) {
            console.error(`Error al crear el pedido: ${error.message}`);
        }
    }

    async addDefaultTestimonies() {
        await Promise.all(dataTestimony.map(async (testimony) => {
            try {
                const userFound = await this.userRepository.findOneBy({ id: testimony.userID });
                if (!userFound) throw new Error(`User with ID ${testimony.userID} not found.`);

                const newTestimony = this.testimonyRepository.create({
                    ...testimony,
                    user: userFound
                });

                await this.testimonyRepository.save(newTestimony);
            } catch (error) {
                console.error(`Error al insertar el testimonio del usuario ${testimony.userID}: ${error.message}`);
            }
        }));
        console.log(`Precarga de testimonios exitosa.`);
    }

    async onModuleInit() {
        await this.addDefaultCategories();
        await this.addDefaultProducts(dataProducts);
        await this.addDefaultUser(dataUser);
        await this.addDefaultOrder();
        await this.addDefaultTestimonies();
    }
}
