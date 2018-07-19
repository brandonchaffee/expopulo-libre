pragma solidity ^0.4.23;

import "../imports/Escrow.sol";
import "../imports/EternalStorage.sol";

contract Payment is Escrow {

	// Ps1 (Payment Appendix)
	modifier initialized(bytes32 _hash) {
		require(SAddress[keccak256(_hash, "owner")] != address(0));
		_;
	}

	// Ps2 (Payment Appendix)
	modifier validResponse(bytes32 _rHash) {
        require(!SBool[keccak256(_rHash, "isInvalid")]);
        _;
 	}

	// Ps3 (Payment Appendix)
	modifier isOwner(bytes32 _hash) {
		require(msg.sender == SAddress[keccak256(_hash, "owner")]);
		_;
	}

	// Ps4 (Payment Appendix)
	modifier outEscrowWindow(bytes32 _hash, address _disburser) {
		require(now >= SUint[keccak256(_hash,"escrowWindow", _disburser)]);
		_;
	}


	// Ps5 (Payment Appendix)
	modifier isResponseTo(bytes32 _rHash, bytes32 _qHash) {
		require(SBool[keccak256(_rHash, "responseTo", _qHash)]);
		_;
	}

	// Pf1 (Payment Appendix)
	function stakeBounty(bytes32 _qHash, uint256 _amount)
		initialized(_qHash)
	public {
		require(hasSufficientBalance(_amount));

		SUint[keccak256(_qHash, "totalStaked")] =
		SUint[keccak256(_qHash, "totalStaked")].add(_amount);

		SUint[keccak256(_qHash, "stakeOf", msg.sender)] =
		SUint[keccak256(_qHash, "stakeOf", msg.sender)].add(_amount);

		withdrawFrom(_amount, msg.sender);
	}

	// Pf2 (Payment Appendix)
	function disburseBounty(bytes32 _qHash, bytes32 _rHash, uint256 _amount)
		initialized(_qHash)
		initialized(_rHash)
		validResponse(_rHash)
		isResponseTo(_rHash, _qHash)
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
		SUint[keccak256("paymentLockout")]);
	}

	// Pf3 (Payment Appendix)
	function retrieveBounty(bytes32 _rHash, address _disburser)
		initialized(_rHash)
		validResponse(_rHash)
		isOwner(_rHash)
		outEscrowWindow(_rHash, _disburser)
	public {
		uint256 amount = SUint[keccak256(_rHash, "disbursementOf", _disburser)];

		SUint[keccak256(_rHash, "disbursementOf", _disburser)] =
		SUint[keccak256(_rHash, "disbursementOf", _disburser)].sub(amount);

		depositTo(amount, msg.sender);
	}

	// Pf4 (Payment Appendix)
	function recallDisbursement(bytes32 _qHash, bytes32 _rHash)
		initialized(_qHash)
		initialized(_rHash)
		isResponseTo(_rHash, _qHash)
	public {
		uint256 amount = SUint[keccak256(_rHash, "disbursementOf", msg.sender)];

		SUint[keccak256(_rHash, "disbursementOf", msg.sender)] =
		SUint[keccak256(_rHash, "disbursementOf", msg.sender)].sub(amount);

		SUint[keccak256(_qHash, "stakeOf", msg.sender)] =
		SUint[keccak256(_qHash, "stakeOf", msg.sender)].add(amount);
	}
}
