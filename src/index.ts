// src/index.ts
import 'reflect-metadata';
import { Command } from 'commander';
import { Server } from './console/server';
import { migrateCommand } from './console/migrate';
import { createMigrationCommand } from './console/create-migration';
import { migrateRBACCommand } from './console/migrate-rbac';

const program = new Command();

program
    .name('auth-service')
    .description('Authentication Service CLI')
    .version('1.0.0');

// Add commands
program.addCommand(migrateCommand);
program.addCommand(createMigrationCommand);
program.addCommand(migrateRBACCommand);

// Add server command
program
    .command('serve')
    .description('Start the server')
    .action(async () => {
        const server = new Server();
        await server.start();
    });

program.parse();