pragma solidity ^0.4.23;

import "../sections/Payment.sol";

contract PaymentTest is Payment {
    constructor(
        address qCreator,
        address rCreator,
        address lowBalance,
        bytes qHash,
        bytes rHash,
        bytes rInvalid,
        uint256 cBalance,
        uint256 rBalance,
        uint256 lBalance
    ) public {
        SAddress[keccak256(qHash, "owner")] = qCreator;
        SAddress[keccak256(rHash, "owner")] = rCreator;
        SAddress[keccak256(rInvalid, "owner")] = rCreator;

        SUint[keccak256("balance", qCreator)] = cBalance;
        SUint[keccak256("balance", rCreator)] = rBalance;
        SUint[keccak256("balance", lowBalance)] = lBalance;
        SBool[keccak256(rInvalid, "isInvalid")] = true;
        SUint[keccak256("paymentLockout")] = 1000;
    }

    function balanceOf(address owner) public view returns (uint256) {
		return SUint[keccak256("balance", owner)];
	}
}
