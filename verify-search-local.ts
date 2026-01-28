
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying search functionality...');

    // 1. Create a dummy call with a specific name mixed case
    const uniqueId = `test-${Date.now()}`;
    const testName = "Arthur Dent";

    const created = await prisma.call.create({
        data: {
            vapiCallId: uniqueId,
            phoneNumber: "+1555424242",
            callerName: testName,
            callIntent: "Finding tea",
        }
    });

    console.log(`Created call with id: ${created.id} and name: ${created.callerName}`);

    // 2. Search exact match
    const searchExact = "Arthur Dent";
    const resultsExact = await prisma.call.findMany({
        where: {
            OR: [
                { callerName: { contains: searchExact } },
                { phoneNumber: { contains: searchExact } },
            ]
        }
    });
    console.log(`Search exact '${searchExact}': Found ${resultsExact.length}`);

    // 3. Search lowercase match (simulating user input)
    const searchLower = "arthur";
    const resultsLower = await prisma.call.findMany({
        where: {
            OR: [
                { callerName: { contains: searchLower } }, // Default behavior
                { phoneNumber: { contains: searchLower } },
            ]
        }
    });
    console.log(`Search lower '${searchLower}': Found ${resultsLower.length}`);

    // 4. Search with mode: insensitive (Proposed fix)
    const resultsInsensitive = await prisma.call.findMany({
        where: {
            OR: [
                { callerName: { contains: searchLower, mode: 'insensitive' } },
                { phoneNumber: { contains: searchLower, mode: 'insensitive' } },
            ]
        }
    });
    console.log(`Search insensitive '${searchLower}': Found ${resultsInsensitive.length}`);

    // Cleanup
    await prisma.call.delete({ where: { id: created.id } });
    console.log('Cleanup done.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
