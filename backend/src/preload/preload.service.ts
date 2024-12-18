import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, UpdateResult } from 'typeorm';
import * as dataCategory from './dataCategory.json';
import * as dataProducts1 from './dataProducts.json';
import * as dataUser from './dataUser.json';
import * as dataTestimony from './dataTestimony.json';
import * as dataRatings from './dataRatings.json'
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/products/product.entity';
import { Subproduct } from 'src/entities/products/subproduct.entity';
import { User } from 'src/entities/user.entity';
import { OrderService } from 'src/modules/order/order.service';
import { Testimony } from 'src/entities/testimony.entity';
import * as bcrypt from 'bcrypt';
import { Medida } from 'src/enum/medidas.enum';
import { Account } from 'src/entities/account.entity';
import { AccountTransaction } from 'src/entities/accountTransaction.entity';
import { Order } from 'src/entities/order.entity';
import { TransactionType } from 'src/enum/accountTransactionType.enum';
import { Role } from 'src/enum/roles.enum';
import { Rating } from 'src/entities/ratings.entity';
import { Bill } from 'src/entities/bill.entity';
@Injectable()
export class PreloadService implements OnModuleInit {
  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Subproduct) private subproductRepository: Repository<Subproduct>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Testimony) private testimonyRepository: Repository<Testimony>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(AccountTransaction) private accountTransactionRepository: Repository<AccountTransaction>,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(Rating) private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Bill) private readonly billRepository: Repository<Bill>,
    private readonly orderService: OrderService,
  ) {}

  async addDefaultCategories() {
    try {
      await Promise.all(
        dataCategory.map(async (category) => {
          await this.categoryRepository
            .createQueryBuilder()
            .insert()
            .into(Category)
            .values({ name: category })
            .orIgnore()
            .execute();
        }),
      );
      console.log('Precarga de categorías exitosa.');
    } catch (error) {
      console.error('Error al cargar categorías:', error.message);
    }
  }

  async addDefaultProducts() {
    try {
      await Promise.all(
        dataProducts1.map(async (product) => {
          const existCategory = await this.categoryRepository.findOne({
            where: { name: product.category },
          });

          if (!existCategory) {
            console.error(`Categoría ${product.category} no encontrada.`);
            return;
          }

          const createdProduct = this.productRepository.create({
            description: product.description,
            imgUrl: product.imgUrl,
            category: existCategory,
          });

          const savedProduct = await this.productRepository.save(createdProduct);

          if (product.subproducts && product.subproducts.length > 0) {
            const subproducts = product.subproducts.map((subproduct) =>
              this.subproductRepository.create({
                price: subproduct.price,
                stock: subproduct.stock,
                amount: subproduct.amount,
                unit: subproduct.unit as Medida,
                product: savedProduct,
                discount: subproduct.discount,
              }),
            );
            await this.subproductRepository.save(subproducts);
          }
        }),
      );
      console.log('Precarga de productos exitosa.');
    } catch (error) {
      console.error('Error al cargar productos:', error.message);
    }
  }

  async addDefaultUser() {
    try {
      const existingUsers = await this.userRepository.find({
        where: { id: In(dataUser.map((user) => user.id)) },
      });
  
      await Promise.all(
        dataUser.map(async (user) => {
          try {
            if (!user.email) {
              console.error(`El usuario ${user.id} tiene un email nulo.`);
              return; 
            }
  
            if (user.password) {
              user.password = await bcrypt.hash(user.password, 10);
            }
  
            
            const userRole = Object.values(Role).includes(user.role as Role) 
              ? user.role as Role 
              : Role.USER; 
  
            const objUser = this.userRepository.create({
              ...user,
              role: userRole, 
            });
  
            const existingUser = existingUsers.find((u) => u.id === user.id);
            if (!existingUser) {
              await this.userRepository.save(objUser);
            }
          } catch (error) {
            console.error(`Error al insertar el usuario ${user.id}: ${error.message}`);
          }
        }),
      );
  
      console.log('Precarga de usuarios exitosa.');
    } catch (error) {
      console.error('Error al cargar usuarios:', error.message);
    }
  }
  

  async addDefaultOrders() {
    try {
        const users = await this.userRepository.find();
        if (users.length === 0) {
            console.error('No hay usuarios disponibles.');
            return;
        }

        const products = await this.productRepository.find({
            relations: ['subproducts'],
        });

        if (products.length === 0) {
            console.error('No hay productos disponibles.');
            return;
        }

        const orderSchedules = [
            { month: 0, usersCount: 2, ordersCount: 3 }, // Enero
            { month: 1, usersCount: 3, ordersCount: 5 }, // Febrero
            { month: 2, usersCount: 1, ordersCount: 1 }, // Marzo
            { month: 3, usersCount: 2, ordersCount: 2 }, // Abril
            { month: 4, usersCount: 3, ordersCount: 4 }, // Mayo
            { month: 5, usersCount: 2, ordersCount: 2 }, // Junio
            { month: 6, usersCount: users.length, ordersCount: 25 }, // Julio
            { month: 7, usersCount: users.length, ordersCount: 25 }, // Agosto
            { month: 8, usersCount: users.length, ordersCount: 25 }, // Septiembre
            { month: 9, usersCount: 3, ordersCount: 5 }, // Octubre
            { month: 10, usersCount: 2, ordersCount: 3 }, // Noviembre
            { month: 11, usersCount: 1, ordersCount: 1 }, // Diciembre
        ];

        for (const schedule of orderSchedules) {
            const { month, usersCount, ordersCount } = schedule;

            const selectedUsers = users.slice(0, usersCount);
            const dates = Array.from({ length: ordersCount }, (_, i) =>
                new Date(2024, month, Math.floor(Math.random() * 28) + 1)
            );

            for (let i = 0; i < ordersCount; i++) {
                const user = selectedUsers[i % usersCount];
                const account = await this.accountRepository.findOne({
                    where: { user: { id: user.id } },
                });

                if (!account) {
                    console.error(`Cuenta no encontrada para el usuario ${user.id}`);
                    continue;
                }

                const productSelections = products.slice(0, 3).map((product) => {
                    const subproduct = product.subproducts[0];

                    const isOddMonth = month % 2 !== 0;
                    if (isOddMonth && subproduct) {
                        subproduct.discount = 100; // Bonificar subproducto
                        console.log(`Subproducto ${subproduct.id} bonificado en el mes ${month + 1}`);
                    }

                    return {
                        productId: product.id,
                        quantity: Math.floor(Math.random() * 5) + 1,
                        subproductId: subproduct?.id,
                    };
                });

                // Generar una identificación de ejemplo para las facturas
                const identification = `ID-${user.id}-${dates[i].getTime()}`;

                const order = await this.orderService.createOrder(
                    user.id,
                    productSelections,
                    'Calle Wallaby 42 Sidney',
                    'Transferencia',
                    'A',
                    dates[i],
                    identification // Pasar el parámetro identification
                );

                order.account = account;
                await this.orderRepository.save(order);

                const accountTransaction = this.accountTransactionRepository.create({
                    amount: 500,
                    type: TransactionType.PURCHASE,
                    account: account
                });

                await this.accountTransactionRepository.save(accountTransaction);

                console.log(`Pedido creado con fecha ${dates[i].toISOString()} para el usuario ${user.id}`);
            }
        }

        console.log('Precarga de pedidos exitosa con distribución mensual.');
    } catch (error) {
        console.error(`Error al crear los pedidos: ${error.message}`);
    }
}


  async addDefaultTestimonies() {
    try {
      await Promise.all(
        dataTestimony.map(async (testimony) => {
          const userFound = await this.userRepository.findOne({ where: { id: testimony.userID } });

          if (!userFound) {
            console.error(`Usuario ${testimony.userID} no encontrado.`);
            return;
          }

          const newTestimony = this.testimonyRepository.create({
            ...testimony,
            user: userFound,
          });

          await this.testimonyRepository.save(newTestimony);
        }),
      );
      console.log('Precarga de testimonios exitosa.');
    } catch (error) {
      console.error('Error al cargar testimonios:', error.message);
    }
  }

  async addDefaultAccounts() {
    try {
      const users = await this.userRepository.find();

      await Promise.all(
        users.map(async (user) => {
          const existingAccount = await this.accountRepository.findOne({ where: { user: { id: user.id } } });

          if (!existingAccount) {
            const account = this.accountRepository.create({
              user,
              creditLimit: 1000000,
              balance: 0
            });

            await this.accountRepository.save(account);
          }
        }),
      );

      console.log('Precarga de cuentas exitosa.');
    } catch (error) {
      console.error('Error al crear cuentas:', error.message);
    }
  }

  async rateProduct(rateProductDtoArray): Promise<Rating[]> {
    const ratings: Rating[] = [];

    for (const rateProductDto of rateProductDtoArray) {
        const { user, product, ratingValue } = rateProductDto;

        if (ratingValue === undefined || ratingValue === null) {
            throw new BadRequestException('El valor de la calificación no puede ser nulo o indefinido.');
        }

        const productEntity = await this.productRepository.findOne({ where: { description: product } });
        if (!productEntity) throw new NotFoundException(`No se encontró el producto. Nombre: ${product}`);

        const userEntity = await this.userRepository.findOne({ where: { id: user } });
        if (!userEntity) throw new NotFoundException(`No se encontró el usuario. ID: ${user}`);

        const rating = this.ratingRepository.create({
            rating: ratingValue,
            user: userEntity,
            product: productEntity
        });

        await this.ratingRepository.save(rating);
        ratings.push(rating);

        await this.updateAverageRating(productEntity.id); 
    }

    return ratings;
}

  

async updateAverageRating(productId: string): Promise<UpdateResult> {
    const ratings = await this.ratingRepository.find({ where: { product: { id: productId } } });
    const average = ratings.length > 0 
        ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length
        : 0;

    return await this.productRepository.update(productId, { averageRating: average });
}

  async onModuleInit() {
    await this.addDefaultCategories();
    await this.addDefaultProducts();
    await this.addDefaultUser();
    await this.addDefaultAccounts();
    await this.addDefaultOrders();
    await this.addDefaultTestimonies();
    await this.rateProduct(dataRatings)
  }
}