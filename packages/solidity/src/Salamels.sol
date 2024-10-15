// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import 'creator-token-standards/programmable-royalties/BasicRoyalties.sol';
import 'creator-token-standards/erc721c/ERC721C.sol';
import 'creator-token-standards/token/erc721/MetadataURI.sol';
import 'creator-token-standards/access/OwnableBasic.sol';

import 'src/SignedApprovalMint.sol';
import 'src/libraries/SalamelStrings.sol';

/*
 *
 *                                               ....................                                                          
 *                                                                                                                             
 *                                          .....                     ::::.                                                    
 *                                          .....                     ::::.                                                    
 *                               -=========+*****++++++++++++++++++++******=====                                               
 *                               *%%%%%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%.                                              
 *                               *%%%%%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%.                                              
 *                               *%%%%=::::.          ................                                                         
 *                               *%%%%=::::.          ...............                                                          
 *                               -++++-.....     .....:::::::::::::::...........                                               
 *                                     ....      :::::===============-::::::::::                                               
 *                                     ....      :::::===============-::::::::::                                               
 *                                          .....-----++++++++++================.                                              
 *                                ....      :::::=====++++++++++======++++++++++.....                                          
 *                                ....     .-----=====+++++================+++++.....                                          
 *                               .::::.    -%%%%#=====#####:    :====-     #####:::::                                          
 *                               .::::.    -%%%%#=====#####:    :====-     #####:::::                                          
 *                               .::::.    -%%%%#==========:....:====-.....=====+++++.                                         
 *                               .::::.    -%%%%#=====::::::::::-====-::::::::::#%%%%:                                         
 *                               .::::.    -%%%%#=====::::::::::-====-::::::::::#%%%%:                                         
 *                          .....          -%%%%#====================================*###############                          
 *                          .....          -%%%%#====================================*%%%%%%%%%%%%%%#                          
 *                          .....          -%%%%#===============================-----+***************:::::                     
 *                          .::::          -%%%%#===============================:::::::::::::::::::::%%%%%.                    
 *                          .::::          -%%%%#===============================:::::::::::::::::::::%%%%%.                    
 *                          .::::          -%%%%#===============================:::::::::::::::::::::%%%%%.                    
 *                          .::::     -****++++++==========================-----:::::*%%%%+::::::::::=====*####:               
 *                          .::::     =%%%%*===============================::::::::::#@@@@*:::::::::::::::%@@@@-               
 *                          .....     =%%%%*==============================-::::::::::*%%%%+:::::-----:::::#%%%%=....           
 *                     .....          =%%%%*====================-::::::::::::::::::::::::::::::=%%%%#::::::::::*%%%%=          
 *                     .....          =%%%%*====================-::::::::::::::::::::::::::::::=%%%%#::::::::::*%%%%=          
 *                     .....          =%%%%*====================-::::::::::::::::::::::::::::::=%%%%#::::::::::*%%%%=          
 *                     .....          =%%%%*===============+****+++++=::::::::::+++++-:::::::::=%%%%#::::::::::*%%%%=          
 *                     .....          =%%%%*===============*%%%%%%%%%*::::::::::#%%%%=:::::::::=%%%%#::::::::::*%%%%=          
 *                     .....          =%%%%*===============*%%%%%%%%%*::::::::::#%%%%=:::::::::=%%%%#::::::::::*%%%%=          
 *                     .....     +#####%%%%*===============*%%%%=    :#####:::::-----*##########%%%%%###########%%%%=          
 *                     :::::     *%%%%%%%%%*===============*%%%%=    :%%%%#::::::::::*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%=          
 *                     :::::     *%%%%#****+==========++++++++++-    .+++++=====:::::+********************#%%%%*++++-          
 *                     :::::     *%%%%*===============#%%%%:              .%%%%%-:::::::::::::::::::::::::#%%%%-               
 *                     :::::     *%%%%*===============#%%%%:              .%%%%%-:::::::::::::::::::::::::#%%%%-               
 *                     :::::     *%%%%*===============#%%%%:               :::::**************************-::::                
 *                     :::::     *%%%%*===============#%%%%:                    #%%%%%%%%%%%%%%%%%%%%%%%%%.                    
 *                     :::::     *%%%%*===============#%%%%:                    *#########################.                    
 *                     :::::     *%%%%*===============#%%%%:                                                
 *                     :::::     *%%%%*===============#%%%%:                                              
 * =====                     .....*%%%%*===============+****=====:                                               
 * %%%%%.                    .::::*%%%%*====================*%%%%=                                                
 * %%%%%.                    .::::*%%%%*====================*%%%%=                                                  
 * =====*####-                    *%%%%*====================*%%%%=                                                              
 * =====#%%%%-                    *%%%%*====================*%%%%=                                                              
 * =====*****=::::.          :::::+****+====================*%%%%=                                                              
 * ===========*%%%%+          #%%%%+=========================*%%%%=                                                              
 * ===========*%%%%+          #%%%%+=========================*%%%%=                                                              
 * ===========++++++++++++++++++++=====================*****-::::.                                                              
 * ===============+%%%%%%%%%%==========================#%%%%:                                                                   
 * ===============+##########==========================#%%%%:                                                                   
 * ====================================================#%%%%:                                                                   
 * ====================================================#%%%%:                                                                   
 *
 * @title Salamels
 * @notice A contract for minting Salamels tokens with signed approval minting capabilities.
 *         Website: https://salam.gg/
 *         Twitter: https://twitter.com/salam_gg_
 *         Telegram: https://t.me/salamdoors
 */
contract Salamels is OwnableBasic, ERC721C, MetadataURI, SignedApprovalMint, BasicRoyalties {
    using SalamelStrings for uint256;

    error Salamels__InvalidPaymentAmount();
    error Salamels__PhaseMintsExceeded();
    error Salamels__MaxMintsPerAddressPerPhaseExceeded();
    error Salamels__TotalMintedAmountOverMaxQuantity();

    event PublicMintClaimed(address indexed minter, uint256 startTokenId, uint256 endTokenId);
    event PhaseSet(uint16 phase, uint256 signedMints, uint256 publicMints);
    event EnforceWalletLimitSet(bool enforceWalletLimit);

    uint16 private _phase;
    bool private _enforceWalletLimit;

    // Phase => Total allowed signed mints
    mapping(uint16 => uint256) private _phaseMints;
    // Phase => Total allowed public mints
    mapping(uint16 => uint256) private _publicMints;
    // Address => Phase => number of public mints claimed
    mapping(address => mapping(uint16 => uint256)) private _publicMintsPerPhase;
    // Address => Phase => number of signed mints claimed
    mapping(address => mapping(uint16 => uint256)) private _signedMintsPerPhase;

    uint256 private immutable _basePrice;
    uint256 private constant MAX_MINTS_PER_ADDRESS_PER_PHASE = 10;

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

    /*************************************************************************/
    /*                           Owner Functions                             */
    /*************************************************************************/

    /**
     * @notice Set the default royalty receiver and fee numerator
     * @param receiver The address to receive the royalty
     * @param feeNumerator The fee numerator
     */
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) public {
        _requireCallerIsContractOwner();
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    /**
     * @notice Set the royalty receiver and fee numerator for a specific token
     * @param tokenId The token ID to set the royalty for
     * @param receiver The address to receive the royalty
     * @param feeNumerator The fee numerator
     */
    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) public {
        _requireCallerIsContractOwner();
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    /**
     * @notice Set the phase, signed mints, and public mints
     * @param phase The phase to set
     * @param signedMints The total allowed signed mints
     * @param publicMints The total allowed public mints
     */
    function setPhase(uint16 phase, uint256 signedMints, uint256 publicMints) public {
        _requireCallerIsContractOwner();
        _phase = phase;
        _phaseMints[phase] = signedMints;
        _publicMints[phase] = publicMints;

        emit PhaseSet(phase, signedMints, publicMints);
    }

    /**
     * @notice Set whether to enforce the wallet limit
     * @param enforceWalletLimit Whether to enforce the wallet limit
     */
    function setEnforceWalletLimit(bool enforceWalletLimit) public {
        _requireCallerIsContractOwner();
        _enforceWalletLimit = enforceWalletLimit;

        emit EnforceWalletLimitSet(enforceWalletLimit);
    }

    /**
     * @notice Retrieve the mint funds stored in the contract
     * @dev    Will sweep all ETH sent to the contract.
     */
    function retrieveMintFunds() external {
        _requireCallerIsContractOwner();
        payable(owner()).transfer(address(this).balance);
    }

    /*************************************************************************/
    /*                          Minting Functions                            */
    /*************************************************************************/

    /**
     * @notice Mint public mints, can be called by anyone willing to pay the mint price
     * @param quantity The number of mints to mint
     */
    function publicMint(uint256 quantity) public payable {
        // We expect the following to be true:
        // 1. The current minted supply + the quantity to mint is less than the max supply
        // 2. The remaining public mints for the current phase is greater than or equal to the quantity to mint
        // 3. The msg.value is equal to the base price * the quantity to mint
        // 4. If the wallet limit is enforced, the address has not minted more than the maximum allowed mints per phase
    
        _requireLessThanMaxSupply(mintedSupply() + quantity);

        if (msg.value != _basePrice * quantity) {
            revert Salamels__InvalidPaymentAmount();
        }

        uint16 currentPhase = _phase;
        uint256 remainingPublicMints = _publicMints[currentPhase];

        if (remainingPublicMints < quantity) {
            revert Salamels__PhaseMintsExceeded();
        }

        uint256 addressMintsAfterMint = _publicMintsPerPhase[_msgSender()][currentPhase] + quantity;

        if (_enforceWalletLimit) {
            if (addressMintsAfterMint > MAX_MINTS_PER_ADDRESS_PER_PHASE) {
                revert Salamels__MaxMintsPerAddressPerPhaseExceeded();
            }
        }

        unchecked {
            _publicMints[currentPhase] = remainingPublicMints - quantity;
        }

        _publicMintsPerPhase[_msgSender()][currentPhase] = addressMintsAfterMint;

        (uint256 startTokenId, uint256 endTokenId) = _mintBatch(_msgSender(), quantity);

        emit PublicMintClaimed(_msgSender(), startTokenId, endTokenId);
    }

    /**
     * @notice Mint signed mints, requires a signature from the Salamels backend signer service.
     * @dev    The signature is a composite of the minter's address, the maximum quantity they are allowed to mint, and the price of the mint.
     * @param signature The signature acquired from the Salamels backend signer service
     * @param quantityToMint The number of mints to mint
     * @param maxQuantity The maximum number of mints to mint
     * @param price The mint price
     */
    function claimSignedMint(bytes calldata signature, uint256 quantityToMint, uint256 maxQuantity, uint256 price) external payable {
        // We expect the following to be true:
        // 1. The current minted supply + the quantity to mint is less than or equal to the max supply
        // 2. The msg.value is equal to the provided price * the quantity to mint
        // 3. If the wallet limit is enforced, the address has not minted more than the maximum allowed mints per phase
        // 4. The max quantity is greater than the quantity to mint plus the amount already minted by the address
        // 5. The current phase signed mints remaining is greater than or equal to the quantity to mint
        // 6. The signature is valid for the provided max quantity, price and msg.sender

        _requireLessThanMaxSupply(mintedSupply() + quantityToMint);

        uint16 currentPhase = _phase;
        uint256 currentPhaseMints = _phaseMints[currentPhase];

        uint256 totalAddressMints = _signedMintsPerPhase[_msgSender()][currentPhase] + quantityToMint;

        if (_enforceWalletLimit) {
            if (totalAddressMints > MAX_MINTS_PER_ADDRESS_PER_PHASE) {
                revert Salamels__MaxMintsPerAddressPerPhaseExceeded();
            }
        }

        if (totalAddressMints > maxQuantity) {
            revert Salamels__TotalMintedAmountOverMaxQuantity();
        }

        if (currentPhaseMints < quantityToMint) {
            revert Salamels__PhaseMintsExceeded();
        }

        unchecked {
            _phaseMints[currentPhase] = currentPhaseMints - quantityToMint;
        }

        _signedMintsPerPhase[_msgSender()][currentPhase] = totalAddressMints;

        _claimSignedMint(signature, quantityToMint, maxQuantity, price);
    }

    /*************************************************************************/
    /*                          View Functions                              */
    /*************************************************************************/

    /**
     * @notice Retrieve the token URI for a given token ID
     * @param tokenId The token ID to retrieve the URI for
     * @return The token URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return bytes(baseTokenURI).length > 0
            ? string(abi.encodePacked(baseTokenURI, tokenId.toString(), suffixURI))
            : "";
    }

    /**
     * @notice Retrieve the domain separator for the contract
     * @return domainSeparator The domain separator
     */
    function domainSeparatorV4() external view returns (bytes32 domainSeparator) {
        domainSeparator = _domainSeparatorV4();
    }

    /**
     * @notice Retrieve the current phase
     * @return The current phase
     */
    function getPhase() external view returns (uint16) {
        return _phase;
    }

    /**
     * @notice Retrieve the total allowed signed mints for a given phase
     * @param phase The phase to retrieve the signed mints for
     * @return The total allowed signed mints
     */
    function getPhaseMints(uint16 phase) external view returns (uint256) {
        return _phaseMints[phase];
    }

    /**
     * @notice Retrieve the total allowed public mints for a given phase
     * @param phase The phase to retrieve the public mints for
     * @return The total allowed public mints
     */
    function getPublicMints(uint16 phase) external view returns (uint256) {
        return _publicMints[phase];
    }

    /**
     * @notice Retrieve the number of mints claimed by a given address for a given phase
     * @param user The address to retrieve the mints for
     * @param phase The phase to retrieve the mints for
     * @return The number of mints claimed
     */
    function getPublicMintsPerPhase(address user, uint16 phase) external view returns (uint256) {
        return _publicMintsPerPhase[user][phase];
    }

    /**
     * @notice Retrieve the base price for a mint
     * @return The base price
     */
    function getBasePrice() external view returns (uint256) {
        return _basePrice;
    }

    /**
     * @notice Retrieve the maximum number of mints per address per phase
     * @return The maximum number of mints per address per phase
     */
    function getMaxMintsPerAddressPerPhase() external pure returns (uint256) {
        return MAX_MINTS_PER_ADDRESS_PER_PHASE;
    }

    /**
     * @notice Retrieve whether the wallet limit is enforced
     * @return True if the wallet limit is enforced, false otherwise
     */
    function isMaxWalletLimitEnforced() external view returns (bool) {
        return _enforceWalletLimit;
    }

    /**
     * @notice Mint a token to a given address
     * @param to The address to mint the token to
     * @param tokenId The token ID to mint
     */
    function _mintToken(address to, uint256 tokenId) internal virtual override {
        _mint(to, tokenId);
    }
}