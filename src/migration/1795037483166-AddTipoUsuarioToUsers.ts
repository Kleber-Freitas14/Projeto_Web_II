
import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddTipoUsuarioToUsers1795037483166
  implements MigrationInterface
{
  name = "AddTipoUsuarioToUsers1795037483166";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN tipoUsuario ENUM('ADMIN', 'USER')
      NOT NULL DEFAULT 'USER'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN tipoUsuario
    `);
  }
}
