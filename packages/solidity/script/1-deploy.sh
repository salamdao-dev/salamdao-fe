source .env

forge script --chain sepolia script/DeployScript.sol:DeploySalamels --rpc-url $SEPOLIA_RPC_URL -vvvv --broadcast --verify

# forge verify-contract --guess-constructor-args 0xFC6Aadf4c3800CCc4954a2f956B4aD47c5B75375 --rpc-url $SEPOLIA_RPC_URL