pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";

contract ERC721Receiver is IERC721Receiver {
  function onERC721Received(
    address operator,
    address from,
    uint256 tokenId,
    bytes data
  )
    public
    returns (bytes4)
  {
    return this.onERC721Received.selector;
  }
}
