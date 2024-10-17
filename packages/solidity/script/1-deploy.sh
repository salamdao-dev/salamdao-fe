source .env

forge script --chain-id 8453 script/DeployScript.sol:DeploySalamels --rpc-url $BASE_RPC_URL -vvvv --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY

# forge verify-contract --guess-constructor-args  --rpc-url $BASE_SEPOLIA_RPC_URL --etherscan-api-key $ETHERSCAN_API_KEY