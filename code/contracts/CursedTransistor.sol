// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../interfaces/IERC2981.sol";

contract CursedTransistor is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _earlyAdopterCounter;      // Number of early adopters
    Counters.Counter private _specialCounter;           // Number of special tokens
    Counters.Counter private _tokenIds;                 // Token Count for ID

    // Constants
    uint256 public constant maxEarlyMint = 1024;        // Max Early adopters
    uint256 public constant earlyAdoptPrice = 1 ether;  // Early adopted price
    uint256 public constant royaltiesPercentage = 5;    // Percentage of each sale to pay as royalties
    uint256 public constant specialPrefix = 1 << 64;    // Prefix for Special emissions

    // Properties
    uint256 public maxMint = 1024;                      // Max mintable transistors. This can be increased in the future by setMaxMint
    uint256 public mintPrice = 1.6 ether;               // Price for common minting
    address private _royaltiesReceiver;                 // Royality receiver

    // Address of deposit for minting
    address payable public depositAddress = payable(0x08589a0F5FCF62001d59cC671F4fD042548bE138);

    // Address for base API
    string private _baseUrl;

    event SpecialEmitted(address recipient, uint256 tokenId);

    constructor(string memory baseUrl) ERC721("CursedTransistor", "CURTRX") {
      _royaltiesReceiver = depositAddress; // Set deposit address as royality default
      _baseUrl = baseUrl;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUrl;
    }

    function setDepositAddress(address payable to) public onlyOwner {
        depositAddress = to;
    }

    function setClaimPrice(uint256 amount) public onlyOwner {
        mintPrice = amount;
    }

    function setMaxMint(uint256 amount) public onlyOwner {
        maxMint = amount;
    }

    function commonSupply() public view returns(uint256) {
      uint256 earlyAdopter = _earlyAdopterCounter.current();
      uint256 count = _tokenIds.current();
      return count - earlyAdopter;
    }

    function specialSupply() public view returns(uint256) {
      return _specialCounter.current();
    }

    function earlyAdopterSupply() public view returns(uint256) {
      return _earlyAdopterCounter.current();
    }

    function airdrop(address payable[] memory receivers) public onlyOwner {
      for(uint i = 0; i < receivers.length; i++)  {
        if (earlyAdopterSupply() < maxEarlyMint) {
            claimEarly(receivers[i]);
        } else {
            claimNormal(receivers[i]);
        }
      }
    }

    function claim() public payable {
      if (earlyAdopterSupply() < maxEarlyMint) { // Will receive early adopter
        require(msg.value == earlyAdoptPrice, "Invalid amount");
        depositAddress.transfer(earlyAdoptPrice);
        claimEarly(msg.sender);
      } else { // Common Mint
        require(msg.value == mintPrice, "Invalid amount");
        require(commonSupply() < maxMint, "Maximum mintable cursed transistors (for now). Wait for news...");
        depositAddress.transfer(mintPrice);
        claimNormal(msg.sender);
      }
    }

    // For events, flags and livestream airdrops
    function sendSpecial(address to) public onlyOwner returns(uint256) {
      _specialCounter.increment();
      uint256 id = specialPrefix + _specialCounter.current();
      _safeMint(to, id);
      emit SpecialEmitted(to, id);
      return id;
    }

    // Early Adopter claims
    function claimEarly(address sender) private returns(uint256) {
      _earlyAdopterCounter.increment();
      return claimNormal(sender);
    }

    // Normal claims
    function claimNormal(address sender) private returns(uint256) {
      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _safeMint(sender, id);
      return id;
    }

    // IERC2981 - Royalities
    /// @notice Getter function for _royaltiesReceiver
    /// @return the address of the royalties recipient
    function royaltiesReceiver() external view returns(address) {
        return _royaltiesReceiver;
    }

    /// @notice Changes the royalties' recipient address (in case rights are transferred for instance)
    /// @param newRoyaltiesReceiver - address of the new royalties recipient
    function setRoyaltiesReceiver(address newRoyaltiesReceiver) external onlyOwner {
        require(newRoyaltiesReceiver != _royaltiesReceiver); // dev: Same address
        _royaltiesReceiver = newRoyaltiesReceiver;
    }

    /// @notice Called with the sale price to determine how much royalty
    //          is owed and to whom.
    /// @param _tokenId - the NFT asset queried for royalty information
    /// @param _salePrice - sale price of the NFT asset specified by _tokenId
    /// @return receiver - address of who should be sent the royalty payment
    /// @return royaltyAmount - the royalty payment amount for _value sale price
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view returns (address receiver, uint256 royaltyAmount) {
        uint256 _royalties = (_salePrice * royaltiesPercentage) / 100;
        return (_royaltiesReceiver, _royalties);
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
}