
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from "typeorm";

import type { Relation } from "typeorm";
import { Product } from "./products.js";

@Entity("product_situations")
export class ProductSituation {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 255,
        nullable: false,
    })
    name!: string;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    createdAt!: Date;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updatedAt!: Date;

    @OneToMany(() => Product, (product) => product.productSituation)
    products!: Relation<Product[]>;
}
