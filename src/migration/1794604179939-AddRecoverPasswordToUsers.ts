
import {
    type MigrationInterface,
    type QueryRunner,
    TableColumn
} from "typeorm";

export class AddRecoverPasswordToUsers1794604179939 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // Verifica se a coluna já existe
        const table = await queryRunner.getTable("users");

        const recoverColumn = table?.findColumnByName("recoverPassword");

        // Adiciona a coluna somente se ela não existir
        if (!recoverColumn) {
            await queryRunner.addColumn(
                "users",
                new TableColumn({
                    name: "recoverPassword",
                    type: "varchar",
                    length: "255",
                    isUnique: true,
                    isNullable: true
                })
            );
        }

        // Ajusta a posição da coluna após email
        await queryRunner.query(
            "ALTER TABLE users MODIFY COLUMN recoverPassword varchar(255) NULL AFTER email"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const table = await queryRunner.getTable("users");

        if (table?.findColumnByName("recoverPassword")) {
            await queryRunner.dropColumn("users", "recoverPassword");
        }
    }
}
