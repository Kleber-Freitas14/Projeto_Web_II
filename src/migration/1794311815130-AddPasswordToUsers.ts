
import type { MigrationInterface, QueryRunner } from "typeorm";
import { TableColumn } from "typeorm";

export class AddPasswordToUsers1794311815130 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        const colunaExiste = await queryRunner.hasColumn("users", "password");

        if (!colunaExiste) {
            await queryRunner.addColumn("users", new TableColumn({
                name: "password",
                type: "varchar",
                length: "255",
                isNullable: true,
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const colunaExiste = await queryRunner.hasColumn("users", "password");

        if (colunaExiste) {
            await queryRunner.dropColumn("users", "password");
        }
    }
}
