import 'reflect-metadata';
import { Command } from 'commander';
import { Server } from './console/server';
import { migrateCommand } from './console/migrate';

const program = new Command();

program
    .name('auth-service')
    .description('Authentication Service CLI')
    .version('1.0.0');

// Add migrate command
program.addCommand(migrateCommand);

// Add server command
program
    .command('serve')
    .description('Start the server')
    .action(async () => {
        const server = new Server();
        await server.start();
    });

program.parse();