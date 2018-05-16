import expectThrow from './helpers/expectThrow';

const Token = artifacts.require("Token");
const Content = artifacts.require("Content");
const Payment = artifacts.require("Payment");
const Moderation = artifacts.require("Moderation");


const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

contract("Gas Tests", function(accounts){

	it('Gas Consumption', async function(){
		let totalConsumption = 0;
		let instance = await Content.new();
		let receipt = await web3.eth.getTransactionReceipt(instance.transactionHash);
		totalConsumption += receipt.gasUsed;
		console.log("Content", numberWithCommas(receipt.gasUsed));

		instance = await Payment.new();
		receipt = await web3.eth.getTransactionReceipt(instance.transactionHash);
		totalConsumption += receipt.gasUsed;
		console.log("Payment",numberWithCommas(receipt.gasUsed));

		instance = await Moderation.new();
		receipt = await web3.eth.getTransactionReceipt(instance.transactionHash);
		totalConsumption += receipt.gasUsed;
		console.log("Moderation", numberWithCommas(receipt.gasUsed));

		instance = await Token.new();
		receipt = await web3.eth.getTransactionReceipt(instance.transactionHash);
		totalConsumption += receipt.gasUsed;
		console.log("Token", numberWithCommas(receipt.gasUsed));

		console.log("Total", numberWithCommas(totalConsumption));
	});

	it('Gas General', async function(){
		const price = await web3.eth.gasPrice
		console.log("Price", numberWithCommas(price.c[0]));

		const limit = await web3.eth.getBlock("pending").gasLimit
		console.log("Limit", numberWithCommas(limit));
	});
})
