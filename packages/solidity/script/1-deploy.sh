source .env

forge script --chain-id 84532 script/DeployScript.sol:DeploySalamels --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY

# 

# forge verify-contract --guess-constructor-args 0xA1Fa1FaDB17fA31B145ecB5B6B474F74D5Da54Be --rpc-url $BASE_SEPOLIA_RPC_URL --etherscan-api-key $ETHERSCAN_API_KEY