// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/StdCheats.sol";
import "forge-std/StdAssertions.sol";
import "forge-std/StdUtils.sol";
import {TestBase} from "forge-std/Base.sol";
import "creator-token-standards/utils/CreatorTokenTransferValidatorConfiguration.sol";
import {CreatorTokenTransferValidator} from "creator-token-standards/utils/CreatorTokenTransferValidator.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "src/Salamels.sol";

contract BaseTest is StdCheats, StdAssertions, StdUtils, TestBase {

    Salamels salamels;
    CreatorTokenTransferValidator validator;

    uint256 adminKey;
    uint256 royaltyReceiverKey;
    uint256 signerKey;
    uint256 aliceKey;
    uint256 bobKey;
    uint256 carolKey;

    address admin;
    address royaltyReceiver;
    address signer;
    address alice;
    address bob;
    address carol;

    uint96 royaltyAmount = 1_000; // 10% in BIPS

    bytes32 salt = keccak256("Salamels");

    function setUp() public virtual {
        (admin, adminKey) = makeAddrAndKey("admin");
        (royaltyReceiver, royaltyReceiverKey) = makeAddrAndKey("royaltyReceiver");
        (signer, signerKey) = makeAddrAndKey("signer");
        (alice, aliceKey) = makeAddrAndKey("alice");
        console2.log("alice", alice);
        (bob, bobKey) = makeAddrAndKey("bob");
        (carol, carolKey) = makeAddrAndKey("carol");
        (address eoaRegistry, ) = makeAddrAndKey("eoaRegistry");

        vm.deal(admin, 100 ether);

        changePrank(admin);
        salamels = new Salamels{salt: salt}(admin, royaltyReceiver, royaltyAmount, signer, 1000, 10000, 1000, 0.04 ether);
        CreatorTokenTransferValidatorConfiguration config = new CreatorTokenTransferValidatorConfiguration(admin);

        config.setNativeValueToCheckPauseState(10 ether);
        validator = new CreatorTokenTransferValidator(admin, eoaRegistry, "Mock Validator", "1", address(config));

        salamels.setPhase(1, 500, 500);

        // Warp to a more realistic timestamp
        vm.warp(1703688340);
    }

    function changePrank(address msgSender) internal virtual override {
        vm.stopPrank();
        vm.startPrank(msgSender);
    }

    function getSignature(uint256 sigKey, address wallet, uint256 maxQuantity, uint256 price) internal view returns (bytes memory signature) {
        bytes32 digest = ECDSA.toTypedDataHash(
            salamels.domainSeparatorV4(),
            keccak256(
                abi.encode(
                    keccak256("Approved(address wallet,uint256 quantity,uint256 price)"),
                    wallet,
                    maxQuantity,
                    price
                )
            )
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(sigKey, digest);
        signature = abi.encodePacked(r, s, v);
    }

}