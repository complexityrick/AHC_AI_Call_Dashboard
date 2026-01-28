#!/bin/bash
echo "🚀 Sending test call data to local dashboard..."

curl -X POST http://localhost:3000/api/webhooks/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer my-super-secret-key-123" \
  -d '{
    "vapiCallId": "test-call-id-local-'$(date +%s)'",
    "callerName": "Test User Local",
    "phoneNumber": "+18885550199",
    "callerType": "Patient",
    "callIntent": "Testing Local Ingestion",
    "clinic": "Test Clinic",
    "location": "Localhost",
    "provider": "Dr. Debug",
    "urgency": "High",
    "transferDestination": "None",
    "transcriptText": "This is a test call generated from the command line to verify the specific local endpoint.",
    "followUpNeeded": true
  }'

echo -e "\n\n✅ Request sent! Check your Dashboard to see if 'Test User Local' appears."
