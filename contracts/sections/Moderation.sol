pragma solidity ^0.4.23;

import "../imports/Escrow.sol";

contract Moderation is Escrow {

	modifier initialized(bytes _hash) {
		require(SAddress[keccak256(_hash, "owner")] != address(0));
		_;
	}

	modifier validChallengeType(uint256 _type){
		require(SBool[keccak256("challenge", _type)]);
		_;
	}

	function isModerator(string _community) public view returns(bool){
		return SBool[keccak256(_community, msg.sender)];
	}

	modifier inModerationWindow(bytes _hash, uint256 _type){
		require(now <= SUint[keccak256(_hash, "moderationWindow", _type)]);
		_;
	}

	modifier outModerationWindow(bytes _hash, uint256 _type){
		require(now > SUint[keccak256(_hash, "moderationWindow", _type)]);
		_;
	}

	function extendModerationWindow(bytes _hash, uint256 _type)
	internal {
		SUint[keccak256(_hash, "moderationWindow", _type)] = now.add(
		SUint[keccak256("moderationWindow")]);
	}

	function getChallengeTypeDefinition(uint256 _type)
	public view returns(string){
		return SString[keccak256("challenge",_type, "definition")];
	}

	function challenge(
		bytes _qHash,
		bytes _rHash,
		uint256 _deposit,
		uint256 _type
	)
		initialized(_rHash)
		validChallengeType(_type)
	public {
	    uint256 needed;
		if(_type == 1){
			needed = SUint[keccak256(_qHash,"totalStaked")].div(100);
		} else {
		    needed = SUint[keccak256(_rHash,"totalDisbursed")].div(100);
		}
		require(SBool[keccak256(_rHash, "responseTo", _qHash)]);
		require(!SBool[keccak256(_rHash, "challenged", _type)]);
		require(hasSufficientBalance(_deposit));
		require(needed >= SUint[keccak256(_rHash, "CDepositTotal",_type)].add(
			_deposit));

		withdrawFrom(_deposit, msg.sender);
		SUint[keccak256(_rHash, "CDeposit", _type,  msg.sender)] = _deposit;

		SUint[keccak256(_rHash, "CDepositTotal", _type)] = SUint[keccak256(
			_rHash, "CDepositTotal", _type)].add(_deposit);

		SBool[keccak256(_rHash, "challenged", _type)] = needed == SUint[
			keccak256(_rHash, "CDepositTotal", _type)];

		if(SBool[keccak256(_rHash, "challenged", _type)]){
			extendModerationWindow(_rHash, _type);
			SBool[keccak256(_rHash, "isInvalid", _type)] = true;
		}
	}

	function challengeDepositNeeded(bytes _qHash, bytes _rHash, uint256 _type)
	public view returns(uint) {
	    uint256 needed;
		if(_type == 1){
			needed = SUint[keccak256(_qHash,"totalStaked")].div(100);
		} else {
			needed = SUint[keccak256(_rHash,"totalDisbursed")].div(100);
		}
		return needed.sub(
			SUint[keccak256(_rHash, "CDepositTotal", _type)]);
	}

	function affirm(bytes _rHash, uint256 _deposit, uint256 _type)
		initialized(_rHash)
		inModerationWindow(_rHash, _type)
	public {
		uint256 needed = SUint[keccak256(_rHash, "CDepositTotal",
			_type)];
		require(SBool[keccak256(_rHash, "challenged", _type)]);
		require(hasSufficientBalance(_deposit));
		require(needed >= SUint[keccak256(_rHash, "ADepositTotal",
			_type)].add(_deposit));

		withdrawFrom(_deposit, msg.sender);
		SUint[keccak256(_rHash, "ADeposit", _type,  msg.sender)] =
			_deposit;

		SUint[keccak256(_rHash, "ADepositTotal", _type)] =
			SUint[keccak256(_rHash, "ADepositTotal", _type)].add(_deposit);

		SBool[keccak256(_rHash, "affirmed", _type)] = needed ==
			SUint[keccak256(_rHash, "ADepositTotal", _type)];

		if(SBool[keccak256(_rHash, "affirmed", _type)]){
			extendModerationWindow(_rHash, _type);
		}
	}

	function affirmDepositNeeded(bytes _rHash, uint256 _type)
	public view returns(uint) {
		uint256 needed = SUint[keccak256(_rHash, "CDepositTotal",
			_type)];
		return needed.sub(SUint[keccak256(_rHash, "ADepositTotal",
			_type)]);
	}

	//Moderation Functions
	function moderateObject(
		bytes _qHash,
		bytes _rHash,
		uint256 _type,
		bool _isValid
	)
		initialized(_rHash)
		inModerationWindow(_rHash, _type)
	public {
		require(SBool[keccak256(_rHash, "responseTo", _qHash)]);
		require(isModerator(SString[keccak256(_qHash, "community")]));
		require(!SBool[keccak256(_rHash, "hasModerated", _type, msg.sender)]);
		if(_isValid){
			SUint[keccak256(_rHash, "validCount", _type)] =
				SUint[keccak256(_rHash, "validCount", _type)].add(1);
		} else {
			SUint[keccak256(_rHash, "invalidCount", _type)] =
				SUint[keccak256(_rHash, "invalidCount", _type)].add(1);
		}
		SBool[keccak256(_rHash, "hasModerated", _type, msg.sender)] = true;
		SBool[keccak256(_rHash, "isInvalid", _type)] =
			SUint[keccak256(_rHash, "validCount", _type)] <
			SUint[keccak256(_rHash, "invalidCount", _type)];
	}

	function retrieveModerationDeposit(bytes _rHash, uint256 _type)
		initialized(_rHash)
		outModerationWindow(_rHash, _type)
	public {
		if(SBool[keccak256(_rHash, "isInvalid", _type)]) {
			require(!SBool[keccak256(_rHash, "CDepositCollected",
				_type, msg.sender)]);
			depositTo(SUint[keccak256(_rHash, "CDeposit", _type,
				msg.sender)], msg.sender);
			SBool[keccak256(_rHash, "CDepositCollected",_type,
				msg.sender)] = true;
		} else {
			require(!SBool[keccak256(_rHash, "ADepositCollected",
				_type, msg.sender)]);
			depositTo(SUint[keccak256(_rHash, "ADeposit", _type,
				msg.sender)], msg.sender);
			SBool[keccak256(_rHash, "ADepositCollected",_type,
				msg.sender)] = true;
		}
	}

	function collectModerationPayment(bytes _rHash, uint256 _type)
		initialized(_rHash)
		outModerationWindow(_rHash, _type)
	public {
		require(SBool[keccak256(_rHash, "hasModerated", _type, msg.sender)]);
		require(!SBool[keccak256(_rHash, "paymentCollected", _type,
			msg.sender)]);

		uint256 depositTotal = SUint[keccak256(_rHash, "CDepositTotal",
			_type)];
		uint256 moderators = SUint[keccak256(_rHash, "validCount", _type)].add(
			SUint[keccak256(_rHash, "invalidCount", _type)]);

		depositTo(depositTotal.div(moderators), msg.sender);
		SBool[keccak256(_rHash, "paymentCollected", _type, msg.sender)] = true;
	}



	// function collectModerationBounty(
	// 	bytes _qHash,
	// 	bytes _rHash,
	// 	uint256 _type,
	// 	address _staker
	// )
	// public {

	// }

	function activateModerator(string _community)
	public {
		uint256 _deposit = SUint[keccak256("moderatorDeposit")];
		require(!SBool[keccak256(_community, msg.sender)]);
		require(now > SUint[keccak256("moderatorDepositLockout")].add(
			SUint[keccak256(_community, msg.sender, "activatedAt")]));
		require(hasSufficientBalance(_deposit));

		withdrawFrom(_deposit, msg.sender);
		SBool[keccak256(_community, msg.sender)] = true;
		SUint[keccak256(_community, msg.sender, "activatedAt")] = now.add(
			 SUint[keccak256("moderatorDepositLockout")]);
	}

	function deactivateModerator(string _community)
	public {
		require(SBool[keccak256(_community, msg.sender)]);
		depositTo(SUint[keccak256("moderatorDeposit")], msg.sender);
		SBool[keccak256(_community, msg.sender)] = false;
	}
}
