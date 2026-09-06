const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

let connectionString = (process.env.DIRECT_URL || process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '').trim();
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  try {
    const students = await prisma.student.findMany();
    console.log('Students in database:', students.length);
    students.forEach(s => console.log(`- ${s.name} (${s.email}, ID: ${s.studentId})`));
  } catch (err) {
    console.error('Query error:', err);
  } finally {
    await pool.end();
  }
}

run();
