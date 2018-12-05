pragma solidity ^0.4.24;

contract Migrations {
    address public owner;
    // solium-disable-next-line mixedcase
    uint256 public last_completed_migration;

    modifier restricted() {
        require(msg.sender == owner, "the msg.sender isn't contract owner");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function setCompleted(uint256 completed) public restricted {
        last_completed_migration = completed;
    }

    // solium-disable-next-line mixedcase
    function upgrade(address new_address) public restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}
