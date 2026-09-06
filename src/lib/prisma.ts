import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

function sanitizeConnectionString(rawUrl: string): string {
  let url = (rawUrl || '').trim().replace(/^["']|["']$/g, '');
  if (!url) return '';
  try {
    const lastAtIndex = url.lastIndexOf('@');
    const protoIndex = url.indexOf('://');
    if (protoIndex !== -1 && lastAtIndex !== -1 && lastAtIndex > protoIndex + 3) {
      const proto = url.substring(0, protoIndex + 3);
      const auth = url.substring(protoIndex + 3, lastAtIndex);
      const hostAndRest = url.substring(lastAtIndex + 1);
      const colonIndex = auth.indexOf(':');
      if (colonIndex !== -1) {
        const user = auth.substring(0, colonIndex);
        const pass = auth.substring(colonIndex + 1);
        const decodedPass = decodeURIComponent(pass);
        const encodedPass = encodeURIComponent(decodedPass);
        url = `${proto}${user}:${encodedPass}@${hostAndRest}`;
      }
    }
  } catch (e) {
    // Keep original if parsing fails
  }
  return url;
}

const rawUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || '';
const connectionString = sanitizeConnectionString(rawUrl);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
