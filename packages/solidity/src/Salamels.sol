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
    error Salamels__PhaseMintsExceeded();
    error Salamels__MaxMintsPerAddressPerPhaseExceeded();
    error Salamels__TotalMintedAmountOverMaxQuantity();

    uint16 private _phase;
    bool private _enforceWalletLimit;

    mapping(uint16 => uint256) private _phaseMints;
    mapping(uint16 => uint256) private _publicMints;
    mapping(address => mapping(uint16 => uint256)) private _addressMintsPerPhase;

    uint256 private immutable _basePrice;
    uint256 private constant MAX_MINTS_PER_ADDRESS_PER_PHASE = 10;

    event PublicMintClaimed(address indexed minter, uint256 startTokenId, uint256 endTokenId);
    event PhaseSet(uint16 phase, uint256 signedMints, uint256 publicMints);
    event EnforceWalletLimitSet(bool enforceWalletLimit);

    constructor(
        address owner_,
        address royaltyReceiver_,
        uint96 royaltyFeeNumerator_,
        address signer_,
        uint256 maxSignedMints_,
        uint256 maxSupply_,
        uint256 maxOwnerMints_,
        uint256 basePrice_) 
        ERC721OpenZeppelin("Salamels", "SALAM") 
        BasicRoyalties(royaltyReceiver_, royaltyFeeNumerator_)
        SignedApprovalMint(signer_)
        MaxSupply(maxSupply_, maxOwnerMints_)
        EIP712("Salamels", '1') 
    {
        _basePrice = basePrice_;
        _transferOwnership(owner_);
        _enforceWalletLimit = true;
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

    function setPhase(uint16 phase, uint256 signedMints, uint256 publicMints) public {
        _requireCallerIsContractOwner();
        _phase = phase;
        _phaseMints[phase] = signedMints;
        _publicMints[phase] = publicMints;

        emit PhaseSet(phase, signedMints, publicMints);
    }

    function setEnforceWalletLimit(bool enforceWalletLimit) public {
        _requireCallerIsContractOwner();
        _enforceWalletLimit = enforceWalletLimit;

        emit EnforceWalletLimitSet(enforceWalletLimit);
    }

    function publicMint(uint256 quantity) public payable {
        _requireLessThanMaxSupply(mintedSupply() + quantity);

        uint16 currentPhase = _phase;
        uint256 currentPublicMints = _publicMints[currentPhase];

        if (msg.value != _basePrice * quantity) {
            revert Salamels__InvalidPaymentAmount();
        }

        if (currentPublicMints < quantity) {
            revert Salamels__PhaseMintsExceeded();
        }

        uint256 addressMintsAfterMint = _addressMintsPerPhase[_msgSender()][currentPhase] + quantity;

        if (_enforceWalletLimit) {
            if (addressMintsAfterMint > MAX_MINTS_PER_ADDRESS_PER_PHASE) {
                revert Salamels__MaxMintsPerAddressPerPhaseExceeded();
            }
        }

        unchecked {
            _publicMints[currentPhase] = currentPublicMints - quantity;
        }

        _addressMintsPerPhase[_msgSender()][currentPhase] = addressMintsAfterMint;

        (uint256 startTokenId, uint256 endTokenId) = _mintBatch(_msgSender(), quantity);

        emit PublicMintClaimed(_msgSender(), startTokenId, endTokenId);
    }

    function claimSignedMint(bytes calldata signature, uint256 quantityToMint, uint256 maxQuantity, uint256 price) external payable {
        uint16 currentPhase = _phase;
        // Total allowable mints for the current phase
        uint256 currentPhaseMints = _phaseMints[currentPhase];
        // Total mints claimed by the sender for the current phase
        uint256 addressMints = _addressMintsPerPhase[_msgSender()][currentPhase];

        uint256 totalAddressMints = addressMints + quantityToMint;

        if (totalAddressMints > MAX_MINTS_PER_ADDRESS_PER_PHASE) {
            revert Salamels__MaxMintsPerAddressPerPhaseExceeded();
        }

        if (totalAddressMints > maxQuantity) {
            revert Salamels__TotalMintedAmountOverMaxQuantity();
        }

        if (currentPhaseMints < quantityToMint) {
            revert Salamels__PhaseMintsExceeded();
        }

        unchecked {
            _phaseMints[currentPhase] = currentPhaseMints - quantityToMint;
            _addressMintsPerPhase[_msgSender()][currentPhase] = addressMints + quantityToMint;
        }

        _claimSignedMint(signature, quantityToMint, maxQuantity, price);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return bytes(baseTokenURI).length > 0
            ? string(abi.encodePacked(baseTokenURI, tokenId.toString(), suffixURI))
            : "";
    }

    function domainSeparatorV4() external view returns (bytes32 domainSeparator) {
        domainSeparator = _domainSeparatorV4();
    }

    function getPhaseMints(uint16 phase) external view returns (uint256) {
        return _phaseMints[phase];
    }

    function getPublicMints(uint16 phase) external view returns (uint256) {
        return _publicMints[phase];
    }

    function getAddressMintsPerPhase(address user, uint16 phase) external view returns (uint256) {
        return _addressMintsPerPhase[user][phase];
    }

    function getBasePrice() external view returns (uint256) {
        return _basePrice;
    }

    function getMaxMintsPerAddressPerPhase() external pure returns (uint256) {
        return MAX_MINTS_PER_ADDRESS_PER_PHASE;
    }

    function _mintToken(address to, uint256 tokenId) internal virtual override {
        _mint(to, tokenId);
    }
}