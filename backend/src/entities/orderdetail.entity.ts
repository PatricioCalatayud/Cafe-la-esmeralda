import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Transaccion } from "./transaction.entity";

@Entity({ name: 'orderDetail' })
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: "Tienda" })
    addressDelivery: string;

    @Column({ type: 'timestamp' })
    deliveryDate: Date;

    @Column({ type: 'decimal', scale: 2 })
    totalPrice: number;

    @Column({ type: 'int', default: 0 })
    cupoDescuento: number;

    @OneToOne(()=>Order, (order) => order.orderDetail)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @OneToMany(()=>Transaccion, (transaccion) => transaccion.orderdetail)
    transactions : Transaccion[];

    @BeforeInsert()
    setDefaultEventDate() {
        const currentDate = new Date();
        this.deliveryDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
    }
}