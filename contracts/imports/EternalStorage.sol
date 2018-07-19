pragma solidity ^0.4.23;

/**
 * @title EternalStorage
 * @dev This contract holds all the necessary state variables to carry out the storage of any contract.
 */

contract EternalStorage {
	// ESs1 (Eternal Storage Appendix)
	mapping(bytes32 => uint256) internal SUint;
	// ESs2 (Eternal Storage Appendix)
	mapping(bytes32 => string) internal SString;
	// ESs3 (Eternal Storage Appendix)
	mapping(bytes32 => address) internal SAddress;
	// ESs4 (Eternal Storage Appendix)
	mapping(bytes32 => bool) internal SBool;
	// ESs5 (Eternal Storage Appendix)
	mapping(bytes32 => int256) internal SInt;
	// ESs6 (Eternal Storage Appendix)
	mapping(bytes32 => bytes) internal SBytes;


	// ESf1 (Eternal Storage Appendix)
	function getSUint(bytes32 _hash) public view returns(uint256) {
		return SUint[_hash];
	}

	// ESf2 (Eternal Storage Appendix)
	function getSString(bytes32 _hash) public view returns(string) {
		return SString[_hash];
	}

	// ESf3 (Eternal Storage Appendix)
	function getSAddress(bytes32 _hash) public view returns(address) {
		return SAddress[_hash];
	}

	// ESf4 (Eternal Storage Appendix)
	function getSBytes(bytes32 _hash) public view returns(bytes) {
		return SBytes[_hash];
	}

	// ESf5 (Eternal Storage Appendix)
	function getSBool(bytes32 _hash) public view returns(bool) {
		return SBool[_hash];
	}

	// ESf6 (Eternal Storage Appendix)
	function getSInt(bytes32 _hash) public view returns(int256) {
		return SInt[_hash];
	}

}
