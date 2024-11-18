import { Entry } from '@napi-rs/keyring'
import * as fs from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'
import { logStep } from '../ui/logger.js'
import chalk from 'chalk'

const SERVICE_NAME = 'workos-cli'
const ACCOUNT_NAME = 'default'
export const WORKOS_DIR = process.env.WORKOS_TOKEN_DIR || join(homedir(), '.workos')
const TOKEN_PATH = join(WORKOS_DIR, 'token')

interface AuthData {
  accessToken: string
  userId: string
}

export async function saveAuthData(data: AuthData): Promise<{ tokenPath: string; dirCreated: boolean }> {
  try {
    // Try to store in system keychain first
    const entry = new Entry(SERVICE_NAME, ACCOUNT_NAME)
    await entry.setPassword(JSON.stringify(data))
    logStep('Successfully stored credentials in system keychain')
    return { tokenPath: 'system keychain', dirCreated: false }
  } catch (error) {
    // Fall back to file storage
    console.warn(chalk.yellow('Failed to store credentials in system keychain, falling back to file storage'))
    console.warn(error instanceof Error ? error.message : String(error))
    
    let dirCreated = false
    try {
      await fs.mkdir(WORKOS_DIR, { recursive: true })
      dirCreated = true
    } catch (error: any) {
      if (error.code !== 'EEXIST') {
        throw error
      }
    }

    await fs.writeFile(TOKEN_PATH, JSON.stringify(data), 'utf-8')
    logStep(`Stored credentials in file: ${TOKEN_PATH}`)
    return { tokenPath: TOKEN_PATH, dirCreated }
  }
}

export async function getAuthData(): Promise<AuthData | null> {
  try {
    // Try system keychain first
    const entry = new Entry(SERVICE_NAME, ACCOUNT_NAME)
    const stored = await entry.getPassword()
    if (stored) {
      logStep('Successfully retrieved credentials from system keychain')
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn(chalk.yellow('Failed to retrieve credentials from system keychain, trying file storage'))
    console.warn(error instanceof Error ? error.message : String(error))
  }

  // Fall back to file storage
  try {
    const data = await fs.readFile(TOKEN_PATH, 'utf-8')
    logStep(`Retrieved credentials from file: ${TOKEN_PATH}`)
    return JSON.parse(data)
  } catch (error) {
    logStep('No credentials found in file storage')
    return null
  }
}

// For backward compatibility
export async function getToken(): Promise<string | null> {
  const authData = await getAuthData()
  return authData?.accessToken ?? null
}

export async function deleteAuthData(): Promise<void> {
  try {
    const entry = new Entry(SERVICE_NAME, ACCOUNT_NAME)
    await entry.deletePassword()
    logStep('Successfully deleted credentials from system keychain')
  } catch (error) {
    logStep('Failed to delete credentials from system keychain')
    console.warn(error instanceof Error ? error.message : String(error))
  }
  
  try {
    await fs.unlink(TOKEN_PATH)
    logStep(`Deleted credentials file: ${TOKEN_PATH}`)
  } catch (error) {
    logStep('No credentials file to delete')
  }
} 