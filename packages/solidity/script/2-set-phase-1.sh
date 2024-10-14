#!/bin/bash

source .env

export PHASE=1
export PUBLIC_MINTS=500
export SIGNED_MINTS=500

forge script --chain-id 84532 script/SetPhase.sol:SetPhase --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --broadcast