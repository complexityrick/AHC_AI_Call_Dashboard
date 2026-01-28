
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const search = "Sam";
    console.log(`Searching for '${search}'...`);

    const results = await prisma.call.findMany({
        where: {
            OR: [
                { callerName: { contains: search } },
                { phoneNumber: { contains: search } }
            ]
        }
    });

    console.log(`Found ${results.length} results.`);
    results.forEach(c => console.log(` - ${c.callerName} (${c.phoneNumber})`));

    const searchLower = "sam"; // Case check
    console.log(`Searching for '${searchLower}'...`);

    const resultsLower = await prisma.call.findMany({
        where: {
            OR: [
                { callerName: { contains: searchLower } },
                { phoneNumber: { contains: searchLower } }
            ]
        }
    });
    console.log(`Found ${resultsLower.length} results.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
