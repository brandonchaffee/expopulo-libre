pragma solidity ^0.4.23;

import "../sections/Moderation.sol";

contract ModerationTest is Moderation {
    constructor(
        address _responder,
        bytes _qHash,
        bytes _rHash,
        bytes _rTypeTwo,
        string _community,
        uint256 _typeA,
        uint256 _typeB,
        uint256 _staked,
        uint256 _disbursed,
        uint256 _window,
        uint256 _modDeposit,
        uint256 _modLockout
    ) public {
        SBool[keccak256(_rHash, "responseTo", _qHash)] = true;
        SAddress[keccak256(_rHash, "owner")] = _responder;
        SString[keccak256(_qHash, "community")] = _community;
        SUint[keccak256(_qHash,"totalStaked")] = _staked;
        SUint[keccak256(_rTypeTwo,"totalDisbursed")] = _disbursed;
        SBool[keccak256("challenge", _typeA)] = true;
        SBool[keccak256("challenge", _typeB)] = true;
        SUint[keccak256("moderationWindow")] = _window;
        SUint[keccak256("moderatorDeposit")] = _modDeposit;
        SUint[keccak256("moderatorDepositLockout")] = _modLockout;
    }

    function setBalance(address _target, uint256 _amount) public {
        SUint[keccak256("balance", _target)] = _amount;
    }

    function getCDepositOf(bytes _rHash, uint256 _type, address _target)
    public view returns(uint256){
        return SUint[keccak256(_rHash, "CDeposit", _type,  _target)];
    }

    function getTotalCDeposit(bytes _rHash, uint256 _type)
    public view returns(uint256){
        return SUint[keccak256(_rHash, "CDepositTotal", _type)];
    }

    function getADepositOf(bytes _rHash, uint256 _type, address _target)
    public view returns(uint256){
        return SUint[keccak256(_rHash, "ADeposit", _type,  _target)];
    }

    function getTotalADeposit(bytes _rHash, uint256 _type)
    public view returns(uint256){
        return SUint[keccak256(_rHash, "ADepositTotal", _type)];
    }

    function getModerationWindow(bytes _hash, uint256 _type)
    public view returns(uint256){
        return SUint[keccak256(_hash, "moderationWindow", _type)];
    }

    function getResInvalidity(bytes _rHash, uint256 _type)
    public view returns(bool){
        return SBool[keccak256(_rHash, "isInvalid", _type)];
    }

    function balanceOf(address owner) public view returns (uint256) {
		return SUint[keccak256("balance", owner)];
	}


}
