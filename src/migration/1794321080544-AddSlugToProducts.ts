
import { TableColumn, type MigrationInterface, type QueryRunner } from "typeorm";

export class AddSlugToProducts1794321080544 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // Verifica se a tabela products possui a coluna slug
        const table = await queryRunner.getTable("products");

        const slugColumn = table?.findColumnByName("slug");

        // Se não existir, cria a coluna
        if (!slugColumn) {
            await queryRunner.addColumn(
                "products",
                new TableColumn({
                    name: "slug",
                    type: "varchar",
                    length: "255",
                    isUnique: true,
                    isNullable: true,
                })
            );
        }

        // Ajusta a posição da coluna
        await queryRunner.query(
            "ALTER TABLE products MODIFY COLUMN slug varchar(255) NULL AFTER nameProduct"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const table = await queryRunner.getTable("products");

        if (table?.findColumnByName("slug")) {
            await queryRunner.dropColumn("products", "slug");
        }
    }
}
