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
                migrations: ['db/migrations/*.ts'],
                migrationsTableName: 'schema_migrations'
            });

            await dataSource.initialize();
            Logger.info('Database connected');

            if (direction === 'down') {
                if (step > 0) {
                    Logger.info(`Rolling back ${step} migration(s)...`);
                    for (let i = 0; i < step; i++) {
                        await dataSource.undoLastMigration();
                    }
                } else {
                    Logger.info('Rolling back last migration...');
                    await dataSource.undoLastMigration();
                }
            } else {
                Logger.info('Running pending migrations...');
                await dataSource.runMigrations();
            }

            Logger.info('Migrations completed successfully!');
            await dataSource.destroy();
            process.exit(0);
        } catch (error) {
            Logger.error('Migration failed:', error);
            process.exit(1);
        }
    });