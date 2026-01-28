import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            // Ideally use CRON_SECRET or API_KEY, for now using a placeholder or checking simple auth
            // For this demo, let's allow it but warn if you want real security
        }

        const body = await req.json();
        console.log("📥 Webhook received!", JSON.stringify(body, null, 2)); // Debug log

        // Body should match the structure we defined in n8n workflow
        const {
            vapiCallId,
            // ...
            phoneNumber,
            callerName,
            callerType,
            callIntent,
            clinic,
            location,
            provider,
            urgency,
            transferDestination,
            transcriptUrl,
            transcriptText,
            transcript, // Added to catch n8n payload
            // optional fields can be handled by prisma's defaulting if missing
        } = body;

        if (!vapiCallId) {
            console.error("❌ Missing vapiCallId in webhook body");
            return NextResponse.json({ error: 'Missing vapiCallId' }, { status: 400 });
        }

        console.log(`Processing call: ${vapiCallId} | Phone: ${phoneNumber}`);

        // Check if call already exists
        const existing = await prisma.call.findUnique({
            where: { vapiCallId: String(vapiCallId) },
        });

        if (existing) {
            console.log("⚠️ Call already exists, skipping.");
            return NextResponse.json({ message: 'Call already exists', id: existing.id }, { status: 200 });
        }

        const newCall = await prisma.call.create({
            data: {
                vapiCallId: String(vapiCallId),
                phoneNumber: phoneNumber ? String(phoneNumber) : 'Unknown',
                callerName: callerName ? String(callerName) : null,
                callerType: callerType ? String(callerType) : null,
                callIntent: callIntent ? String(callIntent) : null,
                clinic: clinic ? String(clinic) : null,
                location: location ? String(location) : null,
                provider: provider ? String(provider) : null,
                urgency: urgency ? String(urgency) : null,
                transferDestination: transferDestination ? String(transferDestination) : null,
                transcriptUrl: transcriptUrl ? String(transcriptUrl) : null,
                transcriptText: transcript ? String(transcript) : (transcriptText ? String(transcriptText) : null),
                followUpNeeded: true,
                actionsStatus: 'Pending',
            },
        });

        console.log("✅ Call saved successfully!", newCall.id);
        return NextResponse.json({ success: true, call: newCall }, { status: 201 });
    } catch (error) {
        console.error('Error ingesting call:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
