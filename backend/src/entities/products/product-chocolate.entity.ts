import { ChildEntity,Column, Entity } from "typeorm";
import { Product } from "./product.entity";

@ChildEntity()
//@Entity()
export class Chocolate extends Product{

}