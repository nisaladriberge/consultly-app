import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// 1. Create the SQLite Adapter pointing to our local database file
const adapter = new PrismaBetterSqlite3({
  url: 'file:./dev.db',
});

// 2. Pass the adapter straight into the Prisma Client constructor
const prisma = new PrismaClient({ adapter });

export default prisma;