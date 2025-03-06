#!/bin/bash

# Variables
CANISTER_NAME="ICP_Ambassador_Program_backend"
USER_PREFIX="test_user_"
HUB="2lsxv-kqepd-tloch-im6fb-kuy4w-yf5jt-jlxsp-2ga5a-xwmmc-c7dug-nae_0"
STRESS_TEST_USERS=20  # Adjust this for higher/lower stress levels

# Function to log messages
log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
}

dfx identity use default

log "Starting stress test..."
log "Creating $STRESS_TEST_USERS users..."

for i in $(seq 1 $STRESS_TEST_USERS); do
    DISCORD_ID="$USER_PREFIX$i"
    log "Creating user $DISCORD_ID..."
    
    RESPONSE=$(dfx canister call $CANISTER_NAME create_user \
        '("'$DISCORD_ID'", "username_'$i'", "'$HUB'", null)' --output raw 2>&1)
    EXIT_CODE=$?
    
    echo "Response: $RESPONSE"
    
    if [ $EXIT_CODE -ne 0 ]; then
        log "Stress test failed at user $DISCORD_ID with error: $RESPONSE"
        exit 1
    fi
done

log "Stress test passed. $STRESS_TEST_USERS users created successfully."

dfx identity use office