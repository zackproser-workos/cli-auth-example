import { startOAuthFlow } from '../auth/oauth.js';
import { closeAnimation } from '../ui/animation.js';

export async function login(): Promise<void> {
  try {
    await startOAuthFlow();
    console.log('Successfully authenticated!');
    closeAnimation();
  } catch (error) {
    console.error('Authentication failed:', error);
    closeAnimation();
    process.exit(1);
  }
} 