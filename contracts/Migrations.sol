pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Migrations
 * @author Truffle Suite (https://truffleframework.com/)
 * @author rjkz808
 *
 *  ███╗   ███╗██╗ ██████╗ ██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗███████╗
 *  ████╗ ████║██║██╔════╝ ██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
 *  ██╔████╔██║██║██║  ███╗██████╔╝███████║   ██║   ██║██║   ██║██╔██╗ ██║███████╗
 *  ██║╚██╔╝██║██║██║   ██║██╔══██╗██╔══██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║
 *  ██║ ╚═╝ ██║██║╚██████╔╝██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║███████║
 *  ╚═╝     ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
 *
 */
contract Migrations is Ownable {
  uint256 public lastCompletedMigration;

  /**
   * @dev Sets the last completed migration
   * @param completed uint256 the completed migration
   */
  function setCompleted(uint256 completed) public onlyOwner {
    lastCompletedMigration = completed;
  }

  /**
   * @dev Updates the new Migration contract
   * @param newAddress address the Migrations contract
   */
  function upgrade(address newAddress) public onlyOwner {
    Migrations upgraded = Migrations(newAddress);
    upgraded.setCompleted(lastCompletedMigration);
  }
}
