import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products/products.module';
import { PreloadService } from './preload/preload.service';
import { Category } from './entities/category.entity';
import { Product } from './entities/products/product.entity';
import { Subproduct } from './entities/products/subproduct.entity';
import { User } from 'src/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { OrderModule } from './modules/order/order.module';
import { MercadoPagoModule } from './modules/mercadopago/mercado-pago.module';
import { JwtModule } from '@nestjs/jwt';
import { TestimonyModule } from './modules/testimony/testimony.module';
import { Testimony } from './entities/testimony.entity';
import { CategoryModule } from './modules/categories/category.module';
import { ImageModule } from './modules/images/image.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { ProductRatingModule } from './modules/product-rating/product-rating.module';
import { AccountModule } from './modules/account/account.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { BillModule } from './modules/bill/bill.module';
import { Account } from './entities/account.entity';
import { AccountTransaction } from './entities/accountTransaction.entity';
import { Order } from './entities/order.entity';
import { Rating } from './entities/ratings.entity';
import { MetricsModule } from './modules/metrics/metrics.module';
import { OrderDetail } from './entities/orderdetail.entity';
import { CsvModule } from './modules/csv/csv.module';
import { Address } from './entities/address.entity';
import { AddressModule } from './modules/address/address.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) =>
        ConfigService.get('typeorm'),
    }),
    TypeOrmModule.forFeature([Testimony, Product, Subproduct, Category, User, Account, AccountTransaction, Order,OrderDetail, Rating, Address]),
    AddressModule,
    AuthModule,
    ImageModule,
    UsersModule,
    ProductsModule,
    OrderModule,
    MercadoPagoModule,
    ProductRatingModule,
    TestimonyModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
    CategoryModule,
    MailerModule,
    AccountModule,
    TasksModule,
    BillModule,
    MetricsModule,
    CsvModule
  ],
  controllers: [AppController],
  providers: [AppService, PreloadService],
})
export class AppModule {}
