import assertRevert from './helpers/assertRevert';

const Payment = artifacts.require("PaymentTest");

contract("Payment", function([creator, responder, normal]){
    beforeEach(async function(){
        this.token = await Payment.new();
    });
    describe("Staking", function(){
        it("correctly initialized", async function(){
        });
    });
    describe("Disbursing", function(){
        it("correctly initialized", async function(){
        });
    });
});
