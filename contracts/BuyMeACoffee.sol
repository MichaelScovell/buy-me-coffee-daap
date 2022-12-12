// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract BuyMeACoffee {
    // Define an event to emit when a memo (transcation is created)
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Define a struct for our memo
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // Defining a list of all memos
    Memo[] memos;

    // Defining variable for contract deployer (owner)
    address payable owner;

    // Defining a constructor for our contract
    constructor() {
        owner = payable(msg.sender);
    }

    // Defining a function for buying coffee
    function buyCoffee(string memory _name, string memory _message) public payable {
        // Check that the recieved funds for coffee is greater than 0
        require(msg.value > 0, "cant purchase coffee with 0 ETH");

        // Create a new memo if valid amount has been recieved
        // Add the memo to the memo array
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        // Emit a new memo event within the console
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    // Defining a function for withdrawing tips (sending the contract balance to the owner)
    function withdrawTips() public {
        // If the contract address is owner, send the contracts balance (coffee funds to the owner)
        require(owner.send(address(this).balance));
    }

    // Defining a function for obtaining memos stored on the blockchain
    function getMemos() public view returns(Memo[] memory){
        // Return the stored memos
        return memos;

    }

}
