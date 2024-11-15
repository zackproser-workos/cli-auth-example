import { createServer } from 'http';
import open from 'open';
import { WorkOS } from '@workos-inc/node';
import { config } from 'dotenv';
import { saveToken } from './storage.js';
import { updateAuthStatus } from '../ui/animation.js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

const REDIRECT_URI = 'http://localhost:3000/callback';

export async function startOAuthFlow(): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      if (req.url?.startsWith('/callback')) {
        const code = new URL(req.url, 'http://localhost:3000').searchParams.get('code');
        
        if (code) {
          updateAuthStatus('Received authorization code');
          
          try {
            const { user } = await workos.userManagement.authenticateWithCode({
              code,
              clientId: process.env.WORKOS_CLIENT_ID || '',
            });
            
            // For demo purposes, we'll use the user ID as the token
            const token = user.id;
            
            // Save token securely
            await saveToken(token);
            
            updateAuthStatus('Authentication successful');
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h1>Authentication successful! You can close this window.</h1>');
            
            server.close();
            resolve(token);
          } catch (error) {
            reject(error);
          }
        }
      }
    });

    server.listen(3000, async () => {
      const authorizationUrl = workos.userManagement.getAuthorizationUrl({
        provider: 'authkit',
        redirectUri: REDIRECT_URI,
        clientId: process.env.WORKOS_CLIENT_ID || '',
      });

      updateAuthStatus('Opening browser for authentication...');
      open(authorizationUrl);
    });
  });
} 