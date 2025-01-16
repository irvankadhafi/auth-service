import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRbac1736984319024 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Write your UP migration SQL here
            CREATE TABLE IF NOT EXISTS "resources" (
                "id" TEXT PRIMARY KEY
            );
            
            CREATE TABLE IF NOT EXISTS "actions" (
                "id" TEXT PRIMARY KEY
            );
            
            CREATE TABLE IF NOT EXISTS "role_resource_actions" (
                "role" user_role NOT NULL,
                "resource" TEXT NOT NULL REFERENCES "resources"(id),
                "action" TEXT NOT NULL REFERENCES "actions"(id)
            );
            
            CREATE UNIQUE INDEX rra_unique_idx ON "role_resource_actions"("role", "resource", "action");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Write your DOWN migration SQL here
            DROP TABLE IF EXISTS "role_resource_actions";
            DROP TABLE IF EXISTS "actions";
            DROP TABLE IF EXISTS "resources";
            DROP TYPE IF EXISTS action_type;
            DROP TYPE IF EXISTS resource_type;
            DROP TYPE IF EXISTS user_role;
        `);
    }
}
