import assertRevert from './helpers/assertRevert';
// var lkTestHelpers = require('lk-test-helpers');

const Content = artifacts.require("ContentTest");
const qH = "027e57bcbae76c4b6a1c5ce589be41232498f1af86e1b1a2fc2bdffd740e9b39";
const rH = "ccef599d1a13bed9989e424011aed2c023fce25917864cd7de38a761567410b8";
const community = "General";
const type = 1;

contract("Content", function([creator, responder, normal]){
    beforeEach(async function(){
        this.token = await Content.new();
    });
    describe("Query", function(){
        it("correctly initialized", async function(){
            await this.token.createQuery(qH, community, type, {from:creator});
            const queryOwner = await this.token.getOwner(qH);
            const queryCommunity = await this.token.getCommunity(qH);
            const queryType = await this.token.getType(qH);
            assert.equal(queryOwner, creator);
            assert.equal(queryCommunity, community);
            assert.equal(queryType, type);
        });
        it("cannot be reinitialized", async function(){
            await this.token.createQuery(qH, community, type, {from:creator});
            // assertRevert(this.token.createQuery(qH, community, type,
            //      {from:creator}));
        })
    });
    describe("Response", function(){

    });
});
