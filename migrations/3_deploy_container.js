var LogicContainer = artifacts.require("./LogicContainer.sol")

module.exports = function(deployer) {
	deployer.link(Content, LogicContainer);
	// deployer.link(Moderation, LogicContainer);
	deployer.link(Payment, LogicContainer);
	deployer.link(Token, LogicContainer);

	deployer.deploy(LogicContainer);

};
