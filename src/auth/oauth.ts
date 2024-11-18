import dotenv from 'dotenv';
import chalk from 'chalk';
import boxen from 'boxen';
import { logStep, showSpinner, displaySummary } from '../ui/logger.js';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';
import open from 'open';
import { WorkOS } from '@workos-inc/node';
import { WORKOS_DIR, saveAuthData } from './storage.js';

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
        handleError(error, 'Request error', spinner, server, res, reject);
      });

      if (!req.url?.startsWith('/callback')) {
        console.log('Non-callback request received');
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }

      handleCallback(req, res, spinner, server, resolve, reject);
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

async function handleCallback(
  req: any,
  res: any,
  spinner: any,
  server: any,
  resolve: (value: string) => void,
  reject: (error: Error) => void
) {
  try {
    const url = new URL(req.url, 'http://localhost:3000');
    const code = url.searchParams.get('code');
    console.log('Received callback with code:', code);
    
    if (!code) {
      handleError(new Error('No authorization code received'), 'No code in callback URL', spinner, server, res, reject);
      return;
    }

    logStep('Received authorization code');
    console.log('Code:', code);
    spinner.text = chalk.blue('Processing authentication...');
    
    const authResponse = await workos.userManagement.authenticateWithCode({
      code,
      clientId: process.env.WORKOS_CLIENT_ID || '',
    });
    
    console.log('Authentication response received:', authResponse.accessToken ? 'success' : 'failed');
    
    console.log('About to save token...');
    const storageResult = await saveAuthData({
      accessToken: authResponse.accessToken,
      userId: authResponse.user.id
    });
    console.log('Token saved successfully');
    
    // Send success page response
    const successHtml = readFileSync(join(process.cwd(), 'dist/auth/success.html'), 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(successHtml);
    
    spinner.stop();
    
    displaySuccessMessage(storageResult);
    
    server.close(() => {
      console.log('Server closed successfully');
      resolve(authResponse.accessToken);
    });
  } catch (error) {
    handleError(error, 'Authentication error', spinner, server, res, reject);
  }
}

function handleError(
  error: any,
  message: string,
  spinner: any,
  server: any,
  res: any,
  reject: (error: Error) => void
) {
  console.error(message + ':', error);
  spinner.fail(message);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end(message + ': ' + error.message);
  server.close();
  reject(error);
}

function displaySuccessMessage(storageResult: { tokenPath: string; dirCreated: boolean }) {
  console.log(chalk.green('\n✓ Authentication successful'));
  console.log(chalk.cyan('\nToken Storage Details:'));
  
  if (storageResult.tokenPath === 'system keychain') {
    console.log(chalk.cyan('🔐 Credentials saved to system keychain'));
    console.log(`\n🔍 View stored credentials with:\n   ${chalk.bold('npm start keychain')}\n`);
  } else {
    if (storageResult.dirCreated) {
      console.log(`📁 Created new directory: ${WORKOS_DIR}`);
    }
    console.log(`💾 Token saved to: ${storageResult.tokenPath}`);
    console.log(`\n🔍 View token contents with:\n   ${chalk.bold(`cat ${storageResult.tokenPath}`)}\n`);
  }
}