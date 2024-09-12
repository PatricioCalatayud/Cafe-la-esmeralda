import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../category.entity";
import { Subproduct } from "./subproduct.entity";
import { Presentacion } from "src/enum/presentacion.enum";
import { TipoGrano } from "src/enum/tipoGrano.enum";
import { Rating } from "../ratings.entity";

@Entity({ name:"products" })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    
    @Column({type:'enum',
        enum:Presentacion,
        nullable: true,
    })
    presentacion: Presentacion;
    
    @Column({type:'enum',
        enum:TipoGrano,
        nullable: true,
    })
    tipoGrano:TipoGrano;
    
    @Column({type: 'text', default: 'https://example.com/default-image.png'})
    imgUrl?: string;
    
    @ManyToOne(() => Category, (category) => category.products)
    category: Category;
    
    @OneToMany(() => Subproduct, (subproduct) => subproduct.product,{
        cascade:true,
    })
    subproducts: Subproduct[];
    
    @OneToMany(()=>Rating, rating=>rating.product)
    ratings:Rating[];

    @Column({type: 'float', default: 0})
    averageRating:number;
}
