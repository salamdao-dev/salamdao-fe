// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import 'creator-token-standards/programmable-royalties/BasicRoyalties.sol';
import 'creator-token-standards/erc721c/ERC721C.sol';
import 'creator-token-standards/token/erc721/MetadataURI.sol';
import 'creator-token-standards/access/OwnableBasic.sol';

import 'src/SignedApprovalMint.sol';
import 'src/libraries/SalamelStrings.sol';

contract Salamels is OwnableBasic, ERC721C, MetadataURI, SignedApprovalMint, BasicRoyalties {
    using SalamelStrings for uint256;
    error Salamels__InvalidPaymentAmount();

    uint256 private immutable _basePrice;

    event PublicMintClaimed(address indexed minter, uint256 startTokenId, uint256 endTokenId);

    constructor(
        address owner_,
        address royaltyReceiver_,
        uint96 royaltyFeeNumerator_,
        string memory name_,
        string memory symbol_,
        address signer_,
        uint256 maxSignedMints_,
        uint256 maxSupply_,
        uint256 maxOwnerMints_,
        uint256 basePrice_) 
        ERC721OpenZeppelin(name_, symbol_) 
        BasicRoyalties(royaltyReceiver_, royaltyFeeNumerator_)
        SignedApprovalMint(signer_, maxSignedMints_)
        MaxSupply(maxSupply_, maxOwnerMints_)
        EIP712(name_, '1') {
        _basePrice = basePrice_;
        _transferOwnership(owner_);

    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721C, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) public {
        _requireCallerIsContractOwner();
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) public {
        _requireCallerIsContractOwner();
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    function publicMint(uint256 quantity) public payable {
        _requireLessThanMaxSupply(mintedSupply() + quantity);

        if (msg.value != _basePrice * quantity) {
            revert Salamels__InvalidPaymentAmount();
        }

        (uint256 startTokenId, uint256 endTokenId) = _mintBatch(_msgSender(), quantity);
        emit PublicMintClaimed(_msgSender(), startTokenId, endTokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return bytes(baseTokenURI).length > 0
            ? string(abi.encodePacked(baseTokenURI, tokenId.toString(), suffixURI))
            : "";
    }

    function _mintToken(address to, uint256 tokenId) internal virtual override {
        _mint(to, tokenId);
    }
}