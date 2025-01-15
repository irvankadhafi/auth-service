// src/console/migrate.ts
import { Command } from 'commander';
import { DataSource } from 'typeorm';
import { Logger } from '@/utils/logger';
import { Config } from '@/config';

export const migrateCommand = new Command('migrate')
    .description('Database migration command')
    .option('--step <number>', 'maximum migration steps', '0')
    .option('--direction <string>', 'migration direction (up/down)', 'up')
    .action(async (options) => {
        try {
            const direction = options.direction;
            const step = parseInt(options.step);

            const dataSource = new DataSource({
                type: 'postgres',
                url: Config.DATABASE_URL,
                entities: ['src/domain/entities/*.entity.ts'],
                migrations: ['db/migration/*.ts'],
                migrationsTableName: 'schema_migrations'
            });

            await dataSource.initialize();

            if (direction === 'down') {
                await dataSource.undoLastMigration();
            } else {
                await dataSource.runMigrations();
            }

            Logger.info(`Applied migrations successfully!`);
            process.exit(0);
        } catch (error) {
            Logger.error('Migration failed:', error);
            process.exit(1);
        }
    });