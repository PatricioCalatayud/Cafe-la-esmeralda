import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetail } from "./orderdetail.entity";

@Entity({name:'transacciones'})
export class Transaccion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar'})
    status: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    timestamp: Date;

    @ManyToOne(() => OrderDetail, (orderdetail) => orderdetail.transactions)
    @JoinColumn({name: 'orderdetailsId'})
    orderdetail: OrderDetail;
}