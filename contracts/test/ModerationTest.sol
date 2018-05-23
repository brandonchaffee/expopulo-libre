pragma solidity ^0.4.23;

import '../sections/Moderation.sol';

contract ModerationTest is Moderation {
    constructor(
        address _creator,
        address _responder,
        address _modA,
        address _modB,
        address _modC,
        address _spenderA,
        address _spenderB,
        bytes _qHash,
        bytes _rHash,
        uint256 _balance,
        string _community,
        uint256 _typeA,
        uint256 _typeB
    ) public {
        SBool[keccak256(_rHash, "responseTo", _qHash)] = true;
        SAddress[keccak256(_rHash, "owner")] = _responder;
        SUint[keccak256("balance", _creator)] = _balance;
        SUint[keccak256("balance", _responder)] = _balance;
        SUint[keccak256("balance", _modA)] = _balance;
        /* SUint[keccak256("balance", _modB)] = _balance;
        SUint[keccak256("balance", _modC)] = _balance;
        SUint[keccak256("balance", _nonMod)] = _balance;
        SUint[keccak256("balance", _modB)] = _balance;
        SUint[keccak256("balance", _spenderA)] = _balance;
        SUint[keccak256("balance", _spenderB)] = _balance;
        SString[keccak256(_qHash, "community")] = _community;
        SUint[keccak256(_qHash,"totalStaked")] = 300;
        SBool[keccak256("challenge", _typeA)] = true;
        SBool[keccak256("challenge", _typeB)] = true; */
    }
}
