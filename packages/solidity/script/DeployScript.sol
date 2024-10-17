// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import {Salamels} from "src/Salamels.sol";
import {CreatorTokenTransferValidator} from "creator-token-standards/utils/CreatorTokenTransferValidator.sol";

contract DeploySalamels is Script {

    function run() public {
        bytes32 salt = 0xc81d8b1e0af5bf2ee97ac827da03ce6f509de5be8837f5718099e7eac57a224f;
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        address tempOwner = vm.envAddress("TEMP_OWNER");
        address finalOwner = vm.envAddress("FINAL_OWNER");
        address royaltyReceiver = vm.envAddress("ROYALTY_RECEIVER");
        uint96 royaltyFeeNumerator = uint96(vm.envUint("ROYALTY_FEE_NUMERATOR"));
        address signer = vm.envAddress("SIGNER");
        uint256 maxSignedMints = vm.envUint("MAX_SIGNED_MINTS");
        uint256 maxSupply = vm.envUint("MAX_SUPPLY");
        uint256 maxOwnerMints = vm.envUint("MAX_OWNER_MINTS");
        uint256 basePrice = 0.04 ether;

        vm.startBroadcast(privateKey);

        Salamels salamels = new Salamels{salt: salt}(tempOwner, royaltyReceiver, royaltyFeeNumerator, signer, maxSignedMints, maxSupply, maxOwnerMints, basePrice);
        
        salamels.setBaseURI("https://7ltg4cky3ci3qsm2l22uoguxw2zwekluj2k55z5wbjeh5ueyeana.arweave.net/-uZuCVjYkbhJml61RxqXtrNiKXROld7ntgpIftCYIBo/");
        salamels.setSuffixURI(".json");

        // salamels.setPhase(1, 500, 500); 

        CreatorTokenTransferValidator validator = CreatorTokenTransferValidator(salamels.getTransferValidator());
        validator.setTransferSecurityLevelOfCollection(address(salamels), 0, true, true, false);

        salamels.transferOwnership(finalOwner);

        vm.stopBroadcast();
        console2.log("Salamels deployed at address: %s", address(salamels));
    }
}