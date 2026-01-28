import { prisma } from './src/lib/prisma';

async function main() {
    try {
        console.log('Attempting to connect to database...');
        const callCount = await prisma.call.count();
        console.log('Connection successful!');
        console.log(`Found ${callCount} calls.`);

        // Test creating a call
        console.log('Attempting to create a test call...');
        const testCall = await prisma.call.create({
            data: {
                vapiCallId: `test-${Date.now()}`,
                phoneNumber: '+15555555555',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        console.log('Call created:', testCall.id);

    } catch (error) {
        console.error('DATABASE ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
