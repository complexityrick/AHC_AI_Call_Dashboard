#!/bin/bash
echo "🚀 Sending test call data to Localhost..."

URL="http://localhost:3000/api/webhooks/ingest"

echo "Targeting: $URL"

# We send 'transcript' field which validates our fix (mapping transcript -> transcriptText)
curl -v -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer my-super-secret-key-123" \
  -d '{
    "vapiCallId": "test-verify-fix-'$(date +%s)'",
    "callerName": "Verification User",
    "phoneNumber": "+15550199999",
    "callerType": "Tester",
    "callIntent": "Verify Transcript Fix",
    "clinic": "Local Clinic",
    "location": "Localhost",
    "provider": "Dr. Local",
    "urgency": "Low",
    "transferDestination": "None",
    "transcript": "Success! This text was sent as \"transcript\" and mapped to \"transcriptText\".",
    "followUpNeeded": true
  }'

echo -e "\n\n📋 Request sent."
