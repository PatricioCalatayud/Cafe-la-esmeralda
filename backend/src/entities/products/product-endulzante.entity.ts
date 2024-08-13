import { ChildEntity } from "typeorm";
import { Product } from "./product.entity";

@ChildEntity()
export class Endulzante extends Product{}