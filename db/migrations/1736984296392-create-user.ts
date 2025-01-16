import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1736984296392 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Write your UP migration SQL here
            CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE');
            
            CREATE TABLE IF NOT EXISTS "users" (
                "id" SERIAL PRIMARY KEY,
                "email" VARCHAR(255) UNIQUE NOT NULL,
                "password" VARCHAR(255) NOT NULL,
                "role" user_role NOT NULL,
                "created_at" timestamp NOT NULL DEFAULT 'now()',
                "updated_at" timestamp NOT NULL DEFAULT 'now()',
                "deleted_at" timestamp
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Write your DOWN migration SQL here
            DROP TABLE IF EXISTS "users";
        `);
    }
}
