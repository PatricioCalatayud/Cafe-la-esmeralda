import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as dataCategory from './dataCategory.json';
import * as dataProducts1 from './dataProducts.json';
import * as dataUser from './dataUser.json';
import * as dataTestimony from './dataTestimony.json';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/products/product.entity';
import { Subproduct } from 'src/entities/products/subprodcut.entity';
import { User } from 'src/entities/user.entity';
import { OrderService } from 'src/modules/order/order.service';
import { Testimony } from 'src/entities/testimony.entity';
import * as bcrypt from 'bcrypt';
import { Medida } from 'src/enum/medidas.enum';

@Injectable()
export class PreloadService implements OnModuleInit {
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Subproduct) private subproductRepository: Repository<Subproduct>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Testimony) private testimonyRepository: Repository<Testimony>,
        private readonly orderService: OrderService,
    ) {}

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

    async addDefaultProducts() {
        const dataProducts = dataProducts1;
    
        await Promise.all(dataProducts.map(async (product) => {
            try {
                const existCategory = await this.categoryRepository.findOne({ where: { name: product.category } });
                if (!existCategory) throw new Error(`Categoría ${product.category} no encontrada en la base de datos.`);
    
                const createdProduct = this.productRepository.create({
                    description: product.description,
                    imgUrl: product.imgUrl,
                    category: existCategory,
                });
    
                const savedProduct = await this.productRepository.save(createdProduct);
    
                if (product.subproducts && product.subproducts.length > 0) {
                    const subproducts = product.subproducts.map(subproduct => {
                        return this.subproductRepository.create({
                            price: subproduct.price,
                            stock: subproduct.stock,
                            amount: subproduct.amount,
                            unit: subproduct.unit as Medida, 
                            product: savedProduct ,
                            discount: subproduct.discount
                        });
                    });
    
                    await this.subproductRepository.save(subproducts);
                }
    
            } catch (error) {
                console.error(`Error al insertar el producto ${product.description}: ${error.message}`);
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
    
            const product1 = await this.productRepository.findOne({
                where: { description: "Cafe Mezcla" },  
                relations: ['subproducts'],
            });
    
            const product2 = await this.productRepository.findOne({
                where: { description: "Portasobres" }, 
                relations: ['subproducts'],
            });
    
            if (!product1) {
                console.error("Producto 'Cafe Mezcla' no encontrado");
            } else if (!product1.subproducts.length) {
                console.error("Producto 'Cafe Mezcla' encontrado pero no tiene subproductos");
            }
    
            if (!product2) {
                console.error("Producto 'Portasobres' no encontrado");
            } else if (!product2.subproducts.length) {
                console.error("Producto 'Portasobres' encontrado pero no tiene subproductos");
            }
    
            if (!product1 || !product2 || !product1.subproducts.length || !product2.subproducts.length) {
                throw new Error("Productos o subproductos no encontrados en la base de datos");
            }
    
            await this.orderService.createOrder(users[0].id, [
                { productId: product1.id, quantity: 2, subproductId: product1.subproducts[0].id },
                { productId: product2.id, quantity: 3, subproductId: product2.subproducts[0].id }
            ], "Tienda", false);
    
            console.log("Precarga de pedido exitosa.");
        } catch (error) {
            console.error(`Error al crear el pedido: ${error.message}`);
        }
    }
    
    async addDefaultTestimonies() {
        await Promise.all(dataTestimony.map(async (testimony) => {
            try {
                const userFound = await this.userRepository.findOneBy({ id: testimony.userID });
                if (!userFound) throw new Error(`Usuario con ID ${testimony.userID} no encontrado.`);

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
        await this.addDefaultProducts();
        await this.addDefaultUser(dataUser);
        await this.addDefaultOrder();
        await this.addDefaultTestimonies();
    }
}
