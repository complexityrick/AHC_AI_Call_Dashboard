import { prisma } from './src/lib/prisma';

async function main() {
    console.log('--- Checking Database Content ---');
    const count = await prisma.call.count();
    console.log(`Total Calls in DB: ${count}`);

    const recent = await prisma.call.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });

    console.log('\n--- Recent 5 Calls ---');
    if (recent.length === 0) {
        console.log("No calls found.");
    } else {
        recent.forEach(c => {
            console.log(`[${c.createdAt.toISOString()}] ID: ${c.vapiCallId} | Name: ${c.callerName} | Phone: ${c.phoneNumber}`);
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
