
import {
    Table,
    TableForeignKey,
    type MigrationInterface,
    type QueryRunner,
} from "typeorm";

export class RebuildProductTables1794872351046
    implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query("SET FOREIGN_KEY_CHECKS = 0");

        try {

            // 1. Remover as tabelas antigas
            await queryRunner.dropTable("product_situations", true, true, true);
            await queryRunner.dropTable("products", true, true, true);
            await queryRunner.dropTable("product_categories", true, true, true);

            // 2. Criar tabela de categorias
            await queryRunner.createTable(
                new Table({
                    name: "product_categories",
                    columns: [
                        {
                            name: "id",
                            type: "int",
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: "increment",
                        },
                        {
                            name: "name",
                            type: "varchar",
                            length: "255",
                            isNullable: false,
                        },
                        {
                            name: "createdAt",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                        {
                            name: "updatedAt",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                            onUpdate: "CURRENT_TIMESTAMP",
                        },
                    ],
                })
            );

            // 3. Criar tabela de situações dos produtos
            await queryRunner.createTable(
                new Table({
                    name: "product_situations",
                    columns: [
                        {
                            name: "id",
                            type: "int",
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: "increment",
                        },
                        {
                            name: "name",
                            type: "varchar",
                            length: "255",
                            isNullable: false,
                        },
                        {
                            name: "createdAt",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                        {
                            name: "updatedAt",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                            onUpdate: "CURRENT_TIMESTAMP",
                        },
                    ],
                })
            );

            // 4. Criar tabela de produtos
            await queryRunner.createTable(
                new Table({
                    name: "products",
                    columns: [
                        {
                            name: "id",
                            type: "int",
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: "increment",
                        },
                        {
                            name: "name",
                            type: "varchar",
                            length: "255",
                            isNullable: false,
                        },
                        {
                            name: "slug",
                            type: "varchar",
                            length: "255",
                            isUnique: true,
                            isNullable: false,
                        },
                        {
                            name: "description",
                            type: "longtext",
                            isNullable: false,
                        },
                        {
                            name: "price",
                            type: "decimal",
                            precision: 10,
                            scale: 2,
                            isNullable: false,
                        },
                        {
                            name: "productCategoryId",
                            type: "int",
                            isNullable: false,
                        },
                        {
                            name: "productSituationId",
                            type: "int",
                            isNullable: false,
                        },
                        {
                            name: "createdAt",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                        {
                            name: "updatedAt",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                            onUpdate: "CURRENT_TIMESTAMP",
                        },
                    ],
                })
            );

            // 5. Chave estrangeira da categoria
            await queryRunner.createForeignKey(
                "products",
                new TableForeignKey({
                    columnNames: ["productCategoryId"],
                    referencedTableName: "product_categories",
                    referencedColumnNames: ["id"],
                    onDelete: "RESTRICT",
                    onUpdate: "CASCADE",
                })
            );

            // 6. Chave estrangeira da situação do produto
            await queryRunner.createForeignKey(
                "products",
                new TableForeignKey({
                    columnNames: ["productSituationId"],
                    referencedTableName: "product_situations",
                    referencedColumnNames: ["id"],
                    onDelete: "RESTRICT",
                    onUpdate: "CASCADE",
                })
            );

        } finally {
            await queryRunner.query("SET FOREIGN_KEY_CHECKS = 1");
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query("SET FOREIGN_KEY_CHECKS = 0");

        try {
            await queryRunner.dropTable("products", true, true, true);
            await queryRunner.dropTable("product_situations", true, true, true);
            await queryRunner.dropTable("product_categories", true, true, true);

        } finally {
            await queryRunner.query("SET FOREIGN_KEY_CHECKS = 1");
        }
    }
}
