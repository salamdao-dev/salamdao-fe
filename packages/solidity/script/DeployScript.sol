// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "src/Salamels.sol";
import "creator-token-standards/src/utils/CreatorTokenTransferValidator.sol";

contract DeploySalamels is Script {

    function run() public {
        bytes32 salt = 0x2b60bad9c55c274487fbb00ab1be2aab7a3f6bde3b034e4c1a93c2c71b0c9e6c;
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        address owner = 0xc2eF31f862870114253691BeEaD9eb45F993F179;
        address royaltyReceiver = 0xc2eF31f862870114253691BeEaD9eb45F993F179;
        uint96 royaltyFeeNumerator = 0;
        address signer = 0xc2eF31f862870114253691BeEaD9eb45F993F179;
        uint256 maxSignedMints = 1000;
        uint256 maxSupply = 10000;
        uint256 maxOwnerMints = 10000;
        uint256 basePrice = 0.04 ether;

        vm.startBroadcast(privateKey);

        Salamels salamels = new Salamels{salt: salt}(owner, royaltyReceiver, royaltyFeeNumerator, signer, maxSignedMints, maxSupply, maxOwnerMints, basePrice);
        
        salamels.setBaseURI("https://7ltg4cky3ci3qsm2l22uoguxw2zwekluj2k55z5wbjeh5ueyeana.arweave.net/-uZuCVjYkbhJml61RxqXtrNiKXROld7ntgpIftCYIBo/");
        salamels.setSuffixURI(".json");

        CreatorTokenTransferValidator validator = CreatorTokenTransferValidator(salamels.getTransferValidator());
        validator.setTransferSecurityLevelOfCollection(address(salamels), 0, true, true, false);

        vm.stopBroadcast();
        console2.log("Salamels deployed at address: %s", address(salamels));
    }
}