// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "src/Salamels.sol";

contract DeploySalamels is Script {

    function run() public {
        bytes32 salt = 0x0000000000000000000000000000000000000000771737a46d75ad995610000c;
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address deployer = 0xc2eF31f862870114253691BeEaD9eb45F993F179;
        vm.startBroadcast(privateKey);

        Salamels salamels = new Salamels{salt: salt}(deployer, deployer, 1_000, deployer, 10000, 10000, 10000, 0.04 ether);

        vm.stopBroadcast();
        console2.log("Salamels deployed at address: %s", address(salamels));
    }
}