import expectThrow from './helpers/expectThrow';

const LogicContainer = artifacts.require("LogicContainer");

contract("Container Tests", function(accounts){

	it('Logic Container', async function(){
		let instance = await LogicContainer.new();
		console.log(instance);		
	});
})
