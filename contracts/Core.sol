pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Core is IERC721Full, Ownable {
  using Address for address;
  using SafeMath for uint256;

  IERC20 private _token;

  string private _name = "DDRM";
  string private _symbol = "DDRM";
  uint8 private _decimals = 0;
  bytes4 private _ERC721_RECEIVED = 0x150b7a02;
  bytes4 private _InterfaceId_ERC165 = 0x01ffc9a7;
  bytes4 private _InterfaceId_ERC721 = 0x80ac58cd;
  bytes4 private _InterfaceId_ERC721Enumerable = 0x780e9d63;
  bytes4 private _InterfaceId_ERC721Metadata = 0x5b5e139f;
  uint256[] private _allTokens;

  struct Account {
    uint256[] ownedTokens;
    mapping (address => bool) operator;
  }

  struct Token {
    address owner;
    address approval;
    uint256 ownedTokensIndex;
    uint256 allTokensIndex;
    uint256 endTime;
    string uri;
  }

  mapping (address => Account) private _accounts;
  mapping (uint256 => Token) private _tokens;
  mapping (bytes4 => bool) private _interfaces;
  mapping (bytes4 => uint256) private _prices;

  constructor(IERC20 token) public {
    require(address(token) != address(0));

    _token = token;
    _registerInterface(_InterfaceId_ERC165);
    _registerInterface(_InterfaceId_ERC721);
    _registerInterface(_InterfaceId_ERC721Enumerable);
    _registerInterface(_InterfaceId_ERC721Metadata);
  }

  function name() external view returns (string) {
    return _name;
  }

  function symbol() external view returns (string) {
    return _symbol;
  }

  function tokenURI(uint256 tokenId) external view returns (string) {
    require(_exists(tokenId), "the specified token doesn't exist");

    return _tokens[tokenId].uri;
  }

  function supportsInterface(bytes4 interfaceId)
    external view returns (bool)
  {
    return _interfaces[interfaceId];
  }

  function totalSupply() public view returns (uint256) {
    return _allTokens.length;
  }

  function balanceOf(address owner) public view returns (uint256) {
    require(owner != address(0), "zero address specified as a tokens owner");

    return _accounts[owner].ownedTokens.length;
  }

  function ownerOf(uint256 tokenId) public view returns (address) {
    require(_exists(tokenId), "the specified token doesn't exist");

    return _tokens[tokenId].owner;
  }

  function getApproved(uint256 tokenId) public view returns (address) {
    require(_exists(tokenId), "the specified token doesn't exist");

    return _tokens[tokenId].approval;
  }

  function tokenByIndex(uint256 index) public view returns (uint256) {
    require(index < totalSupply(),
      "the token index should be less than the total tokens supply");

    return _allTokens[index];
  }

  function endTimeOf(uint256 tokenId) public view returns (uint256) {
    require(_exists(tokenId), "the specified token doesn't exist");

    return _tokens[tokenId].endTime;
  }

  function activityPrice(bytes4 activityId) public view returns (uint256) {
    return _prices[activityId];
  }

  function isApprovedForAll(address owner, address operator)
    public view returns (bool)
  {
    return _accounts[owner].operator[operator];
  }

  function tokenOfOwnerByIndex(address owner, uint256 index)
    public view returns (uint256 tokenId)
  {
    require(owner != address(0), "zero address specified as a token owner");
    require(index < balanceOf(owner),
      "the token index should be less than the specified token owner balance");

    return _accounts[owner].ownedTokens[index];
  }

  function _exists(uint256 tokenId) internal view returns (bool) {
    return _tokens[tokenId].owner != address(0);
  }

  function approve(address spender, uint256 tokenId) public {
    require(spender != ownerOf(tokenId),
      "zero address specified as a tokens spender");
    require(
      msg.sender == ownerOf(tokenId) ||
      isApprovedForAll(ownerOf(tokenId), msg.sender),
      "the msg.sender isn't owner or operator of the specified token"
    );

    _tokens[tokenId].approval = spender;
    emit Approval(msg.sender, spender, tokenId);
  }

  function setApprovalForAll(address operator, bool approved) public {
    require(operator != address(0), "zero address specified as an operator");

    _accounts[msg.sender].operator[operator] = approved;
    emit ApprovalForAll(msg.sender, operator, approved);
  }

  function transferFrom(address from, address to, uint256 tokenId) public {
    require(
      msg.sender == ownerOf(tokenId) ||
      msg.sender == getApproved(tokenId) ||
      isApprovedForAll(from, msg.sender),
      "the msg.sender isn't owner, approval or operator of the specified token"
    );

    _clearApproval(tokenId);
    _removeTokenFrom(from, tokenId);
    _addTokenTo(to, tokenId);
    emit Transfer(from, to, tokenId);
  }

  function safeTransferFrom(address from, address to, uint256 tokenId)
    public
  {
    safeTransferFrom(from, to, tokenId, "");
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    bytes data
  )
    public
  {
    transferFrom(from, to, tokenId);
    _callRecipient(from, to, tokenId, data);
  }

  function buyToken(address recipient, bytes4 activityId) public {
    require(recipient != address(0),
      "zero address specified as a token recipient");
    require(
      _token.allowance(msg.sender, address(this)) >= activityPrice(activityId),
      "the msg.sender allowance is less than the specified activity price"
    );

    _token.transferFrom(msg.sender, address(this), activityPrice(activityId));
    _mint(recipient, totalSupply().add(1), block.timestamp.add(30 days));
  }

  function setActivityPrice(bytes4 activityId, uint256 price)
    public onlyOwner
  {
    require(activityId != 0xffffffff, "invalid activity ID specified");

    _prices[activityId] = price;
  }

  function withdraw() public onlyOwner {
    require(_token.balanceOf(address(this)) > 0,
      "the contract doesn't nave funds to send");

    _token.transfer(msg.sender, _token.balanceOf(address(this)));
  }

  function revokeToken(uint256 tokenId) public onlyOwner {
    require(endTimeOf(tokenId) < block.timestamp,
      "the specified token is still valid");

    _clearApproval(tokenId);
    _removeTokenFrom(ownerOf(tokenId), tokenId);
    _addTokenTo(msg.sender, tokenId);
  }

  function _clearApproval(uint256 tokenId) private {
    require(_exists(tokenId), "the specified token doesn't exist");

    Token storage ownedToken = _tokens[tokenId];
    if (ownedToken.approval != address(0))
      ownedToken.approval = address(0);
  }

  function _addTokenTo(address to, uint256 tokenId) private {
    require(to != address(0), "zero address specified as a token recipient");
    require(!_exists(tokenId), "the specified token already exists");

    Account storage recipient = _accounts[to];
    Token storage ownerlessToken = _tokens[tokenId];
    ownerlessToken.owner = to;
    ownerlessToken.ownedTokensIndex = recipient.ownedTokens.length;
    recipient.ownedTokens.push(tokenId);
  }

  function _removeTokenFrom(address from, uint256 tokenId) private {
    require(from == ownerOf(tokenId),
      "the specified address isn't the specified token owner");

    Account storage tokenOwner = _accounts[from];
    Token storage ownedToken = _tokens[tokenId];
    uint256 lastTokenId = tokenOwner.ownedTokens[balanceOf(from).sub(1)];
    Token storage lastToken = _tokens[lastTokenId];
    tokenOwner.ownedTokens[ownedToken.ownedTokensIndex] = lastTokenId;
    tokenOwner.ownedTokens.length = tokenOwner.ownedTokens.length.sub(1);
    lastToken.ownedTokensIndex = ownedToken.ownedTokensIndex;
    ownedToken.ownedTokensIndex = 0;
    ownedToken.owner = address(0);
  }

  function _callRecipient(
    address from,
    address to,
    uint256 tokenId,
    bytes data
  )
    private
  {
    if (to.isContract())
      require(_ERC721_RECEIVED == IERC721Receiver(to).onERC721Received(
        msg.sender,
        from,
        tokenId,
        data
      ), "the specified address cannot receive tokens");
  }

  function _mint(address to, uint256 tokenId, uint256 endTime)
    private
  {
    _addTokenTo(to, tokenId);
    _tokens[tokenId].endTime = endTime;
    _tokens[tokenId].allTokensIndex = _allTokens.length;
    _allTokens.push(tokenId);
    emit Transfer(address(0), to, tokenId);
  }

  function _setTokenURI(uint256 tokenId, string uri) private {
    require(_exists(tokenId), "the specified token doesn't exist");

    Token storage ownedToken = _tokens[tokenId];
    ownedToken.uri = uri;
  }

  function _registerInterface(bytes4 interfaceId) private {
    require(interfaceId != 0xffffffff, "invalid interface ID specified");

    _interfaces[interfaceId] = true;
  }
}
