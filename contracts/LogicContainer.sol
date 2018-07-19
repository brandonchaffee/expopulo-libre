pragma solidity ^0.4.23;

import "./sections/Content.sol";
import "./sections/Payment.sol";
import "./sections/Moderation.sol";
import "./sections/Token.sol";

contract LogicContainer is Content, Payment, Moderation, Token {
    constructor(
        uint256 _totalSupply,
        uint256 _decimals,
        string _symbol,
        string _name,
        uint256 _paymentLockout
    ) public {
        SUint[keccak256("totalSupply")] = _totalSupply;
        SUint[keccak256("decimals")] = _decimals;
        SString[keccak256("symbol")] = _symbol;
        SString[keccak256("name")] = _name;
        SUint[keccak256("balance", msg.sender)] = _totalSupply;
        SUint[keccak256("paymentLockout")] = _paymentLockout;
    }
}
