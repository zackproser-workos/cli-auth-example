# OAuth CLI Demo

A professional demonstration of browser-based OAuth authentication flows in command-line applications, powered by WorkOS AuthKit.

## Features

- 🔐 Secure browser-based OAuth authentication
- 💾 Persistent token storage in system keychain
- 🎨 Interactive terminal animations
- 🔒 WorkOS AuthKit integration

## Installation

```bash
# Clone the repository
git clone https://github.com/workos/oauth-cli-demo.git
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
```

## Usage

```bash
# Build the CLI
npm run build

# Run the login command
npm start login
```

The CLI will:
1. Launch your default browser for authentication
2. Start a local server to capture the OAuth callback
3. Securely store the access token in your system keychain
4. Display a real-time animation of the authentication progress

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
