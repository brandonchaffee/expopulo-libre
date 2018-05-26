pragma solidity ^0.4.23;

import "../imports/EternalStorage.sol";

contract Content is EternalStorage {

	modifier initialized(bytes _hash) {
		require(SAddress[keccak256(_hash, "owner")] != address(0));
		_;
	}

	modifier uninitialized(bytes _hash) {
		require(SAddress[keccak256(_hash, "owner")] == address(0));
		_;
	}

	modifier validResponder(bytes _hash) {
		if(SUint[keccak256(_hash, "type")] != 1){
			require(msg.sender == SAddress[keccak256(_hash, "target")]);
		}
		_;
	}

	modifier isOwner(bytes _hash) {
		require(msg.sender == SAddress[keccak256(_hash, "owner")]);
		_;
	}

	function createQuery(bytes _qHash, string _community, uint256 _type)
		uninitialized(_qHash)
	public {
		SAddress[keccak256(_qHash, "owner")] = msg.sender;
		SString[keccak256(_qHash, "community")] = _community;
		SUint[keccak256(_qHash, "type")] = _type;
	}

	function createResponse(bytes _qHash, bytes _rHash)
		initialized(_qHash)
		uninitialized(_rHash)
		validResponder(_qHash)
	public {
		SAddress[keccak256(_rHash, "owner")] = msg.sender;
        SBool[keccak256(_rHash, "responseTo", _qHash)] = true;
	}

	function setTarget(bytes _qHash, address _target)
		initialized(_qHash)
		isOwner(_qHash)
	public {
		require(SUint[keccak256(_qHash, "type")] != 1);
		SAddress[keccak256(_qHash, "target")] = _target;
	}

	function isResponseTo(bytes _qHash, bytes _rHash) public view returns(bool){
		return SBool[keccak256(_rHash, "responseTo", _qHash)];
	}

	function getTarget(bytes _qHash) public view returns(address){
		return SAddress[keccak256(_qHash, "target")];
	}

	function getOwner(bytes _hash) public view returns(address){
		return SAddress[keccak256(_hash, "owner")];
	}

	function getCommunity(bytes _hash) public view returns(string){
		return SString[keccak256(_hash, "community")];
	}

	function getType(bytes _hash) public view returns(uint256){
		return SUint[keccak256(_hash, "type")];
	}
}
