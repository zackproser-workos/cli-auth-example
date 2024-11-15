import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

jest.mock('fs/promises');

describe('Token Storage', () => {
  const mockToken = 'test-token-123';
  const testDir = join(tmpdir(), 'test-workos');
  
  beforeEach(() => {
    process.env.WORKOS_TOKEN_DIR = testDir;
    jest.clearAllMocks();
  });

  test('saves token successfully', async () => {
    (mkdir as jest.Mock).mockResolvedValue(undefined);
    (writeFile as jest.Mock).mockResolvedValue(undefined);

    const { saveToken } = await import('../../auth/storage.js');
    const result = await saveToken(mockToken);

    expect(result.dirCreated).toBe(true);
    expect(mkdir).toHaveBeenCalledWith(testDir, { recursive: true });
    expect(writeFile).toHaveBeenCalledWith(
      join(testDir, 'token'),
      mockToken,
      'utf-8'
    );
  });

  test('retrieves token successfully', async () => {
    (readFile as jest.Mock).mockResolvedValue(mockToken);

    const { getToken } = await import('../../auth/storage.js');
    const token = await getToken();

    expect(token).toBe(mockToken);
    expect(readFile).toHaveBeenCalled();
  });
});