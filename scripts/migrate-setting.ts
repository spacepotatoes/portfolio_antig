import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load .env manually
const envPath = join(process.cwd(), '.env')
const envContent = readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '')
        process.env[key] = value
    }
}

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function run() {
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'")
    console.log('Existing tables:', tables.rows.map(r => r[0]))

    await client.execute(`
        CREATE TABLE IF NOT EXISTS "Setting" (
            "key" TEXT PRIMARY KEY NOT NULL,
            "value" TEXT NOT NULL,
            "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `)
    console.log('✓ Setting table created (or already existed)')

    const verify = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Setting'")
    console.log('Verified:', verify.rows)
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
