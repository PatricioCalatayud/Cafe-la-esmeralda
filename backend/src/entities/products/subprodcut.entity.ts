import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

import { Medida } from "src/enum/medidas.enum";
import { ProductsOrder } from "../product-order.entity";

@Entity({ name: 'subproducts' })
export class Subproduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int', nullable: false })
    price: number;

    @Column({ type: 'int', nullable: false })
    stock: number;

    @Column({ type: 'int', nullable: false })
    amount: number; 

    @Column({type: 'enum',
            enum: Medida,
            nullable: false
          })
    unit: Medida;

    @Column({ type: 'int', default: 0 })
    discount: number;


    @Column({default: true})
    isAvailable:boolean

    @ManyToOne(() => Product, (product) => product.subproducts)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @OneToMany(() => ProductsOrder, (productsOrder) => productsOrder.subproduct)  
    productsOrder: ProductsOrder[];
} 
