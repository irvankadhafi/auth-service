import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSessions1736984315673 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Write your UP migration SQL here
            CREATE TABLE IF NOT EXISTS "sessions" (
                "id" SERIAL PRIMARY KEY,
                "user_id" INTEGER NOT NULL,
                "access_token" VARCHAR(255) UNIQUE NOT NULL,
                "refresh_token" VARCHAR(255) UNIQUE NOT NULL,
                "access_token_expired_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "refresh_token_expired_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "user_agent" VARCHAR(255),
                "latitude" VARCHAR(50),
                "longitude" VARCHAR(50),
                "ip_address" VARCHAR(50),
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("user_id") REFERENCES "users" ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Write your DOWN migration SQL here
            DROP TABLE IF EXISTS "sessions";
        `);
    }
}
