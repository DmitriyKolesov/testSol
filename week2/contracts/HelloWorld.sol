// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    string private text;
    address public owner;

    modifier onlyOwner()
    {
        require (msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier notOwner()
    {
        require (msg.sender != owner, "Caller is the owner");
        _;
    }

    constructor() {
        text = "Hello World";
        owner = msg.sender;
    }

    function helloWorld() public view returns (string memory) {
        return text;
    }

    function setText(string calldata newText) public onlyOwner {
        text = newText;
    }

    function setTextOpen(string calldata newText) public {
        text = newText;
    }

    function setTextNotForOwner(string calldata newText) public notOwner {
        text = newText;
    }


    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}
