
import { TableColumn, type MigrationInterface, type QueryRunner } from "typeorm";

export class AddSlugToProducts1794321080544 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('products', new TableColumn({
            name: "slug",
            type: "varchar",
            isUnique: true,
            isNullable: false,
        }));
        // Ajustar a ordem da coluna
        await queryRunner.query(`ALTER TABLE products MODIFY COLMN slug varchar(255) AFTER name`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "slug");
    }

}
