import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./products/product.entity";
import { Order } from "./order.entity";

@Entity({name:'productsOrder'})
export class ProductsOrder{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    quantity: number;

    @ManyToOne(() => Product, (product) => product.productsOrder, { eager: true })
    product: Product;

    @ManyToOne(() => Order, (order) => order.productsOrder)
    order: Order;
}