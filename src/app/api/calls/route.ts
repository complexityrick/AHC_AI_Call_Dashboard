import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');

        // Basic search filtering
        const whereClause = search ? {
            OR: [
                { callerName: { contains: search, mode: 'insensitive' as any } },
                { phoneNumber: { contains: search, mode: 'insensitive' as any } },
                { callIntent: { contains: search, mode: 'insensitive' as any } },
                { callerType: { contains: search, mode: 'insensitive' as any } },
                { clinic: { contains: search, mode: 'insensitive' as any } },
                { provider: { contains: search, mode: 'insensitive' as any } },
                { location: { contains: search, mode: 'insensitive' as any } },
                { notes: { contains: search, mode: 'insensitive' as any } },
                { transcriptText: { contains: search, mode: 'insensitive' as any } },
            ]
        } : {};

        const calls = await prisma.call.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(calls);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        const updatedCall = await prisma.call.update({
            where: { id },
            data,
        });

        return NextResponse.json(updatedCall);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
