import { Table, TableForeignKey } from "typeorm";
import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductSituations1787611883502 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        const table = await queryRunner.getTable("product_situations");

        // Se a tabela não existir, cria a tabela completa
        if (!table) {

            await queryRunner.createTable(
                new Table({
                    name: "product_situations",
                    columns: [
                        {
                            name: "idProductSituation",
                            type: "int",
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: "increment",
                        },
                        {
                            name: "idProduct",
                            type: "int",
                            isNullable: false,
                        },
                        {
                            name: "idSituation",
                            type: "int",
                            isNullable: false,
                        },
                    ],
                })
            );

            await queryRunner.createForeignKey(
                "product_situations",
                new TableForeignKey({
                    columnNames: ["idProduct"],
                    referencedTableName: "products",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                })
            );
        }

        // Verifica novamente a tabela
        const updatedTable = await queryRunner.getTable("product_situations");

        // Verifica se já existe uma FK para idSituation
        const situationForeignKey = updatedTable?.foreignKeys.find(
            fk => fk.columnNames.includes("idSituation")
        );

        // Se não existir, cria a FK
        if (!situationForeignKey) {

            await queryRunner.createForeignKey(
                "product_situations",
                new TableForeignKey({
                    columnNames: ["idSituation"],
                    referencedTableName: "situations",
                    referencedColumnNames: ["id"],
                    onDelete: "RESTRICT",
                    onUpdate: "CASCADE",
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const table = await queryRunner.getTable("product_situations");

        if (table) {
            for (const foreignKey of table.foreignKeys) {
                await queryRunner.dropForeignKey(
                    "product_situations",
                    foreignKey
                );
            }

            await queryRunner.dropTable("product_situations");
        }
    }
}