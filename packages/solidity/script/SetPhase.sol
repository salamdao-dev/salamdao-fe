// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "src/Salamels.sol";

contract SetPhase is Script {

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        uint16 phase = uint16(vm.envUint("PHASE"));
        uint256 publicMints = vm.envUint("PUBLIC_MINTS");
        uint256 signedMints = vm.envUint("SIGNED_MINTS");

        vm.startBroadcast(privateKey);

        Salamels salamels = Salamels(0xA1fa1FAdd83d7958C145f731D0fA51a8E53Bcc85);
        
        salamels.setPhase(phase, publicMints, signedMints);

        vm.stopBroadcast();
    }
}