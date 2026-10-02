import { Table } from "typeorm";
import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductCategories1787611883500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "product_categories",
                columns: [
                    {
                        name: "idProductCategory",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "nameProductCategory",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("product_categories");
    }
}