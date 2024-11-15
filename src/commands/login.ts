import { startOAuthFlow } from '../auth/oauth.js';

export async function login(): Promise<void> {
  try {
    await startOAuthFlow();
    process.exit(0);
  } catch (error) {
    console.error('Authentication failed:', error);
    process.exit(1);
  }
} 