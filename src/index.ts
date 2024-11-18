import { config } from 'dotenv';
import { Command } from 'commander';
import { login } from './commands/login.js';
import { getProfile } from './commands/profile.js';
import { listKeychain } from './commands/list-keychain.js';
import { validateEnv } from './utils/env.js';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Validate environment variables before proceeding
validateEnv();

const program = new Command();

program
  .name('oauth-demo')
  .description('CLI demo showing browser-based OAuth flow')
  .version('1.0.0');

program
  .command('login')
  .description('Login using OAuth')
  .action(login);

program
  .command('me')
  .description('Get authenticated user profile')
  .action(getProfile);

program
  .command('keychain')
  .description('List contents of the keychain entry')
  .action(listKeychain);

program.parse(); 