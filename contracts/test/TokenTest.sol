pragma solidity ^0.4.23;

import '../sections/Token.sol';

contract TokenTest is Token {
    constructor(
        uint256 _totalSupply,
        uint256 _decimals,
        string _symbol,
        string _name
    ) public {
        SUint[keccak256("totalSupply")] = _totalSupply;
        SUint[keccak256("decimals")] = _decimals;
        SString[keccak256("symbol")] = _symbol;
        SString[keccak256("name")] = _name;
        SUint[keccak256("balance", msg.sender)] = _totalSupply;
    }
}
