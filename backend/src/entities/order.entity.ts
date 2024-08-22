import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductsOrder } from "./product-order.entity";
import { OrderDetail } from "./orderdetail.entity";
import { User } from "./user.entity";

@Entity({ name:'orders' })
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'timestamp'})
    date: Date;
    
    @Column({default:false})
    isDeleted:boolean

    @Column({ default: 'Pendiente' })
    status: string;

    @ManyToOne(()=>User,(user) => user.orders )
    @JoinColumn({name:'userId'})
    user: User

    @OneToMany(()=>ProductsOrder,(productsOrder)=>productsOrder.order, {cascade:true})
    productsOrder: ProductsOrder[]

    @OneToOne(()=>OrderDetail, (orderDetail)=>orderDetail.order)
    orderDetail: OrderDetail
}