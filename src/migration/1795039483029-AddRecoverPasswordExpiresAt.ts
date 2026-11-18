
import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddRecoverPasswordExpiresAt1795039483029
  implements MigrationInterface
{
  name = "AddRecoverPasswordExpiresAt1795039483029";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN recoverPasswordExpiresAt TIMESTAMP NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN recoverPasswordExpiresAt
    `);
  }
}
