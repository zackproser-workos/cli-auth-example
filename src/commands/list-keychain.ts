import { Entry } from '@napi-rs/keyring'
import chalk from 'chalk'
import { logStep } from '../ui/logger.js'

const SERVICE_NAME = 'workos-cli'
const ACCOUNT_NAME = 'default'

export async function listKeychain(): Promise<void> {
  try {
    const entry = new Entry(SERVICE_NAME, ACCOUNT_NAME)
    const stored = await entry.getPassword()

    console.log(chalk.cyan('\n🔐 Keychain Contents:'))
    console.log(chalk.gray('Service:'), SERVICE_NAME)
    console.log(chalk.gray('Account:'), ACCOUNT_NAME)

    if (stored) {
      const data = JSON.parse(stored)
      console.log(chalk.gray('Status:'), chalk.green('Entry found'))
      console.log(chalk.gray('Contents:'), JSON.stringify(data, null, 2))
    } else {
      console.log(chalk.gray('Status:'), chalk.yellow('No entry found'))
    }
  } catch (error) {
    logStep('Failed to access system keychain')
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
} 