// src/database/SqlMigrationLoader.ts
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

export function createSqlMigrationClass(filename: string): new () => MigrationInterface {
    // Extract timestamp and name from filename (format: YYYYMMDDHHMMSS-name.sql)
    const [timestamp, ...nameParts] = filename.replace('.sql', '').split('-');
    const migrationName = nameParts.join('-');

    // Convert the timestamp (YYYYMMDDHHMMSS) to JavaScript timestamp (milliseconds)
    const year = parseInt(timestamp.slice(0, 4));
    const month = parseInt(timestamp.slice(4, 6)) - 1; // Month is 0-based in JS
    const day = parseInt(timestamp.slice(6, 8));
    const hour = parseInt(timestamp.slice(8, 10));
    const minute = parseInt(timestamp.slice(10, 12));
    const second = parseInt(timestamp.slice(12, 14));
    const jsTimestamp = new Date(year, month, day, hour, minute, second).getTime();

    const migrationContent = readFileSync(
        join(__dirname, '../../db/migration', filename),
        'utf8'
    );

    const [upQuery, downQuery] = migrationContent.split('-- +migrate Down');
    const up = upQuery.replace('-- +migrate Up', '').trim();
    const down = downQuery ? downQuery.trim() : '';

    const MigrationClass = class implements MigrationInterface {
        public name = `${jsTimestamp}-${migrationName}`;

        public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(up);
        }

        public async down(queryRunner: QueryRunner): Promise<void> {
            if (down) {
                await queryRunner.query(down);
            }
        }
    };

    // Set the name property of the class itself
    Object.defineProperty(MigrationClass, 'name', { value: `${jsTimestamp}-${migrationName}` });

    return MigrationClass;
}

export function loadSqlMigrations(): Function[] {
    const migrationsPath = join(__dirname, '../../db/migration');
    const files = readdirSync(migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort();

    return files.map(filename => createSqlMigrationClass(filename));
}