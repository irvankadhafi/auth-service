import { DataSourceOptions } from 'typeorm';
import { Config } from './index';

export const databaseConfig: DataSourceOptions = {
    type: 'postgres',
    url: Config.DATABASE_URL,
    entities: ['src/domain/entities/*.entity.ts'],
    migrations: ['db/migrations/*.ts'],
    migrationsTableName: 'schema_migrations',
    synchronize: false,
    logging: true
};