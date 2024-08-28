import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Subproduct } from "./products/subprodcut.entity";

import { Order } from "./order.entity";

@Entity({ name: 'productsOrder' })
export class ProductsOrder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantity: number;

    @ManyToOne(() => Subproduct, (subproduct) => subproduct.productsOrder, { eager: true })
    subproduct: Subproduct;

    @ManyToOne(() => Order, (order) => order.productsOrder)
    order: Order;
}
