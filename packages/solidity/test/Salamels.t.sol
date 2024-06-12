// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BaseTest.t.sol";
import "src/SignedApprovalMint.sol";

contract SalamelsTest is BaseTest {

    bytes testSig = abi.encodePacked(hex"195c856d8f7d69539ca3eb7bef7f2464e7403507e81506636709bfe834a3d6553c841274fb2112cff8cd0747b6b98735622e27d5ac9c9bd1ceb448d923e4087e1b");

    modifier whenCallerIsNotOwner(address msgSender) {
        vm.assume(msgSender != admin);
        vm.deal(msgSender, 100 ether);
        changePrank(msgSender);
        _;
    }

    function test_constructor() public view {
        assertEq(salamels.owner(), admin);
        assertEq(salamels.approvalSigner(), signer);
        assertEq(salamels.remainingSignedMints(), 1000);
        assertFalse(salamels.signedClaimsDecommissioned());
        assertEq(salamels.maxSupply(), 1000);
        assertEq(salamels.name(), "Salamels");
        assertEq(salamels.symbol(), "SALAM");
        assertEq(address(salamels), 0xF4593Ed8773737E902E6015959AB186caA50cdDd);
        assertEq(salamels.baseTokenURI(), "");
        
        (address setRoyaltyReceiver, uint256 setRoyaltyAmount) = salamels.royaltyInfo(1, 1 ether);
        assertEq(setRoyaltyReceiver, royaltyReceiver);
        assertEq(setRoyaltyAmount, 0.1 ether);

        assertEq(salamels.DEFAULT_TRANSFER_VALIDATOR(), salamels.getTransferValidator());
        assertFalse(salamels.signedClaimsDecommissioned());
        assertFalse(salamels.autoApproveTransfersFromValidator());
    }

    function test_decommissionSignedApprovals() public {
        salamels.decommissionSignedApprovals();
        assertTrue(salamels.signedClaimsDecommissioned());

        vm.expectRevert(SignedApprovalMintBase.SignedApprovalMint__SignedClaimsAreDecommissioned.selector);
        salamels.claimSignedMint{value: 25000000000000000}(abi.encodePacked(hex"965fbe52370b6a6bd0125ae940760ddea587920fe9993d19d22e9f160f0cae280dab075071f1d5319fcb3b332384679f2150c32080f8b6069f1e52b2176d4dbd1b"), 1, 1, 25000000000000000);
    }

    function test_decommissionSignedApprovals_notOwner(address badActor)
        public
        whenCallerIsNotOwner(badActor)
    {
        vm.expectRevert("Ownable: caller is not the owner");
        salamels.decommissionSignedApprovals();
        assertFalse(salamels.signedClaimsDecommissioned());
    }

    function test_setBaseURI() public {
        salamels.setBaseURI("https://example.com/");
        assertEq(salamels.baseTokenURI(), "https://example.com/");
    }

    function test_setBaseURI_notOwner(address badActor)
        public
        whenCallerIsNotOwner(badActor)
    {
        vm.expectRevert("Ownable: caller is not the owner");
        salamels.setBaseURI("https://example.com/");
        assertEq(salamels.baseTokenURI(), "");
    }

    function test_setSuffixURI() public {
        salamels.setSuffixURI(".json");
        assertEq(salamels.suffixURI(), ".json");
    }

    function test_setSuffixURI_notOwner(address badActor)
        public
        whenCallerIsNotOwner(badActor)
    {
        vm.expectRevert("Ownable: caller is not the owner");
        salamels.setSuffixURI(".json");
        assertEq(salamels.suffixURI(), "");
    }

    function test_ownerMint() public {
        salamels.ownerMint(alice, 1);
        assertEq(salamels.remainingOwnerMints(), 999);
        assertEq(salamels.ownerOf(1), alice);
        assertEq(salamels.balanceOf(alice), 1);
    }

    function test_ownerMint_notOwner(address badActor)
        public
        whenCallerIsNotOwner(badActor)
    {
        vm.expectRevert("Ownable: caller is not the owner");
        salamels.ownerMint(alice, 1);
        vm.expectRevert("ERC721: invalid token ID");
        assertEq(salamels.ownerOf(1), address(0));
        assertEq(salamels.balanceOf(alice), 0);
    }

    function test_renounceOwnership() public {
        salamels.renounceOwnership();
        assertEq(salamels.owner(), address(0));
    }

    function test_renounceOwnership_notOwner(address badActor)
        public
        whenCallerIsNotOwner(badActor)
    {
        vm.expectRevert("Ownable: caller is not the owner");
        salamels.renounceOwnership();
        assertEq(salamels.owner(), admin);
    }

    function test_transferOwnership() public {
        salamels.transferOwnership(alice);
        assertEq(salamels.owner(), alice);
    }

    function test_transferOwnership_notOwner(address badActor)
        public
        whenCallerIsNotOwner(badActor)
    {
        vm.expectRevert("Ownable: caller is not the owner");
        salamels.transferOwnership(alice);
        assertEq(salamels.owner(), admin);
    }

    function test_setSigner() public {
        salamels.setSigner(alice);
        assertEq(salamels.approvalSigner(), alice);
    }

    function test_setSigner_notOwner(address badActor)
        public
        whenCallerIsNotOwner(badActor)
    {
        vm.expectRevert("Ownable: caller is not the owner");
        salamels.setSigner(alice);
        assertEq(salamels.approvalSigner(), signer);
    }

    function test_setTransferValidator() public {
        salamels.setTransferValidator(address(validator));
        assertEq(salamels.getTransferValidator(), address(validator));
    }

    function test_setTransferValidator_notOwner(address badActor)
        public
        whenCallerIsNotOwner(badActor)
    {
        vm.expectRevert("Ownable: caller is not the owner");
        salamels.setTransferValidator(alice);
        assertEq(salamels.getTransferValidator(), salamels.DEFAULT_TRANSFER_VALIDATOR());
    }

    function test_setAutomaticApprovalOfTransfersFromValidator() public {
        assertFalse(salamels.autoApproveTransfersFromValidator());
        salamels.setAutomaticApprovalOfTransfersFromValidator(true);
        assertTrue(salamels.autoApproveTransfersFromValidator());
    }

    function test_setAutomaticApprovalOfTransfersFromValidator_notOwner(address badActor)
        public
        whenCallerIsNotOwner(badActor)
    {
        vm.expectRevert("Ownable: caller is not the owner");
        salamels.setAutomaticApprovalOfTransfersFromValidator(true);
        assertFalse(salamels.autoApproveTransfersFromValidator());
    }

    function test_setTokenRoyalty() public {
        salamels.setTokenRoyalty(1, alice, 5_000);
        salamels.setTokenRoyalty(2, bob, 10_000);
        
        (address setRoyaltyReceiver, uint256 setRoyaltyAmount) = salamels.royaltyInfo(1, 1 ether);
        assertEq(setRoyaltyReceiver, alice);
        assertEq(setRoyaltyAmount, 0.5 ether);

        (address setRoyaltyReceiver2, uint256 setRoyaltyAmount2) = salamels.royaltyInfo(2, 1 ether);
        assertEq(setRoyaltyReceiver2, bob);
        assertEq(setRoyaltyAmount2, 1 ether);
    }

    function test_setTokenRoyalty_notOwner(address badActor)
        public
        whenCallerIsNotOwner(badActor)
    {
        vm.expectRevert("Ownable: caller is not the owner");
        salamels.setTokenRoyalty(1, alice, 5_000);
        (address setRoyaltyReceiver, uint256 setRoyaltyAmount) = salamels.royaltyInfo(1, 1 ether);
        assertEq(setRoyaltyReceiver, royaltyReceiver);
        assertEq(setRoyaltyAmount, 0.1 ether);
    }
    
    function test_setDefaultRoyalty() public {
        (address setRoyaltyReceiver, uint256 setRoyaltyAmount) = salamels.royaltyInfo(1, 1 ether);
        assertEq(setRoyaltyReceiver, royaltyReceiver);
        assertEq(setRoyaltyAmount, 0.1 ether);

        salamels.setDefaultRoyalty(alice, 5_000); 
        
        (address updatedRoyaltyReceiver, uint256 updatedRoyaltyAmount) = salamels.royaltyInfo(1, 1 ether);
        assertEq(updatedRoyaltyReceiver, alice);
        assertEq(updatedRoyaltyAmount, 0.5 ether);
    }

    function test_setDefaultRoyalty_notOwner(address badActor)
        public
        whenCallerIsNotOwner(badActor)
    {
        vm.expectRevert("Ownable: caller is not the owner");
        salamels.setDefaultRoyalty(alice, 5_000);

        (address setRoyaltyReceiver, uint256 setRoyaltyAmount) = salamels.royaltyInfo(1, 1 ether);
        assertEq(setRoyaltyReceiver, royaltyReceiver);
        assertEq(setRoyaltyAmount, 0.1 ether);
    }

    function test_SignedMint() public {
        uint256 price = 25000000000000000;
        uint256 quantity = 10;

        changePrank(alice);
        vm.deal(alice, price * quantity);
        salamels.claimSignedMint{value: price * quantity}(testSig, quantity, quantity, price);
        assertEq(salamels.remainingSignedMints(), 990);
        assertEq(salamels.amountMintedBySignedApproval(alice), 10);

        for (uint256 i = 1; i <= quantity; i++) {
            assertEq(salamels.ownerOf(i), alice);
        }
    }

    function test_SignedMintMultipleMints() public {
        uint256 price = 25000000000000000;
        uint256 quantity = 2;
        uint256 maxQuantity = 10;

        changePrank(alice);
        vm.deal(alice, price * maxQuantity * 2);

        salamels.claimSignedMint{value: price * quantity}(testSig, quantity, maxQuantity, price);
        assertEq(salamels.remainingSignedMints(), 998);
        assertEq(salamels.mintedSupply(), 2);
        assertEq(salamels.amountMintedBySignedApproval(alice), 2);
        assertEq(salamels.balanceOf(alice), 2);

        salamels.claimSignedMint{value: price * quantity}(testSig, quantity, maxQuantity, price);
        assertEq(salamels.remainingSignedMints(), 996);
        assertEq(salamels.mintedSupply(), 4);
        assertEq(salamels.amountMintedBySignedApproval(alice), 4);
        assertEq(salamels.balanceOf(alice), 4);

        salamels.claimSignedMint{value: price * quantity}(testSig, quantity, maxQuantity, price);
        assertEq(salamels.remainingSignedMints(), 994);
        assertEq(salamels.mintedSupply(), 6);
        assertEq(salamels.amountMintedBySignedApproval(alice), 6);
        assertEq(salamels.balanceOf(alice), 6);

        salamels.claimSignedMint{value: price * quantity}(testSig, quantity, maxQuantity, price);
        assertEq(salamels.remainingSignedMints(), 992);
        assertEq(salamels.mintedSupply(), 8);
        assertEq(salamels.amountMintedBySignedApproval(alice), 8);
        assertEq(salamels.balanceOf(alice), 8);

        salamels.claimSignedMint{value: price * quantity}(testSig, quantity, maxQuantity, price);
        assertEq(salamels.remainingSignedMints(), 990);
        assertEq(salamels.mintedSupply(), 10);
        assertEq(salamels.amountMintedBySignedApproval(alice), 10);
        assertEq(salamels.balanceOf(alice), 10);

        vm.expectRevert(SignedApprovalMintBase.SignedApprovalMint__MintExceedsMaximumAmountBySignedApproval.selector);
        salamels.claimSignedMint{value: price * quantity}(testSig, quantity, maxQuantity, price);
        assertEq(salamels.remainingSignedMints(), 990);
        assertEq(salamels.mintedSupply(), 10);
        assertEq(salamels.amountMintedBySignedApproval(alice), 10);
        assertEq(salamels.balanceOf(alice), 10);
    }

    function test_SignedMint_whenIncorrectAmount(uint256 quantityToMint) public {
        quantityToMint = bound(quantityToMint, 11, 100_000);    
        uint256 price = 25000000000000000;
        uint256 maxAmount = 10;

        changePrank(alice);
        vm.deal(alice, price * quantityToMint);
        vm.expectRevert(SignedApprovalMintBase.SignedApprovalMint__MintExceedsMaximumAmountBySignedApproval.selector);
        salamels.claimSignedMint{value: price * quantityToMint}(testSig, quantityToMint, maxAmount, price);
    }

    function test_SignedMint_whenIncorrectPrice(uint256 price) public {
        price = bound(price, 0, 24_999_999_999_999_999);
    
        uint256 quantityToMint = 10;
        uint256 maxAmount = 10;

        changePrank(alice);
        vm.deal(alice, price * quantityToMint);
        vm.expectRevert(SignedApprovalMintBase.SignedApprovalMint__InvalidSignature.selector);
        salamels.claimSignedMint{value: price * quantityToMint}(testSig, quantityToMint, maxAmount, price);
    }

}