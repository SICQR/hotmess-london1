#!/bin/bash

# HOTMESS Beacon Backend - Quick Test Script
# Tests all demo beacon endpoints

echo "🔥🖤💗 HOTMESS BEACON OS - TESTING ALL ENDPOINTS"
echo "================================================"
echo ""

BASE_URL="http://localhost:3001"

echo "1️⃣  Testing Health Check..."
curl -s "$BASE_URL/health" | jq '.'
echo ""
echo ""

echo "2️⃣  Testing Check-in Beacon (outside venue)..."
curl -s "$BASE_URL/l/DEMO_CHECKIN" | jq '.'
echo ""
echo ""

echo "3️⃣  Testing Check-in Beacon (inside venue)..."
curl -s "$BASE_URL/l/DEMO_CHECKIN?lat=51.5136&lng=-0.1357" | jq '.'
echo ""
echo ""

echo "4️⃣  Testing Ticket View..."
curl -s "$BASE_URL/l/DEMO_TICKET" | jq '.'
echo ""
echo ""

echo "5️⃣  Testing Ticket Validation (door scan)..."
curl -s "$BASE_URL/l/DEMO_TICKET?mode=validate" | jq '.'
echo ""
echo ""

echo "6️⃣  Testing Product Beacon..."
curl -s "$BASE_URL/l/DEMO_PRODUCT" | jq '.'
echo ""
echo ""

echo "7️⃣  Testing Person Beacon (hook-up)..."
curl -s "$BASE_URL/l/DEMO_PERSON" | jq '.'
echo ""
echo ""

echo "8️⃣  Testing Room Beacon..."
curl -s "$BASE_URL/l/DEMO_ROOM" | jq '.'
echo ""
echo ""

echo "9️⃣  Testing Care/HNH Beacon..."
curl -s "$BASE_URL/l/DEMO_HNH" | jq '.'
echo ""
echo ""

echo "✅ All tests complete!"
echo ""
echo "Expected Results:"
echo "  • Check-in (outside): 0 XP"
echo "  • Check-in (inside):  25 XP"
echo "  • Ticket validate:    10 XP"
echo "  • Product view:       0 XP (shows listing)"
echo "  • Person:             1 XP (or auth required)"
echo "  • Room:               1 XP"
echo "  • Care:               1 XP"
