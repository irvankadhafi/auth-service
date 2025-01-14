import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: ['src/domain/entities/**/*.ts'],
    // migrations: ['src/infrastructure/database/migrations/**/*.ts'],
    migrations: ['db/migration/*.sql'], // Path ke file migrasi
    migrationsTableName: 'schema_migrations', // Nama tabel untuk menyimpan status migrasi
});