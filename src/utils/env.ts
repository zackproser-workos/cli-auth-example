export function validateEnv() {
  const required = ['WORKOS_CLIENT_ID', 'WORKOS_API_KEY'];
  
  for (const var_name of required) {
    if (!process.env[var_name]) {
      throw new Error(
        `Missing required environment variable: ${var_name}\n` +
        'Please copy .env.example to .env.local and fill in the required values.'
      );
    }
  }
} 