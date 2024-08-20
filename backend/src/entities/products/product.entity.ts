
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { Category } from "../category.entity";
import { ProductsOrder } from "../product-order.entity";
import { Storage } from "../storage.entity";
import { Subproduct } from "./subprodcut.entity"; 

@Entity({ name:"products" })
@TableInheritance({ column: { type: "varchar", name: "group" } })
export abstract class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({type: 'text', default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fmercadodecafes.com%2Fproducts%2Fbola-de-oro-descafeinado-cavebo005&psig=AOvVaw0XO-XJcI1cYBYRk3i88jOe&ust=1720381863582000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMjF9sOYk4cDFQAAAAAdAAAAABAE'})
    imgUrl?: string;

    @Column({ type: 'int', nullable: false })
    price: number;

    @Column({type: 'int', nullable: false})
    stock: number;

    @Column({ type: 'int', default: 0 })
    discount: number;

    @Column({ type: 'int', default: 0})
    averageRating:number;

    @Column({default: true})
    isAvailable:boolean

    @Column({default: false})
    isDeleted:boolean

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @OneToMany(() => ProductsOrder, (productsOrder) => productsOrder.product)
    productsOrder: ProductsOrder[];

    @OneToMany(() => Storage, (storage) => storage.product)
    storage: Storage[];

    @OneToMany(() => Subproduct, (subproduct) => subproduct.product)
    subproducts: Subproduct[];
}
