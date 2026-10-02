import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

@Entity("product_categories")
export class ProductCategory {

    @PrimaryGeneratedColumn()
    idProductCategory!: number;

    @Column({ length: 100 })
    nameProductCategory!: string;
}