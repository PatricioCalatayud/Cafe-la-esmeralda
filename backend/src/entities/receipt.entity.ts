import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class Receipt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: true })
    image: string | null;

    @Column({ type: 'varchar', default: 'Pendiente de subir comprobante' })
    status: string;

    @OneToOne(() => Order, (order) => order.id, { cascade: true })
    @JoinColumn()
    order: Order['id'];
}