import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { ProductCategory } from "./productCategories.js";

@Entity("products")
export class Product {

    @PrimaryGeneratedColumn()
    idProduct!: number;

    @Column({ length: 100 })
    nameProduct!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    priceProduct!: number;

    @ManyToOne(() => ProductCategory)
    @JoinColumn({ name: "idProductCategory" })
    productCategory!: ProductCategory;
}