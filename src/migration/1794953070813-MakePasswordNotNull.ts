
import type { MigrationInterface, QueryRunner } from "typeorm";

export class MakePasswordNotNull1794953070813 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users
            MODIFY COLUMN password VARCHAR(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users
            MODIFY COLUMN password VARCHAR(255) NULL
        `);
    }
}
