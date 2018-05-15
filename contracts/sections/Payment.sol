pragma solidity ^0.4.23;

import '../imports/Escrow.sol';
import '../imports/EternalStorage.sol';

contract Payment is Escrow {

	modifier initialized(bytes _hash) {
		require(SAddress[keccak256(_hash, "owner")] != address(0));
		_;
	}

	modifier validResponse(bytes _rHash) {
        require(!SBool[keccak256(_rHash, "isInvalid")]);
        _;
 	}
 
	modifier isOwner(bytes _hash) {
		require(msg.sender == SAddress[keccak256(_hash, "owner")]);
		_;
	}

	modifier outEscrowWindow(bytes _hash, address _disburser) {
		require(now >= SUint[keccak256(_hash,"escrowWindow", _disburser)]);
		_;
	}

	function stakeBounty(bytes _qHash, uint256 _amount) 
		initialized(_qHash) 
	public {
		require(hasSufficientBalance(_amount));

		SUint[keccak256(_qHash, "totalStaked")] =
		SUint[keccak256(_qHash, "totalStaked")].add(_amount);
		SUint[keccak256(_qHash, "stakeOf", msg.sender)] =
		SUint[keccak256(_qHash, "stakeOf", msg.sender)].add(_amount);
		withdrawFrom(_amount, msg.sender);
	}

	function disburseBounty(bytes _qHash, bytes _rHash, uint256 _amount)
		initialized(_qHash)
		initialized(_rHash)
		validResponse(_rHash)
	public {
		require(_amount <= SUint[keccak256(_qHash, "stakeOf", msg.sender)]);
		SUint[keccak256(_qHash, "totalStaked")] =
		SUint[keccak256(_qHash, "totalStaked")].sub(_amount);
		SUint[keccak256(_qHash, "stakeOf", msg.sender)] =
		SUint[keccak256(_qHash, "stakeOf", msg.sender)].sub(_amount);
		SUint[keccak256(_rHash, "disbursementOf", msg.sender)] =
		SUint[keccak256(_rHash, "disbursementOf", msg.sender)].add(_amount);
		SUint[keccak256(_rHash, "totalDisbursed")] =
		SUint[keccak256(_rHash, "totalDisbursed")].add(_amount);
		SUint[keccak256(_rHash, "escrowWindow", msg.sender)] = now.add(
		SUint[keccak256(_rHash, "paymentLockout")]);
	}

	function retrieveBounty(bytes _rHash, address _disburser)
		initialized(_rHash) 
		validResponse(_rHash) 
		isOwner(_rHash)
		outEscrowWindow(_rHash, _disburser)
	public {
		uint256 _amount = SUint[keccak256(_rHash, "disbursementOf", 
			_disburser)];

		SUint[keccak256(_rHash, "disbursementOf", _disburser)] =
		SUint[keccak256(_rHash, "disbursementOf", _disburser)].sub(_amount);

		depositTo(_amount, msg.sender);
	}

	function recallDistribution(bytes _qHash, bytes _rHash)
		initialized(_qHash)
		initialized(_rHash)
	public {
		uint256 _amount = SUint[keccak256(_rHash, "disbursementOf", msg.sender)];

		SUint[keccak256(_rHash, "disbursementOf", msg.sender)] =
		SUint[keccak256(_rHash, "disbursementOf", msg.sender)].sub(_amount);

		SUint[keccak256(_qHash, "stakeOf", msg.sender)] =
		SUint[keccak256(_qHash, "stakeOf", msg.sender)].add(_amount);		
	}
}