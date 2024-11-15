describe('Environment Validation', () => {
    const OLD_ENV = process.env;
  
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
    });
  
    afterAll(() => {
      process.env = OLD_ENV;
    });
  
    test('validates required environment variables', async () => {
      process.env.WORKOS_CLIENT_ID = 'test-client-id';
      process.env.WORKOS_API_KEY = 'test-api-key';
  
      const { validateEnv } = await import('../../utils/env.js');
      expect(() => validateEnv()).not.toThrow();
    });
  
    test('throws error when missing required variables', async () => {
      delete process.env.WORKOS_CLIENT_ID;
      delete process.env.WORKOS_API_KEY;
  
      const { validateEnv } = await import('../../utils/env.js');
      expect(() => validateEnv()).toThrow(/Missing required environment variable/);
    });
  });