import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { mkdir, writeFile, readFile, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('Token Storage', () => {
  const mockAuthData = {
    accessToken: 'test-token-123',
    userId: 'user_123'
  };
  
  // Create a unique test directory for each run
  const testDir = join(tmpdir(), `test-workos-${Date.now()}`);
  
  beforeEach(() => {
    process.env.WORKOS_TOKEN_DIR = testDir;
  });

  afterEach(async () => {
    // Clean up test directory after each test
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch (err) {
      // Ignore cleanup errors
    }
  });

  test('saves and retrieves auth data', async () => {
    const { saveAuthData, getAuthData } = await import('../../auth/storage.js');
    
    // Save the data
    await saveAuthData(mockAuthData);
    
    // Read it back
    const data = await getAuthData();
    
    // Verify it matches
    expect(data).toEqual(mockAuthData);
  });
}); 