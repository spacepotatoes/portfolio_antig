import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

function createPrismaClient() {
    // Turso (Vercel Production)
    if (process.env.TURSO_DATABASE_URL) {
        const { createClient } = require('@libsql/client')
        const { PrismaLibSQL } = require('@prisma/adapter-libsql')

        const libsql = createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        })
        const adapter = new PrismaLibSQL(libsql)
        return new PrismaClient({ adapter } as any)
    }

    // Local SQLite (Development)
    return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
