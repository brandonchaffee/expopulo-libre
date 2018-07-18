pragma solidity ^0.4.23;

import "./EternalStorage.sol";
import "./math/SafeMath.sol";

contract Escrow is EternalStorage {
	using SafeMath for uint256;
	// Ef1 (Appendix)
	function hasSufficientBalance(uint256 _amount) public view returns(bool){
		return SUint[keccak256("balance", msg.sender)] >= _amount;
	}

	// Ef2 (Appendix)
	function withdrawFrom(uint256 _amount, address _target) internal {
		SUint[keccak256("balance", _target)] =
		SUint[keccak256("balance", _target)].sub(_amount);
	}

	// Ef3 (Appendix)
	function depositTo(uint256 _amount, address _target) internal {
		SUint[keccak256("balance", _target)] =
		SUint[keccak256("balance", _target)].add(_amount);
	}
}
