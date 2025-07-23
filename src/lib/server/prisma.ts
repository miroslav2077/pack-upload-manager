import { PrismaClient } from '$lib/../generated/prisma/client';

const DATABASE_URL = process.env.DATABASE_URL;

const prisma = new PrismaClient({
	datasourceUrl: DATABASE_URL
});

export default prisma;