#!/bin/bash
# ============================================================================
# RIGHT NOW - E2E Test Script
# ============================================================================
# Usage:
#   ./scripts/test-right-now.sh health
#   ./scripts/test-right-now.sh create
#   ./scripts/test-right-now.sh delete POST_ID
#   ./scripts/test-right-now.sh broadcast
#   ./scripts/test-right-now.sh all
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration (update these)
PROJECT_ID="${SUPABASE_PROJECT_ID:-your-project-id}"
ACCESS_TOKEN="${SUPABASE_ACCESS_TOKEN:-your-access-token}"
BASE_URL="https://${PROJECT_ID}.supabase.co/functions/v1/right-now-test"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ jq is not installed. Install with: brew install jq${NC}"
    exit 1
fi

# Print header
print_header() {
    echo -e "${MAGENTA}"
    echo "============================================"
    echo "  🔥 RIGHT NOW E2E TEST SUITE"
    echo "============================================"
    echo -e "${NC}"
    echo -e "${CYAN}Base URL:${NC} $BASE_URL"
    echo ""
}

# Test health endpoint
test_health() {
    echo -e "${BLUE}🏥 Testing Health Endpoint...${NC}"
    
    RESPONSE=$(curl -s "$BASE_URL/health")
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "LIVE" ]; then
        echo -e "${GREEN}✅ Health check passed${NC}"
        echo "$RESPONSE" | jq '.'
    else
        echo -e "${RED}❌ Health check failed${NC}"
        echo "$RESPONSE"
        exit 1
    fi
    echo ""
}

# Test create endpoint
test_create() {
    echo -e "${BLUE}📝 Testing Create Post Endpoint...${NC}"
    
    if [ "$ACCESS_TOKEN" == "your-access-token" ]; then
        echo -e "${RED}❌ Please set SUPABASE_ACCESS_TOKEN environment variable${NC}"
        exit 1
    fi
    
    PAYLOAD=$(cat <<EOF
{
  "mode": "hookup",
  "headline": "Test post from script",
  "body": "This is a test post created by the E2E test script",
  "city": "London",
  "lat": 51.5074,
  "lng": -0.1278
}
EOF
)
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/create" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$PAYLOAD")
    
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
    
    if [ "$SUCCESS" == "true" ]; then
        POST_ID=$(echo "$RESPONSE" | jq -r '.post.id')
        echo -e "${GREEN}✅ Post created successfully${NC}"
        echo -e "${CYAN}Post ID:${NC} $POST_ID"
        echo "$RESPONSE" | jq '.post'
        
        # Save post ID for later
        echo "$POST_ID" > /tmp/right_now_test_post_id.txt
    else
        echo -e "${RED}❌ Failed to create post${NC}"
        echo "$RESPONSE" | jq '.'
        exit 1
    fi
    echo ""
}

# Test delete endpoint
test_delete() {
    echo -e "${BLUE}🗑️  Testing Delete Post Endpoint...${NC}"
    
    POST_ID=$1
    
    if [ -z "$POST_ID" ]; then
        # Try to read from saved file
        if [ -f /tmp/right_now_test_post_id.txt ]; then
            POST_ID=$(cat /tmp/right_now_test_post_id.txt)
            echo -e "${YELLOW}Using saved post ID: $POST_ID${NC}"
        else
            echo -e "${RED}❌ No post ID provided. Create a post first.${NC}"
            exit 1
        fi
    fi
    
    if [ "$ACCESS_TOKEN" == "your-access-token" ]; then
        echo -e "${RED}❌ Please set SUPABASE_ACCESS_TOKEN environment variable${NC}"
        exit 1
    fi
    
    PAYLOAD=$(cat <<EOF
{
  "post_id": "$POST_ID"
}
EOF
)
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/delete" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$PAYLOAD")
    
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
    
    if [ "$SUCCESS" == "true" ]; then
        echo -e "${GREEN}✅ Post deleted successfully${NC}"
        echo "$RESPONSE" | jq '.'
        
        # Clean up saved file
        rm -f /tmp/right_now_test_post_id.txt
    else
        echo -e "${RED}❌ Failed to delete post${NC}"
        echo "$RESPONSE" | jq '.'
        exit 1
    fi
    echo ""
}

# Test broadcast endpoint
test_broadcast() {
    echo -e "${BLUE}📡 Testing Broadcast Endpoint...${NC}"
    
    PAYLOAD=$(cat <<EOF
{
  "city": "London",
  "event": "test_broadcast",
  "payload": {
    "message": "Test broadcast from E2E script",
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  }
}
EOF
)
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/broadcast" \
        -H "Content-Type: application/json" \
        -d "$PAYLOAD")
    
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
    
    if [ "$SUCCESS" == "true" ]; then
        CHANNEL=$(echo "$RESPONSE" | jq -r '.channel')
        echo -e "${GREEN}✅ Broadcast sent successfully${NC}"
        echo -e "${CYAN}Channel:${NC} $CHANNEL"
        echo "$RESPONSE" | jq '.'
    else
        echo -e "${RED}❌ Failed to send broadcast${NC}"
        echo "$RESPONSE" | jq '.'
        exit 1
    fi
    echo ""
}

# Test all modes
test_all_modes() {
    echo -e "${BLUE}🎨 Testing All Post Modes...${NC}"
    
    if [ "$ACCESS_TOKEN" == "your-access-token" ]; then
        echo -e "${RED}❌ Please set SUPABASE_ACCESS_TOKEN environment variable${NC}"
        exit 1
    fi
    
    MODES=("hookup" "crowd" "drop" "care")
    
    for MODE in "${MODES[@]}"; do
        echo -e "${YELLOW}Testing mode: $MODE${NC}"
        
        PAYLOAD=$(cat <<EOF
{
  "mode": "$MODE",
  "headline": "Test $MODE post from script",
  "city": "London"
}
EOF
)
        
        RESPONSE=$(curl -s -X POST "$BASE_URL/create" \
            -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$PAYLOAD")
        
        SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
        
        if [ "$SUCCESS" == "true" ]; then
            POST_ID=$(echo "$RESPONSE" | jq -r '.post.id')
            echo -e "${GREEN}  ✅ Created $MODE post: $POST_ID${NC}"
        else
            echo -e "${RED}  ❌ Failed to create $MODE post${NC}"
            echo "$RESPONSE" | jq '.'
        fi
    done
    echo ""
}

# Run all tests
run_all_tests() {
    print_header
    test_health
    test_create
    test_broadcast
    test_all_modes
    test_delete
    
    echo -e "${GREEN}"
    echo "============================================"
    echo "  ✅ ALL TESTS PASSED"
    echo "============================================"
    echo -e "${NC}"
}

# Main
print_header

case "${1:-all}" in
    health)
        test_health
        ;;
    create)
        test_create
        ;;
    delete)
        test_delete "$2"
        ;;
    broadcast)
        test_broadcast
        ;;
    modes)
        test_all_modes
        ;;
    all)
        run_all_tests
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo ""
        echo "Usage:"
        echo "  $0 health              - Test health endpoint"
        echo "  $0 create              - Create a test post"
        echo "  $0 delete [POST_ID]    - Delete a post"
        echo "  $0 broadcast           - Send test broadcast"
        echo "  $0 modes               - Test all post modes"
        echo "  $0 all                 - Run all tests"
        echo ""
        echo "Environment variables:"
        echo "  SUPABASE_PROJECT_ID    - Your Supabase project ID"
        echo "  SUPABASE_ACCESS_TOKEN  - Your auth access token"
        echo ""
        exit 1
        ;;
esac
