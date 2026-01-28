#!/bin/bash
echo "🚀 Sending test call data via NGROK (Public Internet)..."

# URL provided by user
NGROK_URL="https://microptic-softly-rigoberto.ngrok-free.dev/api/webhooks/ingest"

echo "Targeting: $NGROK_URL"

curl -v -X POST "$NGROK_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer my-super-secret-key-123" \
  -d '{
    "vapiCallId": "test-ngrok-'$(date +%s)'",
    "callerName": "Ngrok Test User",
    "phoneNumber": "+18885550199",
    "callerType": "Patient",
    "callIntent": "Testing Ngrok Tunnel",
    "clinic": "Test Clinic",
    "location": "Internet",
    "provider": "Dr. Tunnel",
    "urgency": "Normal",
    "transferDestination": "None",
    "transcriptText": "This test came through the Ngrok tunnel.",
    "followUpNeeded": false
  }'

echo -e "\n\n📋 If you see 'HTTP/1.1 201 Created' above, the tunnel is working!"
