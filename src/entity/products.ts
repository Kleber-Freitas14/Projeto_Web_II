
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import type { Relation } from "typeorm";
import { ProductCategory } from "./productCategories.js";
import { ProductSituation } from "./productSituations.js";

@Entity("products")
export class Product {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 255,
        nullable: false,
    })
    name!: string;

    @Column({
        type: "varchar",
        length: 255,
        unique: true,
        nullable: false,
    })
    slug!: string;

    @Column({
        type: "longtext",
        nullable: false,
    })
    description!: string;

    @Column("decimal", {
        precision: 10,
        scale: 2,
        nullable: false,
    })
    price!: number;

    @ManyToOne(
        () => ProductCategory,
        (category) => category.products,
        { nullable: false, onDelete: "RESTRICT" }
    )
    @JoinColumn({ name: "productCategoryId" })
    productCategory!: Relation<ProductCategory>;

    @ManyToOne(
        () => ProductSituation,
        (situation) => situation.products,
        { nullable: false, onDelete: "RESTRICT" }
    )
    @JoinColumn({ name: "productSituationId" })
    productSituation!: Relation<ProductSituation>;

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
}
