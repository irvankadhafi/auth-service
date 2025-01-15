import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1736984296392 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Write your UP migration SQL here
            CREATE TABLE IF NOT EXISTS "users" (
                "id" SERIAL PRIMARY KEY,
                "email" VARCHAR(255) UNIQUE NOT NULL,
                "password" VARCHAR(255) NOT NULL,
                "role" VARCHAR(50) NOT NULL,
                "is_active" BOOLEAN DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
