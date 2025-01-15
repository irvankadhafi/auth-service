// src/console/create-migration.ts
import { Command } from 'commander';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Logger } from '@/utils/logger';

export const createMigrationCommand = new Command('create:migration')
    .description('Create a new migration file')
    .argument('<name>', 'migration name')
    .action((name: string) => {
        try {
            // Generate timestamp
            const timestamp = Date.now();

            // Convert name to PascalCase
            const className = name
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join('');

            const migrationContent = `import { MigrationInterface, QueryRunner } from "typeorm";

export class ${className}${timestamp} implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(\`
            -- Write your UP migration SQL here
        \`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(\`
            -- Write your DOWN migration SQL here
        \`);
    }
}
`;

            const migrationsDir = join(process.cwd(), 'db', 'migrations');
            mkdirSync(migrationsDir, { recursive: true });

            const fileName = `${timestamp}-${name}.ts`;
            const filePath = join(migrationsDir, fileName);

            writeFileSync(filePath, migrationContent);
            Logger.info(`Created migration file: ${fileName}`);

            // Tambahkan instruksi untuk pengguna
            Logger.info('\nNext steps:');
            Logger.info('1. Open the generated migration file');
            Logger.info('2. Replace the SQL placeholders with your actual migration SQL');
            Logger.info('3. Run the migration with: npm run migrate');
        } catch (error) {
            Logger.error('Failed to create migration:', error);
            process.exit(1);
        }
    });