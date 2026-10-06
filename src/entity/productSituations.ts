import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Product } from "./products.js";
import { Situation } from "./situations.js";

@Entity("product_situations")
export class ProductSituation {

    @PrimaryGeneratedColumn()
    idProductSituation!: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "idProduct" })
    product!: Product;

    @ManyToOne(() => Situation)
    @JoinColumn({ name: "idSituation" })
    situation!: Situation;
}