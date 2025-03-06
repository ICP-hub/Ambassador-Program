#!/bin/bash

# Variables
CANISTER_NAME="ICP_Ambassador_Program_backend"
HUB="6m3ir-stmk2-sc3g6-q7oue-vkqb5-bl4qt-tuona-gfwzl-vekdl-b5lom-qae_0"
REFERRER="6y7ne-r6mj6-f3ch3-ppd2a-e76j3-pncjq-jislm-7vqik-54bj6-tmfbe-yqe"

# Function to log messages
log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
}

# Function to run tests and check response
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_fail="$3"

    log "$test_name..."
    
    RESPONSE=$(eval "$command" 2>&1)
    EXIT_CODE=$?

    echo "Response: $RESPONSE"

    # Check if response contains an error message
    if echo "$RESPONSE" | grep -qi "error"; then
        if [ "$expected_fail" = "true" ]; then
            log "$test_name passed (expected failure)."
        else
            log "$test_name failed with error: $RESPONSE"
            exit 1
        fi
    else
        if [ "$expected_fail" = "true" ]; then
            log "$test_name failed (expected an error but got success)."
            exit 1
        else
            log "$test_name passed."
        fi
    fi
}

log "Starting unit tests..."

# Test 1: Create a user with valid inputs (no referrer)
run_test "Test 1: Creating a user with valid inputs (no referrer)" \
    "dfx canister call $CANISTER_NAME create_user '(\"discord1\", \"username1\", \"$HUB\", null)' --output raw" \
    "false"

# Test 2: Create a user with empty Discord ID (expected failure)
run_test "Test 2: Creating a user with empty Discord ID (expected failure)" \
    "dfx canister call $CANISTER_NAME create_user '(\"\", \"username2\", \"$HUB\", null)' --output raw" \
    "true"

# Test 3: Create a user with empty username (expected failure)
run_test "Test 3: Creating a user with empty username (expected failure)" \
    "dfx canister call $CANISTER_NAME create_user '(\"discord3\", \"\", \"$HUB\", null)' --output raw" \
    "true"

# Test 4: Create a user with a duplicate Discord ID (expected failure)
run_test "Test 4: Creating a user with a duplicate Discord ID (expected failure)" \
    "dfx canister call $CANISTER_NAME create_user '(\"discord1\", \"username4\", \"$HUB\", null)' --output raw" \
    "true"

# Test 5: Create a user with a valid referrer
run_test "Test 5: Creating a user with a valid referrer" \
    "dfx canister call $CANISTER_NAME create_user '(\"discord5\", \"username5\", \"$HUB\", opt \"$REFERRER\")' --output raw" \
    "false"

# Test 6: Create a user with an invalid referrer (expected failure)
run_test "Test 6: Creating a user with an invalid referrer (expected failure)" \
    "dfx canister call $CANISTER_NAME create_user '(\"discord6\", \"username6\", \"$HUB\", opt \"invalid_referrer\")' --output raw" \
    "true"

log "All unit tests completed."
