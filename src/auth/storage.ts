import keytar from 'keytar';

const SERVICE_NAME = 'oauth-cli-demo';
const ACCOUNT_NAME = 'default';

export async function saveToken(token: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, token);
}

export async function getToken(): Promise<string | null> {
  return keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
} 