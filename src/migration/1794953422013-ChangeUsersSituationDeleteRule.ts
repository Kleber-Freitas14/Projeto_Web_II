
import type { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUsersSituationDeleteRule1794953422013 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users
            DROP FOREIGN KEY FK_c62a4ef5764043d37f9eb344420
        `);

        await queryRunner.query(`
            ALTER TABLE users
            ADD CONSTRAINT FK_c62a4ef5764043d37f9eb344420
            FOREIGN KEY (situationId)
            REFERENCES situations(id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users
            DROP FOREIGN KEY FK_c62a4ef5764043d37f9eb344420
        `);

        await queryRunner.query(`
            ALTER TABLE users
            ADD CONSTRAINT FK_c62a4ef5764043d37f9eb344420
            FOREIGN KEY (situationId)
            REFERENCES situations(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        `);
    }
}
