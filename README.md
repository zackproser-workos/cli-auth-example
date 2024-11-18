# OAuth CLI Demo

[![Tests](https://github.com/zackproser-workos/cli-auth-example/actions/workflows/test.yml/badge.svg)](https://github.com/zackproser-workos/cli-auth-example/actions/workflows/test.yml)

A runnable demo of browser-based OAuth authentication flows in command-line applications, powered by [WorkOS](https://workos.com) [AuthKit](https://authkit.com).

![CLI browser-based auth demo](./img/command-line-auth.webp)

## Features

- 🔐 Secure browser-based OAuth authentication
- 🔒 WorkOS AuthKit integration
- 💾 Persistent token storage in system keychain
- 🎨 Stylized authentication successful page 

![authentication successful page](./img/auth-successful.webp)

## Usage 

### Step 1. Authenticate with WorkOS:

Running `npm start login` will start the authentication flow:

```console
   ╭───────────────────────────────╮
   │                               │
   │   WorkOS CLI Authentication   │
   │                               │
   ╰───────────────────────────────╯

⠋ Starting authentication flow...
→ Local server started
→ Opening browser for authentication
⠋ Waiting for authentication...
→ Received authorization code
⠼ Processing authentication...

About to save token...
→ Successfully stored credentials in system keychain
Token saved successfully

Token Storage Details:
🔐 Credentials saved to system keychain

🔍 View stored credentials with:
   npm start keychain
```

This will:
1. Start a local server
2. Open your browser for WorkOS authentication
3. Process the authentication response
4. Save your access token locally

### Step 2. Fetch a secure resource using your access token:

Following successful authentication, you can fetch a secure resource using your stored access token:

```bash
npm start me
```

Example output:

```
🧑 User Profile:
Email: booker@example.com
First Name: Booker
Last Name: DeWitt
ID: user_02JCQ1E9ZV4JQXNCT0TD4V7DJ3
Created At: 11/14/2024, 11:30:56 PM
```

This demonstrates:
1. The OAuth authentication flow with WorkOS AuthKit
2. Secure token storage in your system keychain
3. Using the stored credentials to make authenticated API calls

### Step 3. Inspect Stored Credentials

View the contents of your stored credentials:

```bash
npm start keychain
```

Example output:
```
🔐 Keychain Contents:
Service: workos-cli
Account: default
Status: Entry found
Contents: {
  "accessToken": "eyJhbGc...X_YphjyXXXXX",
  "userId": "user_02XXXXXXXXXXXXX"
}
```

### Credential Storage Strategy

The CLI implements a secure, multi-tiered storage strategy for authentication credentials:

1. **System Keychain (Primary)**: 
   - First attempts to store credentials in the system's native keychain
   - Uses `@napi-rs/keyring` for cross-platform keychain access
   - macOS: Keychain Access
   - Windows: Credential Manager
   - Linux: libsecret/Secret Service API

2. **Encrypted File Fallback**:
   - If keychain access fails, falls back to encrypted file storage
   - Files are encrypted using industry-standard AES-256-GCM
   - Encryption key is derived from machine-specific factors
   - Similar to GitHub CLI's credential storage approach

This approach mirrors the GitHub CLI (`gh`) implementation, which is considered an industry best practice for CLI tools. The multi-tiered strategy ensures:

- Maximum security by preferring system keychains
- Broad compatibility across different environments
- Graceful fallback when keychain access is unavailable
- Zero configuration required from users

## Installation

```bash
# Clone the repository
git clone https://github.com/zackproser-workos/cli-auth-example.git
cd oauth-cli-demo
# Install dependencies
npm install
# Set environment variables
cp .env.example .env.local
```

## Configuration

Add your WorkOS credentials to `.env.local`:

```plaintext
WORKOS_CLIENT_ID=client_xxxxxxxxxxxx
WORKOS_API_KEY=sk_xxxxxxxxxxxx
# Optional: Set a custom token directory or leave unset to use default: ~/.workos
WORKOS_TOKEN_DIR=/path/to/token/directory
```



## Development

```bash
# Run in development mode
npm run dev

# Build the project
npm run build

# Run the built version
npm start
```

## How It Works

This CLI demonstrates the common pattern used by tools like GitHub's CLI (`gh`) for authentication:

1. The CLI initiates an OAuth flow by starting a local server
2. It launches the user's browser to the WorkOS AuthKit authentication page
3. After successful authentication, WorkOS redirects to the local server
4. The CLI exchanges the authorization code for an access token
5. The token is securely stored in the system keychain for future use

## Security

- OAuth tokens are stored securely using system keychain integration
- Environment variables are strictly validated
- Local server only accepts connections from localhost
- HTTPS is used for all OAuth token exchanges

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## WorkOS CLI OAuth Demo

## Configuration

The CLI can be configured using environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| WORKOS_API_KEY | Yes | - | Your WorkOS API Key |
| WORKOS_CLIENT_ID | Yes | - | Your WorkOS Client ID |
| WORKOS_TOKEN_DIR | No | ~/.workos | Directory where the authentication token will be stored |

## Token Storage

By default, the CLI stores the authentication token in `~/.workos/token`. You can customize this location by setting the `WORKOS_TOKEN_DIR` environment variable.

### Custom Token Directory

To use a custom directory for token storage:

```bash
export WORKOS_TOKEN_DIR=/custom/path/to/token/directory
```

## Testing

The project includes a comprehensive test suite using Jest. You can run tests using the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

Test files are located in `src/__tests__/` and follow the naming convention `*.test.ts`. The suite includes tests for:
- OAuth authentication flow
- Token storage and retrieval
- Environment variable validation
- UI components


