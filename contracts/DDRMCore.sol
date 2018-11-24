pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title DDRMCore
 * @author rjkz808
 * @dev The DDRM application core contract
 *
 *  ██████╗ ██████╗ ██████╗ ███╗   ███╗
 *  ██╔══██╗██╔══██╗██╔══██╗████╗ ████║
 *  ██║  ██║██║  ██║██████╔╝██╔████╔██║
 *  ██║  ██║██║  ██║██╔══██╗██║╚██╔╝██║
 *  ██████╔╝██████╔╝██║  ██║██║ ╚═╝ ██║
 *  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝
 *
 */
contract DDRMCore is IERC721Full, Ownable {
  using Address for address;
  using SafeMath for uint256;

  IERC20 private _token;

  string private _name = "DDRM";
  string private _symbol = "DDRM";
  bytes4 private _onERC721Received = 0x150b7a02;
  bytes4 private _interfaceIdERC165 = 0x01ffc9a7;
  bytes4 private _interfaceIdERC721 = 0x80ac58cd;
  bytes4 private _interfaceIdERC721Enumerable = 0x780e9d63;
  bytes4 private _interfaceIdERC721Metadata = 0x5b5e139f;
  uint256[] private _allTokens;

  struct Account {
    uint256[] ownedTokens;
    mapping (address => bool) operator;
  }

  struct Token {
    address owner;
    address approval;
    bytes4 asset;
    string uri;
    uint256 ownedTokensIndex;
    uint256 allTokensIndex;
    uint256 endTime;
  }

  mapping (address => Account) private _accounts;
  mapping (uint256 => Token) private _tokens;
  mapping (bytes4 => bool) private _interfaces;
  mapping (bytes4 => uint256) private _prices;

  /**
   * @dev Constructor sets the ERC20 token instance and registers the ERC165
   * implemented interfaces
   * @param token IERC20 the ERC20 token contract
   */
  constructor(IERC20 token) public {
    require(address(token) != address(0));

    _token = token;
    _registerInterface(_interfaceIdERC165);
    _registerInterface(_interfaceIdERC721);
    _registerInterface(_interfaceIdERC721Enumerable);
    _registerInterface(_interfaceIdERC721Metadata);
  }

  /**
   * @dev Gets the token name
   * @return string the token name
   */
  function name() external view returns (string) {
    return _name;
  }

  /**
   * @dev Gets the token short code
   * @return string the token symbol
   */
  function symbol() external view returns (string) {
    return _symbol;
  }

  /**
   * @dev Gets the specified token URI
   * @param tokenId uint256 ID of the token to query the URI of
   * @return string the token URI
   */
  function tokenURI(uint256 tokenId) external view returns (string) {
    require(_exists(tokenId), "the specified token doesn't exist");

    return _tokens[tokenId].uri;
  }

  /**
   * @dev Gets the contract interface implementation state
   * @param interfaceId bytes4 ERC615 ID of the interface to query the
   * implementation state of
   * @return bool `true` if implements, `false` otherwise
   */
  function supportsInterface(bytes4 interfaceId)
    external view returns (bool)
  {
    return _interfaces[interfaceId];
  }

  /**
   * @dev Gets the total issued tokens amount
   * @return uint256 the total tokens supply
   */
  function totalSupply() public view returns (uint256) {
    return _allTokens.length;
  }

  /**
   * @dev Gets the contract ERC20 token instance
   * @return IERC20 tht ERC20 token instance
   */
  function token() public view returns (IERC20) {
    return _token;
  }

  /**
   * @dev Gets an account tokens balance
   * @param owner address an account to query the balance of
   * @return uint256 the account owned tokens amount
   */
  function balanceOf(address owner) public view returns (uint256) {
    require(owner != address(0), "zero address specified as a tokens owner");

    return _accounts[owner].ownedTokens.length;
  }

  /**
   * @dev Gets the specified token owner address
   * @param tokenId uint256 ID of the token to query the owner of
   * @return address the token owner
   */
  function ownerOf(uint256 tokenId) public view returns (address) {
    require(_exists(tokenId), "the specified token doesn't exist");

    return _tokens[tokenId].owner;
  }

  /**
   * @dev Gets the specified token approved address
   * @param tokenId uint256 ID of the token to query the approval of
   * @return address the token approval
   */
  function getApproved(uint256 tokenId) public view returns (address) {
    require(_exists(tokenId), "the specified token doesn't exist");

    return _tokens[tokenId].approval;
  }

  /**
   * @dev Gets the specified token end time
   * @param tokenId uint256 ID of the token to query the end time of
   * @return uint256 the token end time
   */
  function endTimeOf(uint256 tokenId) public view returns (uint256) {
    require(_exists(tokenId), "the specified token doesn't exist");

    return _tokens[tokenId].endTime;
  }

  /**
   * @dev Gets the specified token asset
   * @param tokenId uint256 ID of the token to query the asset of
   * @return bytes4 ID of the asset to wich the token is attached
   */
  function assetOf(uint256 tokenId) public view returns (bytes4) {
    require(_exists(tokenId), "the specified token doesn't exist");

    return _tokens[tokenId].asset;
  }

  /**
   * @dev Gets the token ID that is at the specified index in the allTokens
   * array
   * @param index uint256 the ownedTokens array index
   * @return uint256 ID of the token that is at the specified index in the
   * allTokens array
   */
  function tokenByIndex(uint256 index) public view returns (uint256) {
    // solium-disable-next-line indentation
    require(index < totalSupply(),
      "the token index should be less than the total tokens supply");

    return _allTokens[index];
  }

  /**
   * @dev Gets the specified asset price
   * @param assetId bytes4 ID of the asset to query the price of
   * @return uint256 the asset price
   */
  function assetPrice(bytes4 assetId) public view returns (uint256) {
    return _prices[assetId];
  }

  /**
   * @dev Get the specified accounts operator approval state
   * @param owner address the tokens owner
   * @param operator address the tokens operator
   * @return bool `true` if exists, `false` otherwise
   */
  function isApprovedForAll(address owner, address operator)
    public view returns (bool)
  {
    return _accounts[owner].operator[operator];
  }

  /**
   * @dev Gets the token ID that is at the specified index in the specified
   * account ownedTokens array
   * @param owner address the token owner
   * @param index uint256 index of the token in the ownedTokens array
   * @return uint256 ID of the token that is at the specified index in the
   * ownedTokens array
   */
  function tokenOfOwnerByIndex(address owner, uint256 index)
    public view returns (uint256)
  {
    require(owner != address(0), "zero address specified as a token owner");
    // solium-disable-next-line indentation
    require(index < balanceOf(owner),
      "the token index should be less than the specified token owner balance");

    return _accounts[owner].ownedTokens[index];
  }

  /**
   * @dev Approves an account to spend the specified token
   * @param spender address the tokens spender
   * @param tokenId uint256 ID of the token to be approved
   */
  function approve(address spender, uint256 tokenId) public {
    // solium-disable-next-line indentation
    require(spender != ownerOf(tokenId),
      "the msg.sender cannot be the owned token approval");
    require(
      msg.sender == ownerOf(tokenId) ||
      isApprovedForAll(ownerOf(tokenId), msg.sender),
      "the msg.sender isn't owner or operator of the specified token"
    );

    _tokens[tokenId].approval = spender;
    emit Approval(ownerOf(tokenId), spender, tokenId);
  }

  /**
   * @dev Allowed the specified operator to spend the owned tokens
   * @param operator address the tokens operator
   * @param approved bool the operator approval state
   */
  function setApprovalForAll(address operator, bool approved) public {
    require(operator != address(0), "zero address specified as an operator");

    _accounts[msg.sender].operator[operator] = approved;
    emit ApprovalForAll(msg.sender, operator, approved);
  }

  /**
   * @dev Transfers the specified spending tokens amount to an account
   * @param from address the tokens owner
   * @param to address the tokens recipient
   * @param tokenId uint256 ID of the token to be transferred
   */
  function transferFrom(address from, address to, uint256 tokenId) public {
    require(
      // solium-disable-next-line operator-whitespace
      msg.sender == ownerOf(tokenId) ||
      // solium-disable-next-line operator-whitespace
      msg.sender == getApproved(tokenId) ||
      isApprovedForAll(from, msg.sender),
      "the msg.sender isn't owner, approval or operator of the specified token"
    );

    _clearApproval(tokenId);
    _removeTokenFrom(from, tokenId);
    _addTokenTo(to, tokenId);
    emit Transfer(from, to, tokenId);
  }

  /**
   * @dev Transfers the specified spending tokens amount to an account. If the
   * tokens recipient is a contract calls the onERC721Received function
   * @param from address the tokens owner
   * @param to address the tokens recipient
   * @param tokenId uint256 ID of the token to be transferred
   */
  function safeTransferFrom(address from, address to, uint256 tokenId)
    public
  {
    safeTransferFrom(from, to, tokenId, "");
  }

  /**
   * @dev Transfers the specified spending tokens amount to an account. If the
   * tokens recipient is a contract calls the onERC721Received function
   * @param from address the tokens owner
   * @param to address the tokens recipient
   * @param tokenId uint256 ID of the token to be transferred
   * @param data bytes the transaction metadata
   */
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

  /**
   * @dev Function to buy the specified asset token
   * @param recipient address the token recipient
   * @param assetId bytes4 ID of the asset to buy the token of
   */
  function buyToken(address recipient, bytes4 assetId) public {
    // solium-disable-next-line indentation
    require(recipient != address(0),
      "zero address specified as a token recipient");
    require(
      _token.allowance(msg.sender, address(this)) >= assetPrice(assetId),
      "the msg.sender allowance is less than the specified asset price"
    );

    _token.transferFrom(msg.sender, address(this), assetPrice(assetId));
    _mint(
      recipient,
      assetId,
      totalSupply().add(1),
      block.timestamp.add(30 days)
    );
  }

  /**
   * @dev Transfers tokens earned for the assets sale to the contract owner
   */
  function withdraw() public onlyOwner {
    // solium-disable-next-line indentation
    require(_token.balanceOf(address(this)) > 0,
      "the contract doesn't nave funds to send");

    _token.transfer(owner(), _token.balanceOf(address(this)));
  }

  /**
   * @dev Transfers the specified expired token to the contract owner
   * @param tokenId uint256 ID of the token to be revoked
   */
  function revokeToken(uint256 tokenId) public onlyOwner {
    // solium-disable-next-line indentation
    require(endTimeOf(tokenId) < block.timestamp,
      "the specified token is still valid");

    address tokenOwner = ownerOf(tokenId);
    _clearApproval(tokenId);
    _removeTokenFrom(tokenOwner, tokenId);
    _addTokenTo(owner(), tokenId);
    emit Transfer(tokenOwner, owner(), tokenId);
  }

  /**
   * @dev Sets the specified asset price
   * @param assetId bytes4 ID of the asset to set the price of
   * @param price uint256 price of the specified asset
   */
  function setAssetPrice(bytes4 assetId, uint256 price)
    public onlyOwner
  {
    require(assetId != 0xffffffff, "invalid asset ID specified");

    _prices[assetId] = price;
  }

  /**
   * @dev Internal function that gets the specified token existence
   * @param tokenId uint256 ID of the token to query the existence of
   * @return bool `true` if the token exists, `false` otherwise
   */
  function _exists(uint256 tokenId) internal view returns (bool) {
    return _tokens[tokenId].owner != address(0);
  }

  /**
   * @dev Private function that clears an approval of the specified token
   * @param tokenId uint256 ID of the token to clear the approval of
   */
  function _clearApproval(uint256 tokenId) private {
    require(_exists(tokenId), "the specified token doesn't exist");

    Token storage ownedToken = _tokens[tokenId];
    if (ownedToken.approval != address(0))
      ownedToken.approval = address(0);
  }

  /**
   * @dev Private function that adds the specified token to an account
   * @param to address the token recipient
   * @param tokenId uint256 ID of the token to be added
   */
  function _addTokenTo(address to, uint256 tokenId) private {
    require(to != address(0), "zero address specified as a token recipient");
    require(!_exists(tokenId), "the specified token already exists");

    Account storage recipient = _accounts[to];
    Token storage ownerlessToken = _tokens[tokenId];
    ownerlessToken.owner = to;
    ownerlessToken.ownedTokensIndex = recipient.ownedTokens.length;
    recipient.ownedTokens.push(tokenId);
  }

  /**
   * @dev Private function that removes the specified token from an account
   * @param from address the token owner
   * @param tokenId uint256 ID of the token to be removed
   */
  function _removeTokenFrom(address from, uint256 tokenId) private {
    // solium-disable-next-line indentation
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

  /**
   * @dev Private function that calls the contract recipient
   * `onERC721Received` function and checks that the return value is equal to
   * the _onERC721Received value
   * @param from address the token owner
   * @param to address the token recipient
   * @param tokenId uint256 ID of the tokens to be transferred
   * @param data bytes the transaction metadata
   */
  function _callRecipient(
    address from,
    address to,
    uint256 tokenId,
    bytes data
  )
    private
  {
    if (to.isContract())
      // solium-disable-next-line indentation
      require(_onERC721Received == IERC721Receiver(to).onERC721Received(
        msg.sender,
        from,
        tokenId,
        data
      // solium-disable-next-line indentation
      ), "the specified address cannot receive tokens");
  }

  /**
   * @dev Private function that emits the token and sends it to the specified
   * account
   * @param to address the token recipient
   * @param assetId bytes4 ID of the asset to wich the token is attached
   * @param tokenId uint256 ID of the token to be emitted
   * @param endTime uint256 the token end time
   */
  function _mint(address to, bytes4 assetId, uint256 tokenId, uint256 endTime)
    private
  {
    _addTokenTo(to, tokenId);
    _tokens[tokenId].asset = assetId;
    _tokens[tokenId].endTime = endTime;
    _tokens[tokenId].allTokensIndex = _allTokens.length;
    _allTokens.push(tokenId);
    emit Transfer(address(0), to, tokenId);
  }

  /**
   * @dev Private function that sets the specified token URI
   * @param tokenId uint256 ID of the token to set the URI of
   * @param uri string the token URI
   */
  function _setTokenURI(uint256 tokenId, string uri) private {
    require(_exists(tokenId), "the specified token doesn't exist");

    Token storage ownedToken = _tokens[tokenId];
    ownedToken.uri = uri;
  }

  /**
   * @dev Private function that registers the specified ERC165 interface
   * @param interfaceId bytes4 ID of the interface to register the
   * implementation of
   */
  function _registerInterface(bytes4 interfaceId) private {
    require(interfaceId != 0xffffffff, "invalid interface ID specified");

    _interfaces[interfaceId] = true;
  }
}
