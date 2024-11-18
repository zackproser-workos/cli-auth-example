import { getAuthData } from '../auth/storage.js';
import { WorkOS } from '@workos-inc/node';
import chalk from 'chalk';

export async function getProfile(): Promise<void> {
  try {
    const authData = await getAuthData();
    
    if (!authData) {
      console.log(chalk.yellow('Not authenticated. Please run `npm start login` first.'));
      process.exit(1);
    }

    const workos = new WorkOS(process.env.WORKOS_API_KEY);
    
    // Get user profile using the WorkOS API
    const user = await workos.userManagement.getUser(authData.userId);
    
    // Display user information in a formatted way
    console.log(chalk.bold('\n🧑 User Profile:'));
    console.log(chalk.cyan('Email:'), user.email);
    console.log(chalk.cyan('First Name:'), user.firstName);
    console.log(chalk.cyan('Last Name:'), user.lastName);
    console.log(chalk.cyan('ID:'), user.id);
    console.log(chalk.cyan('Created At:'), new Date(user.createdAt).toLocaleString());
    
    process.exit(0);
  } catch (error) {
    console.error(chalk.red('Failed to fetch profile:'), error);
    process.exit(1);
  }
}