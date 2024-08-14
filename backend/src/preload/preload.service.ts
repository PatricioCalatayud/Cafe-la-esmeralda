import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/products/product.entity';
import { Repository } from 'typeorm';
import * as dataCategory from './dataCategory.json'
import * as dataProducts from './dataProducts.json'
import * as dataUser from './dataUser.json'
import { Coffee } from 'src/entities/products/product-coffee.entity';
import { Chocolate } from 'src/entities/products/product-chocolate.entity';
import { Mate } from 'src/entities/products/product-mate.entity';
import { Te } from 'src/entities/products/product-te.entity'
import { Endulzante } from 'src/entities/products/product-endulzante.entity';
import { Accesorio } from 'src/entities/products/product-accesorio.entity';
import { User } from 'src/entities/user.entity';
import { OrderService } from 'src/modules/order/order.service';
import { StorageOrderService } from 'src/modules/storageOrder/storage-order.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PreloadService implements OnModuleInit {
    private repositories: { [key: string]: { repository:Repository<any>, class:any } };
    constructor(
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
       private readonly storageService: StorageOrderService
    ) {
        this.repositories = {
            "Café": { repository: coffeeRepository, class: Coffee },
            "Chocolate": { repository: chocolateRepository, class: Chocolate },
            "Mate": { repository: mateRepository, class: Mate },
            "Té": { repository: teRepository, class: Te },
            "Endulzante": { repository: endulzanteRepository, class: Endulzante },
            "Accesorio": { repository: accesorioRepository, class: Accesorio },
        }
    }

    async addDefaultCategories() {
        await Promise.all(dataCategory.map(async(category) => {
            await this.categoryRepository
            .createQueryBuilder()
            .insert()
            .into(Category)
            .values({ name: category })
            .orIgnore()
            .execute()
        }))
    }

    async addDefaultProducts(dataProducts) {
        const products = dataProducts.map(async (product) => {
        const existCategory = await this.categoryRepository.findOne({ where: { name: product.category }});
        if(!existCategory) throw new Error(`Categoría ${product.category} no encontrada en la base de datos.`);

        const repository = this.repositories[product.category].repository;

        const createdProduct = repository.create({ ... product, category: existCategory.id });

        await repository.save(createdProduct);
    });

    await Promise.all(products);
    console.log(`Precarga de productos exitosa.`)
    }

    async addDefaultUser(dataUser) {
        await Promise.all(dataUser.map(async (user)=>{
            if (user.password) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                if (!hashedPassword) throw new BadRequestException('Error encriptando la contraseña.');
                user.password = hashedPassword;
            }
            
            const objUser = this.userRepository.create({ ...user });

            await this.userRepository.save(objUser);
        }))

        console.log("Precarga de usuarios exitosa.");
    }

    async addDefaultOrder() {
        const users = await this.userRepository.find();
        const product_1 = await this.chocolateRepository.find();
        const product_2 = await this.teRepository.find();

        await this.orderService.createOrder(users[0].id,[
            {id: product_1[0].id, quantity: 2},
            {id: product_2[0].id, quantity: 3}
        ], "Tienda", 0, undefined);
        
        console.log("Precarga de preorder exitosa.");
    }

    async addDefaultStorage() {
        const users = await this.userRepository.find();
        const product_1 = await this.chocolateRepository.find();
        const product_2 = await this.teRepository.find();

        await this.storageService.storage(users[0].id,[
            {id: product_1[0].id, quantity: 5},
            {id: product_2[0].id, quantity: 1}
        ])
        
        console.log("Precarga de storage exitosa.");
    }

    async onModuleInit() {
        await this.addDefaultCategories();
        await this.addDefaultProducts(dataProducts);
        await this.addDefaultUser(dataUser);
        await this.addDefaultOrder();
        await this.addDefaultStorage();
    }
}
