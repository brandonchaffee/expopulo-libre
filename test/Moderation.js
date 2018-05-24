import assertRevert from './helpers/assertRevert';
import { advanceBlock } from './helpers/advanceToBlock';
import { increaseTimeTo, duration } from './helpers/increaseTime';
import latestTime from './helpers/latestTime';

const Moderation = artifacts.require("ModerationTest");
const itemHashes = [
    "027e57bcbae76c4b6a1c5ce589be41232498f1af86e1b1a2fc2bdffd740e9b39",
    "ccef599d1a13bed9989e424011aed2c023fce25917864cd7de38a761567410b8",
    "ccef599d1a13bed9989e424011aed2c023fce25917864cd7de38a761567410b5",
    "027e57bcbae76c4b6a1c5ce589be41232498f1af86e1b1a2fc2bdffd740e9b3e",
    "027e57bcbae76c4b6a1c5ce589be41232498f1af86e1b1a2fc2bdffd740e9b3b"
]
const qInit = itemHashes[0];
const rInit = itemHashes[1];
const rUnin = itemHashes[2];
const qUnin = itemHashes[3];

const community = "TestComm"
const staked = 50000;
const balance = 500;
const windowTime = 5000;

contract("Moderation", function([creator, responder, modA, modB, modC, nonMod,
    spenderA, spenderB, spenderC]){
    beforeEach(async function(){
        await advanceBlock();
        this.midTime = latestTime()+ duration.minutes(10);
        this.endTime = latestTime()+ duration.days(1);
        this.token = await Moderation.new(responder, qInit, rInit, community,
            1, 2, staked, windowTime);
        await this.token.setBalance(spenderA, 500);
        await this.token.setBalance(spenderB, 500);
        await this.token.setBalance(spenderC, 500);
    });
    describe("Challenge", function(){
        it("accounts deposit", async function(){
            const aDeposit = 10;
            const bDeposit = 5;
            await this.token.challenge(qInit, rInit, aDeposit, 1,
                {from:spenderA});
            await this.token.challenge(qInit, rInit, bDeposit, 1,
                {from:spenderB});
            const spenderADeposit = await this.token.getCDepositOf(rInit, 1,
                spenderA);
            const spenderBDeposit = await this.token.getCDepositOf(rInit, 1,
                spenderB);
            const totalDeposit = await this.token.getTotalCDeposit(rInit, 1);
            assert.equal(spenderADeposit, aDeposit);
            assert.equal(spenderBDeposit, bDeposit);
            assert.equal(totalDeposit.toNumber(), aDeposit + bDeposit);
        });
        it("needed value invalidates and extends window", async function(){
            const preValidity = await this.token.getResponseValidity(rInit, 1);
            await this.token.challenge(qInit, rInit, 250, 1, {from:spenderA});
            await this.token.challenge(qInit, rInit, 250, 1, {from:spenderB});
            const windowValue = await this.token.getModerationWindow(rInit, 1);
            const postValidity = await this.token.getResponseValidity(rInit, 1);
            assert.equal(windowValue.toNumber(), latestTime() + windowTime);
            assert.equal(!preValidity, postValidity);
            assert(postValidity);
        });
        it("reverts when uninitialized", async function(){
            await assertRevert(this.token.challenge(qInit, rUnin, 5, 1,
                {from:spenderA}));
        });
        it("reverts when already challenged", async function(){
            await this.token.challenge(qInit, rInit, 250, 1, {from:spenderA});
            await this.token.challenge(qInit, rInit, 250, 1, {from:spenderB});
            await assertRevert(this.token.challenge(qInit, rInit, 10, 1,
                {from:spenderC}));
        });
        it("withdraws challenge deposit", async function(){
            const value = 250;
            const preBalance = await this.token.balanceOf(spenderA);
            await this.token.challenge(qInit, rInit, value, 1, {from:spenderA});
            const postBalance = await this.token.balanceOf(spenderA);
            assert.equal(preBalance.toNumber() - value, postBalance.toNumber());
        });
        it("reverts on invalid type", async function(){
            await assertRevert(this.token.challenge(qInit, rUnin, 5, 10,
                {from:spenderA}));
        });
    });
    // describe("Affirm", function(){
    //
    // });
    // describe("Moderate", function(){
    //     it("only succeeds with community moderator", async function(){
    //
    //     });
    //     it("can only moderator within of window", async function(){
    //
    //     });
    //     it("reverts on additional attempt by a moderator", async function(){
    //
    //     });
    // });
    // describe("Collection", function(){
    //
    // })
});
