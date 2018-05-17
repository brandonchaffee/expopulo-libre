pragma solidity ^0.4.23;

import './sections/Content.sol';
import './sections/Payment.sol';
import './sections/Moderation.sol';
import './sections/Token.sol';

contract LogicContainer is Content, Payment, Moderation, Token {
    //ADD Constructor stuff
}
