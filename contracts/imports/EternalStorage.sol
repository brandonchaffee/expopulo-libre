pragma solidity ^0.4.23;

/**
 * @title EternalStorage
 * @dev This contract holds all the necessary state variables to carry out the storage of any contract.
 */
contract EternalStorage {
	mapping(bytes32 => uint256) internal SUint;
	mapping(bytes32 => string) internal SString;
	mapping(bytes32 => address) internal SAddress;
	mapping(bytes32 => bytes) internal SBytes;
	mapping(bytes32 => bool) internal SBool;
	mapping(bytes32 => int256) internal SInt;
}
