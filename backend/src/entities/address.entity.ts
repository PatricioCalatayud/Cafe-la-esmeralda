//Provicncia, Localidad y direccion.

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int',  })
    province: number    

    @Column({ type: 'varchar' })
    localidad: string

    @Column({ type: 'int' })
    deliveryNumber: number

    @Column({ type: 'varchar' })
    address: string

    @OneToOne(()=> User, user => user.address)
    user: User

}