#!/bin/bash

source .env

echo "TEMP_OWNER: $TEMP_OWNER"
echo "FINAL_OWNER: $FINAL_OWNER"
echo "ROYALTY_RECEIVER: $ROYALTY_RECEIVER"
echo "ROYALTY_FEE_NUMERATOR: $ROYALTY_FEE_NUMERATOR"
echo "SIGNER: $SIGNER"
echo "MAX_SIGNED_MINTS: $MAX_SIGNED_MINTS"
echo "MAX_SUPPLY: $MAX_SUPPLY"
echo "MAX_OWNER_MINTS: $MAX_OWNER_MINTS"
echo "BASE_PRICE: $BASE_PRICE"

echo 

cast create2 --starts-with A1FA1FA --init-code $(forge inspect src/Salamels.sol:Salamels bytecode)$(cast abi-encode "constructor(address,address,uint16,address,uint256,uint256,uint256,uint256)" $TEMP_OWNER $ROYALTY_RECEIVER $ROYALTY_FEE_NUMERATOR $SIGNER $MAX_SIGNED_MINTS $MAX_SUPPLY $MAX_OWNER_MINTS $BASE_PRICE | cut -c 3-)


