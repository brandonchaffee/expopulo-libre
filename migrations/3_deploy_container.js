var CPTContainer = artifacts.require("./test/CPTContainer.sol")
var CMTContainer = artifacts.require("./test/CMTContainer.sol")

var Content = artifacts.require("./sections/Content.sol")
var Moderation = artifacts.require("./sections/Moderation.sol")
var Payment = artifacts.require("./sections/Payment.sol")
var Token = artifacts.require("./sections/Token.sol")

module.exports = function(deployer) {
	deployer.link(Content, CPTContainer);
	deployer.link(Payment, CPTContainer);
	deployer.link(Token, CPTContainer);
	deployer.deploy(CPTContainer);

	deployer.link(Content, CMTContainer);
	deployer.link(Moderation, CMTContainer);
	deployer.link(Token, CMTContainer);
	deployer.deploy(CMTContainer);
};
