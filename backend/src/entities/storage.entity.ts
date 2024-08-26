import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./products/product.entity";
import { User } from "./user.entity";

@Entity({
    name: 'storage'
})
export class Storage {
    @PrimaryGeneratedColumn()
    id: string

    @ManyToOne(()=>User,(user)=>user)
    user:User

    @ManyToOne(()=>Product,(product)=>product)
    product:Product

    @Column()
    quantity: number
}