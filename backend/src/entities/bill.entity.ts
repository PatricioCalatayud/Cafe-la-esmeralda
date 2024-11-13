import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({ name: 'bill' })
export class Bill {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: true })
    type: string | null;

    @Column({ type: 'varchar', nullable: true })
    imgUrl: string | null;

    @Column({type: 'integer', nullable: true})
    dni: number | null;
    
    @Column({type: 'integer', nullable: true})
    cuit: number | null;

    @OneToOne(() => Order, order => order.id)
    @JoinColumn()
    order: Order['id'];
   
}