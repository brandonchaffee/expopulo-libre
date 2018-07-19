pragma solidity ^0.4.23;

import "../imports/EternalStorage.sol";

contract Content is EternalStorage {

	// Cs1 (Content Appendix)
	modifier initialized(bytes32 _hash) {
		require(SAddress[keccak256(_hash, "owner")] != address(0));
		_;
	}

	// Cs2 (Content Appendix)
	modifier uninitialized(bytes32 _hash) {
		require(SAddress[keccak256(_hash, "owner")] == address(0));
		_;
	}

	// Cs3 (Content Appendix)
	modifier validResponder(bytes32 _hash) {
		if(SUint[keccak256(_hash, "type")] != 1){
			require(msg.sender == SAddress[keccak256(_hash, "target")]);
		}
		_;
	}

	// Cs4 (Content Appendix)
	modifier isOwner(bytes32 _hash) {
		require(msg.sender == SAddress[keccak256(_hash, "owner")]);
		_;
	}

	// Cf1 (Content Appendix)
	function createQuery(bytes32 _qHash, string _community, uint256 _type)
		uninitialized(_qHash)
	public {
		SAddress[keccak256(_qHash, "owner")] = msg.sender;
		SString[keccak256(_qHash, "community")] = _community;
		SUint[keccak256(_qHash, "type")] = _type;
	}

	// Cf2 (Content Appendix)
	function createResponse(bytes32 _qHash, bytes32 _rHash)
		initialized(_qHash)
		uninitialized(_rHash)
		validResponder(_qHash)
	public {
		SAddress[keccak256(_rHash, "owner")] = msg.sender;
        SBool[keccak256(_rHash, "responseTo", _qHash)] = true;
	}

	// Cf3 (Content Appendix)
	function setTarget(bytes32 _qHash, address _target)
		initialized(_qHash)
		isOwner(_qHash)
	public {
		require(SUint[keccak256(_qHash, "type")] != 1);
		SAddress[keccak256(_qHash, "target")] = _target;
	}
}
