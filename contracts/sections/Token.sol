pragma solidity ^0.4.23;

import '../imports/math/SafeMath.sol';
import '../imports/EternalStorage.sol';

contract Token is EternalStorage {
	using SafeMath for uint256;

	event Transfer(address indexed from, address indexed to, uint256 value);
	event Approval(address indexed owner, address indexed spender, uint256 value);

	function totalSupply() public view returns (uint256) {
		return SUint[keccak256("totalSupply")];
	}

	function decimals() public view returns (uint256) {
		return SUint[keccak256("decimals")];
	}
	
	function symbol() public view returns (string) {
		return SString[keccak256("symbol")];
	}
	
	function name() public view returns (string) {
		return SString[keccak256("name")];
	}
	
	function balanceOf(address owner) public view returns (uint256) {
		return SUint[keccak256("balance", owner)];
	}

	function allowance(address owner, address spender) public view returns (uint256) {
		return SUint[keccak256("allowance", owner, spender)];
	}

	function transfer(address to, uint256 value) public {
		bytes32 balanceToHash = keccak256("balance", to);
		bytes32 balanceSenderHash = keccak256("balance", msg.sender);

		require(to != address(0));
		require(SUint[balanceSenderHash] >= value);

		SUint[balanceSenderHash] = balanceOf(msg.sender).sub(value);
		SUint[balanceToHash] = balanceOf(to).add(value);
		emit Transfer(msg.sender, to, value);
	}

	function transferFrom(address from, address to, uint256 value) public {
		bytes32 balanceToHash = keccak256("balance", to);
		bytes32 balanceFromHash = keccak256("balance", from);
		bytes32 allowanceFromToSenderHash = keccak256("allowance", from, msg.sender);

		require(to != address(0));
		require(SUint[balanceFromHash] >= value );
		require(SUint[allowanceFromToSenderHash] >= value);

		SUint[balanceFromHash] = balanceOf(from).sub(value);
		SUint[balanceToHash] = balanceOf(to).add(value);
		SUint[allowanceFromToSenderHash] = allowance(from, msg.sender).sub(value);
		emit Transfer(from, to, value);
	}

	function approve(address spender, uint256 value) public {
		bytes32 allowanceSenderToSpenderHash = keccak256("allowance", msg.sender, spender);
		SUint[allowanceSenderToSpenderHash] = value;
		emit Approval(msg.sender, spender, value);
	}

	function increaseApproval(address spender, uint256 addedValue) public {
		bytes32 allowanceSenderToSpenderHash = keccak256("allowance", msg.sender, spender);
		SUint[allowanceSenderToSpenderHash] = allowance(msg.sender, spender).add(addedValue);
		emit Approval(msg.sender, spender, allowance(msg.sender, spender));
	}

	function decreaseApproval(address spender, uint256 subtractedValue) public {
		uint256 oldValue = allowance(msg.sender, spender);
		bytes32 allowanceSenderToSpenderHash = keccak256("allowance", msg.sender, spender);
		if (subtractedValue > oldValue) {
			SUint[allowanceSenderToSpenderHash] = 0;
		} else {
			SUint[allowanceSenderToSpenderHash] = oldValue.sub(subtractedValue);
		}
		emit Approval(msg.sender, spender, allowance(msg.sender, spender));
	}
}