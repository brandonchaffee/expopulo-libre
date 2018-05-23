pragma solidity ^0.4.23;

import './sections/Content.sol';
import './sections/Payment.sol';
import './sections/Moderation.sol';
import './sections/Token.sol';

contract LogicContainer is Content, Payment, Moderation, Token {
    constructor(
        uint256 _totalSupply,
        uint256 _decimals,
        string _symbol,
        string _name,
        uint256 _paymentLockout
    ) public {
        /* SUint[keccak256("totalSupply")] = _totalSupply;
        SUint[keccak256("decimals")] = _decimals;
        SString[keccak256("symbol")] = _symbol;
        SString[keccak256("name")] = _name;
        SUint[keccak256("balance", msg.sender)] = _totalSupply;
        SUint[keccak256("paymentLockout")] = _paymentLockout; */
        SUint[keccak256("totalSupply")] = 50000000;
        SUint[keccak256("decimals")] = 2;
        SString[keccak256("symbol")] = "GO";
        SString[keccak256("name")] = "Gopher";
        SUint[keccak256("balance", msg.sender)] = 50000000;
        SUint[keccak256("paymentLockout")] = 10000;
    }

    function getSUInt(bytes32 _hash) public view returns(uint256){
        return SUint[_hash];
    }
    function getSString(bytes32 _hash) public view returns(string){
        return SString[_hash];
    }
    function getSAddress(bytes32 _hash) public view returns(address){
        return SAddress[_hash];
    }
    function getSBytes(bytes32 _hash) public view returns(bytes){
        return SBytes[_hash];
    }
    function getSBool(bytes32 _hash) public view returns(bool){
        return SBool[_hash];
    }
    function getSInt(bytes32 _hash) public view returns(int256){
        return SInt[_hash];
    }
}
