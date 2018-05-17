import expectThrow from './helpers/expectThrow';

const Token = artifacts.require("Token");

contract("Token", function(accounts){
    beforeEach(async function(){
        this.token = await Token.new();
    });
    it("Works", async function(){

    });
})
