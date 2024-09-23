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
  

  async addDefaultOrder() {
    try {
      const users = await this.userRepository.find();
      if (users.length === 0) {
        console.error('No hay usuarios disponibles.');
        return;
      }

      const product1 = await this.productRepository.findOne({
        where: { description: 'Cafe Mezcla' },
        relations: ['subproducts'],
      });
      const product2 = await this.productRepository.findOne({
        where: { description: 'Portasobres' },
        relations: ['subproducts'],
      });

      if (!product1?.subproducts?.length || !product2?.subproducts?.length) {
        console.error('Productos o subproductos no encontrados.');
        return;
      }

      const user = users[0];

      const account = await this.accountRepository.findOne({
        where: { user: { id: user.id } },
      });

      if (!account) {
        throw new Error(`Cuenta no encontrada para el usuario ${user.id}`);
      }

      const order = await this.orderService.createOrder(user.id, [
        { productId: product1.id, quantity: 2, subproductId: product1.subproducts[0].id },
        { productId: product2.id, quantity: 3, subproductId: product2.subproducts[0].id },
      ], 'Calle Wallaby 42 Sidney');

      order.account = account;
      await this.orderRepository.save(order);

      const accountTransaction = this.accountTransactionRepository.create({
        amount: 500,
        type: TransactionType.PURCHASE,
        account: account,
      });

      await this.accountTransactionRepository.save(accountTransaction);

      console.log('Precarga de pedido y transacción exitosa.');
    } catch (error) {
      console.error(`Error al crear el pedido: ${error.message}`);
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
              balance: 0,
            });
<<<<<<< HEAD
    
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
    
            await this.orderService.createOrder(users[3].id, [
                { productId: product1.id, quantity: 2, subproductId: product1.subproducts[0].id },
                { productId: product2.id, quantity: 3, subproductId: product2.subproducts[0].id }
            ], "Calle Wallaby 42 Sidney");
    
            console.log("Precarga de pedido exitosa.");
        } catch (error) {
            console.error(`Error al crear el pedido: ${error.message}`);
=======

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
>>>>>>> 4e0ea180773eb5c6f6e2870b7d222649a91cb011
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
    await this.addDefaultOrder();
    await this.addDefaultTestimonies();
    await this.rateProduct(dataRatings)
  }
}
