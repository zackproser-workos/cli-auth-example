import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

// Default directory and path
export const WORKOS_DIR = process.env.WORKOS_TOKEN_DIR || join(homedir(), '.workos');
const TOKEN_PATH = join(WORKOS_DIR, 'token');

interface AuthData {
  accessToken: string;
  userId: string;
}

export async function saveAuthData(data: AuthData): Promise<{ tokenPath: string; dirCreated: boolean }> {
  try {
    let dirCreated = false;
    
    try {
      await mkdir(WORKOS_DIR, { recursive: true });
      dirCreated = true;
    } catch (error: any) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
    
    // Save the auth data as JSON
    await writeFile(TOKEN_PATH, JSON.stringify(data), 'utf-8');
    return { tokenPath: TOKEN_PATH, dirCreated };
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw error;
  }
}

export async function getAuthData(): Promise<AuthData | null> {
  try {
    const data = await readFile(TOKEN_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
} 