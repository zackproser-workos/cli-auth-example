import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

// Default directory and path
export const WORKOS_DIR = process.env.WORKOS_TOKEN_DIR || join(homedir(), '.workos');
const TOKEN_PATH = join(WORKOS_DIR, 'token');

export async function saveToken(token: string): Promise<{ tokenPath: string; dirCreated: boolean }> {
  try {
    let dirCreated = false;
    
    // Check if directory exists before creating it
    try {
      await mkdir(WORKOS_DIR, { recursive: true });
      dirCreated = true;
    } catch (error: any) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
    
    // Save the token
    await writeFile(TOKEN_PATH, token, 'utf-8');
    return { tokenPath: TOKEN_PATH, dirCreated };
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
}

export async function getToken(): Promise<string | null> {
  try {
    const token = await readFile(TOKEN_PATH, 'utf-8');
    return token;
  } catch (error) {
    // If file doesn't exist or other error, return null
    return null;
  }
} 