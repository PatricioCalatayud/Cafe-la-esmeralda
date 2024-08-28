import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../category.entity";
import { Subproduct } from "./subprodcut.entity";

@Entity({ name:"products" })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'int', default: 0})
    averageRating:number;

    @Column({default: false})
    isDeleted:boolean

    @Column({type: 'text', default: 'https://example.com/default-image.png'})
    imgUrl?: string;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @OneToMany(() => Subproduct, (subproduct) => subproduct.product)
    subproducts: Subproduct[];
}
