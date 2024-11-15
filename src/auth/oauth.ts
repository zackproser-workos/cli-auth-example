import dotenv from 'dotenv';
import chalk from 'chalk';
import boxen from 'boxen';
import { logStep, showSpinner, displaySummary } from '../ui/logger.js';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';
import open from 'open';
import { WorkOS } from '@workos-inc/node';
import { WORKOS_DIR, saveToken } from './storage.js';

dotenv.config({ path: '.env.local' });

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
    clientId: process.env.WORKOS_CLIENT_ID,
});

const REDIRECT_URI = 'http://localhost:3000/callback';

export async function startOAuthFlow(): Promise<string> {
  console.log(boxen(chalk.bold('WorkOS CLI Authentication'), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'blue',
    textAlignment: 'center'
  }));

  const spinner = showSpinner(chalk.blue('Starting authentication flow...'));
  
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      console.log('Received request:', req.method, req.url);

      req.on('error', (error) => {
        console.error('Request error:', error);
        reject(error);
      });

      if (req.url?.startsWith('/callback')) {
        try {
          const url = new URL(req.url, 'http://localhost:3000');
          const code = url.searchParams.get('code');
          console.log('Received callback with code:', code);
          
          if (!code) {
            console.error('No code in callback URL');
            spinner.fail('No authorization code received');
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('No authorization code received');
            server.close();
            reject(new Error('No authorization code received'));
            return;
          }

          logStep('Received authorization code');
          console.log('Code:', code);
          spinner.text = chalk.blue('Processing authentication...');
          
          try {
            console.log('Attempting to authenticate with code...');
            const { accessToken } = await workos.userManagement.authenticateWithCode({
              code,
              clientId: process.env.WORKOS_CLIENT_ID || '',
            });
            
            console.log('Authentication response received:', accessToken ? 'success' : 'failed');
            
            console.log('About to save token...');
            const { tokenPath, dirCreated } = await saveToken(accessToken);
            console.log('Token saved successfully');
            
            // Send success page response
            const successHtml = readFileSync(join(process.cwd(), 'dist/auth/success.html'), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(successHtml);
            
            spinner.stop();
            
            console.log(chalk.green('\n✓ Authentication successful'));
            console.log(chalk.cyan('\nToken Storage Details:'));
            console.log(`${dirCreated ? '📁 Created new' : '📂 Using existing'} directory: ${WORKOS_DIR}`);
            console.log(`💾 Token saved to: ${tokenPath}`);
            console.log(`\n🔍 View token contents with:\n   ${chalk.bold(`cat ~/.workos/token`)}\n`);
            
            server.close(() => {
              console.log('Server closed successfully');
              resolve(accessToken);
            });
          } catch (error) {
            console.error('Authentication error:', error);
            spinner.fail('Authentication failed');
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Authentication failed: ' + (error as Error).message);
            server.close();
            reject(error);
          }
        } catch (error) {
          console.error('Callback processing error:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Server error');
          server.close();
          reject(error);
        }
      } else {
        console.log('Non-callback request received');
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
      }
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
      spinner.fail('Server error occurred');
      reject(error);
    });

    server.listen(3000, async () => {
      logStep('Local server started');
      
      try {
        const authorizationUrl = workos.userManagement.getAuthorizationUrl({
          provider: 'authkit',
          redirectUri: REDIRECT_URI,
          clientId: process.env.WORKOS_CLIENT_ID || '',
        });

        logStep('Opening browser for authentication');
        spinner.text = chalk.blue('Waiting for authentication...');
        await open(authorizationUrl);
      } catch (error) {
        spinner.fail(chalk.red('Failed to start OAuth flow'));
        server.close();
        reject(error);
      }
    });
  });
} 