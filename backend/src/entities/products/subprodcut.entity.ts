import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({ name: 'subproducts' })
export class Subproduct {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'int', nullable: false })
    price: number;

    @Column({ type: 'int', nullable: false })
    stock: number;

    @Column({ type: 'int', nullable: false })
    amount: number; 

    @Column({ type: 'text', nullable: false })
    unit: string;

    @ManyToOne(() => Product, (product) => product.subproducts)
    product: Product;
}
