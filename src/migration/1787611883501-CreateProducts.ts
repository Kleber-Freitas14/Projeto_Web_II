import { Table, TableForeignKey } from "typeorm";
import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProducts1787611883501 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "products",
                columns: [
                    {
                        name: "idProduct",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "nameProduct",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "priceProduct",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: "idProductCategory",
                        type: "int",
                        isNullable: false,
                    },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "products",
            new TableForeignKey({
                columnNames: ["idProductCategory"],
                referencedTableName: "product_categories",
                referencedColumnNames: ["idProductCategory"],
                onDelete: "RESTRICT",
                onUpdate: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("products");

        const foreignKey = table?.foreignKeys.find(
            fk => fk.columnNames.includes("idProductCategory")
        );

        if (foreignKey) {
            await queryRunner.dropForeignKey("products", foreignKey);
        }

        await queryRunner.dropTable("products");
    }
}