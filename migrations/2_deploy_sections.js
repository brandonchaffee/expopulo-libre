var Content = artifacts.require("./sections/Content.sol")
var Moderation = artifacts.require("./sections/Moderation.sol")
var Payment = artifacts.require("./sections/Payment.sol")
var Token = artifacts.require("./sections/Token.sol")

module.exports = function(deployer) {
	deployer.deploy(Content);
	deployer.deploy(Moderation);
	deployer.deploy(Payment);
	deployer.deploy(Token);
};
