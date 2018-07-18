pragma solidity ^0.4.23;

/**
 * @title EternalStorage
 * @dev This contract holds all the necessary state variables to carry out the storage of any contract.
 */

 // ESs0 (Appendix)
contract EternalStorage {
	mapping(bytes32 => uint256) internal SUint;
	mapping(bytes32 => string) internal SString;
	mapping(bytes32 => address) internal SAddress;
	mapping(bytes32 => bytes) internal SBytes;
	mapping(bytes32 => bool) internal SBool;
	mapping(bytes32 => int256) internal SInt;


	function getSUInt(bytes32 _hash) public view returns(uint256) {
		return SUint[_hash];
	}

	function getSString(bytes32 _hash) public view returns(string) {
		return SString[_hash];
	}

	function getSAddress(bytes32 _hash) public view returns(address) {
		return SAddress[_hash];
	}

	function getSBytes(bytes32 _hash) public view returns(bytes) {
		return SBytes[_hash];
	}

	function getSBool(bytes32 _hash) public view returns(bool) {
		return SBool[_hash];
	}

	function getSInt(bytes32 _hash) public view returns(int256) {
		return SInt[_hash];
	}

}
