
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Debugging Content and Search ---');

    console.log('1. Checking recent calls...');
    const recent = await prisma.call.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, callerName: true, phoneNumber: true, createdAt: true }
    });

    console.table(recent);

    if (recent.length > 0) {
        // Pick a name from recent calls if available
        const targetCall = recent.find(c => c.callerName);
        if (targetCall && targetCall.callerName) {
            const name = targetCall.callerName;
            console.log(`\n2. Testing search for existing name: "${name}"`);

            // Replicating API logic
            const search = name;
            const results = await prisma.call.findMany({
                where: {
                    OR: [
                        { callerName: { contains: search, mode: 'insensitive' } },
                        { phoneNumber: { contains: search, mode: 'insensitive' } },
                        { callIntent: { contains: search, mode: 'insensitive' } },
                        { callerType: { contains: search, mode: 'insensitive' } },
                    ]
                }
            });

            console.log(`Found ${results.length} results.`);
            if (results.length === 0) {
                console.error("❌ Search FAILED to find the record!");
            } else {
                console.log("✅ Search successful.");
            }

            // Test partial search
            const partial = name.substring(0, 3);
            console.log(`\n3. Testing partial search: "${partial}"`);
            const partialResults = await prisma.call.findMany({
                where: {
                    OR: [
                        { callerName: { contains: partial, mode: 'insensitive' } },
                        { phoneNumber: { contains: partial, mode: 'insensitive' } },
                        { callIntent: { contains: partial, mode: 'insensitive' } },
                        { callerType: { contains: partial, mode: 'insensitive' } },
                    ]
                }
            });
            console.log(`Found ${partialResults.length} results.`);

        } else {
            console.log("\n⚠️ No calls with callerName found in recent 5 records. Cannot test search by name.");
        }
    } else {
        console.log("No calls in database.");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
