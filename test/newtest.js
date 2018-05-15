import expectThrow from './helpers/expectThrow';

// const LogicContainer = artifacts.require("LogicContainer");

const Token = artifacts.require("Token");

contract("Individual Tests", function(accounts){

	it('Gas Test', async function(){
		let instance = await Token.new();

		let receipt = instance.transactionHash;
		console.log(receipt);
		// console.log(Object.keys(instance.contract._eth));//.getTransactionReceipt(receipt));
		// console.log(instance.contract._eth.gasPrice);//.getTransactionReceipt(receipt));
	});
})
