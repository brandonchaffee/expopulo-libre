import assertRevert from './helpers/assertRevert';

const Content = artifacts.require("ContentTest");
const qH = "027e57bcbae76c4b6a1c5ce589be41232498f1af86e1b1a2fc2bdffd740e9b39";
const rH = "ccef599d1a13bed9989e424011aed2c023fce25917864cd7de38a761567410b8";
const community = "General";
const oType = 1;
const tType = 2;

contract("Content", function([creator, responder, normal]){
    beforeEach(async function(){
        this.token = await Content.new();
    });
    describe("Query", function(){
        it("correctly initialized", async function(){
            await this.token.createQuery(qH, community, oType, {from:creator});
            const queryOwner = await this.token.getOwner(qH);
            const queryCommunity = await this.token.getCommunity(qH);
            const queryType = await this.token.getType(qH);
            assert.equal(queryOwner, creator);
            assert.equal(queryCommunity, community);
            assert.equal(queryType, oType);
        });
        it("cannot be reinitialized", async function(){
            await this.token.createQuery(qH, community, oType, {from:creator});
            await assertRevert(this.token.createQuery(qH, community, oType,
                 {from:creator}));
        })
        it("can only set target by owner", async function(){
            await this.token.createQuery(qH, community, tType, {from:creator});
            await assertRevert(this.token.setTarget(qH, responder,
                 {from:normal}));
            await this.token.setTarget(qH, responder, {from:creator});
            const target = await this.token.getTarget(qH);
            assert.equal(target, responder);
        });
    });
    describe("Response", function(){
        it("fails with uninitialized query", async function(){
            await assertRevert(this.token.createResponse(qH, rH,
                {from:responder}));
        })
        it("correct ownership", async function(){
            await this.token.createQuery(qH, community, oType, {from:creator});
            await this.token.createResponse(qH, rH, {from:responder});
            const responseOwner = await this.token.getOwner(rH);
            assert.equal(responseOwner, responder);
        });
        it("cannot be reinitialized", async function(){
            await this.token.createQuery(qH, community, oType, {from:creator});
            await this.token.createResponse(qH, rH, {from:responder});
            await assertRevert(this.token.createResponse(qH, rH,
                 {from:responder}));
        });
        it("can only be from target when pointed", async function(){
            await this.token.createQuery(qH, community, tType, {from:creator});
            await this.token.setTarget(qH, responder, {from:creator});
            await assertRevert(this.token.createResponse(qH, rH,
                 {from:normal}));
            await this.token.createResponse(qH, rH, {from:responder});
            const toBool = await this.token.isResponseTo(qH, rH,
                {from:creator});
            assert(toBool);
        });
    });
});
