import assertRevert from './helpers/assertRevert';
import { advanceBlock } from './helpers/advanceToBlock';
import { increaseTimeTo, duration } from './helpers/increaseTime';
import latestTime from './helpers/latestTime';

const Payment = artifacts.require("PaymentTest");

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
const rInval = itemHashes[4];

const creatorBalance = 100;
const responderBalance = 5;
const lowBalanceValue = 25;

contract("Payment", function([creator, responder, lowBalance]){
    beforeEach(async function(){
        await advanceBlock();
        this.midTime = latestTime()+ duration.minutes(10);
        this.endTime = latestTime()+ duration.days(1);
        this.token = await Payment.new(creator, responder, lowBalance, qInit,
            rInit, rInval, creatorBalance, responderBalance, lowBalanceValue);
    });
    describe("Staking", function(){
        it("stakes bounties", async function(){
            const cStake = 20;
            const lStake = 10;
            const totalStaked = cStake + lStake;
            await this.token.stakeBounty(qInit, cStake, {from:creator});
            await this.token.stakeBounty(qInit, lStake, {from:lowBalance});
            const retTotalStaked = await this.token.getTotalStaked(qInit);
            const retCStake = await this.token.getStakeOf(qInit, creator);
            const retLStake = await this.token.getStakeOf(qInit, lowBalance);
            assert.equal(retCStake, cStake);
            assert.equal(retLStake, lStake);
            assert.equal(retTotalStaked, totalStaked);
        });
        it("reverts without sufficient balance", async function(){
            await assertRevert(this.token.stakeBounty(qInit, 50,
                {from:lowBalance}));
        });
        it("reverts with uninitialized query", async function(){
            await assertRevert(this.token.stakeBounty(qUnin, 50,
                {from:creator}));
        });
    });
    describe("Disbursing", function(){
        it("decrements stake and accounts disbursement", async function(){
            const largeStake = 10;
            const smallStake = 8;
            const largeDisburse = 5;
            const smallDisburse = 2;

            await this.token.stakeBounty(qInit, largeStake, {from:creator});
            await this.token.stakeBounty(qInit, smallStake, {from:lowBalance});
            await this.token.disburseBounty(qInit, rInit, largeDisburse,
                {from:creator});
            await this.token.disburseBounty(qInit, rInit, smallDisburse,
                {from:lowBalance});

            const retLgStake = await this.token.getStakeOf(qInit, creator);
            const retSmStake = await this.token.getStakeOf(qInit, lowBalance);
            const totalStaked = await this.token.getTotalStaked(qInit);
            assert.equal(retLgStake.toNumber(), largeStake - largeDisburse);
            assert.equal(retSmStake.toNumber(), smallStake - smallDisburse);
            assert.equal(totalStaked.toNumber(),
                smallStake + largeStake - smallDisburse - largeDisburse);

            const retLgDisburse = await this.token.getDisbursementOf(rInit,
                creator);
            const retSmDisburse = await this.token.getDisbursementOf(rInit,
                lowBalance);
            const totalDisbursed = await this.token.getTotalDisbursed(rInit);
            assert.equal(retLgDisburse.toNumber(), largeDisburse);
            assert.equal(retSmDisburse.toNumber(), smallDisburse);
            assert.equal(totalDisbursed.toNumber(), smallDisburse +
                largeDisburse);
        });
        it("reverts with excessive amount", async function(){
            await this.token.stakeBounty(qInit, 25, {from:creator});
            await assertRevert(this.token.disburseBounty(qInit, rInit, 50,
                {from:creator}));
        });
        it("reverts with uninitialized items", async function(){
            await assertRevert(this.token.stakeBounty(qUnin, 10,
                {from:creator}));
            await this.token.stakeBounty(qInit, 25, {from:creator});
            await assertRevert(this.token.disburseBounty(qInit, rUnin, 10,
                {from:creator}));
        });
        it("reverts on invalid response", async function(){
            await this.token.stakeBounty(qInit, 25, {from:creator});
            await assertRevert(this.token.disburseBounty(qInit, rInval, 10,
                {from:creator}));
        });
    });
    describe("Retrieval", function(){
        it("reverts until out of escrow window", async function(){
            const bounty = 25;
            await this.token.stakeBounty(qInit, bounty, {from:creator});
            await this.token.disburseBounty(qInit, rInit, bounty,
                {from:creator});
            await assertRevert(this.token.retrieveBounty(rInit, creator,
                {from:responder}));

            await increaseTimeTo(this.midTime);
            await assertRevert(this.token.retrieveBounty(rInit, creator,
                {from:responder}));
            const midBalance = await this.token.balanceOf(responder);

            await increaseTimeTo(this.endTime);
            await this.token.retrieveBounty(rInit, creator, {from:responder});
            const endBalance = await this.token.balanceOf(responder);
            assert.equal(midBalance.toNumber(), responderBalance);
            assert.equal(endBalance.toNumber(), responderBalance + bounty);
        });
        it("reverts if not from owner", async function(){
            const bounty = 25;
            await this.token.stakeBounty(qInit, bounty, {from:creator});
            await this.token.disburseBounty(qInit, rInit, bounty,
                {from:creator});
            await increaseTimeTo(this.endTime);
            await assertRevert(this.token.retrieveBounty(rInit, creator,
                {from:lowBalance}));
        });
        it("decrements disbursement amount", async function(){
            const stakeAmount = 25;
            const disburseAmount = 10;
            await this.token.stakeBounty(qInit, stakeAmount, {from:creator});
            await this.token.disburseBounty(qInit, rInit, disburseAmount,
                {from:creator});
            const preRetrieval = await this.token.getDisbursementOf(rInit,
                creator);
            await increaseTimeTo(this.endTime);
            await this.token.retrieveBounty(rInit, creator, {from:responder});
            const postRetrieval = await this.token.getDisbursementOf(rInit,
                creator);
            assert.equal(postRetrieval, preRetrieval - disburseAmount);
        });
    });
    describe("Recall", function(){
        it("has no effect if already retrieved", async function(){
            const amount = 25;
            await this.token.stakeBounty(qInit, amount, {from:creator});
            await this.token.disburseBounty(qInit, rInit, amount,
                {from:creator});
            await increaseTimeTo(this.endTime);
            await this.token.retrieveBounty(rInit, creator,
                {from:responder});
            await this.token.recallDistribution(qInit, rInit, {from: creator});
            const endStake = await this.token.getStakeOf(qInit,creator);
            const endBalance = await this.token.balanceOf(responder);
            assert.equal(endStake.toNumber(), 0);
            assert.equal(endBalance.toNumber(), amount + responderBalance);
        });
        it("decrements disbursement and increments stake", async function(){
            const amount = 25;
            await this.token.stakeBounty(qInit, amount, {from:creator});
            await this.token.disburseBounty(qInit, rInit, amount,
                {from:creator});
            await this.token.recallDistribution(qInit, rInit,
                {from: creator});
            const endStake = await this.token.getStakeOf(qInit,creator);
            const endDisburse = await this.token.getDisbursementOf(
                rInit,creator);
            assert.equal(endStake.toNumber(), amount);
            assert.equal(endDisburse.toNumber(), 0);
        });
    });
    describe("Balance", function(){
        it("decrements balance from staking", async function(){
            const stakeValue = 25;
            await this.token.stakeBounty(qInit, stakeValue, {from:creator});
            const endingBalance = await this.token.balanceOf(creator);
            assert.equal(endingBalance.toNumber(), creatorBalance - stakeValue);
        });
        it("increments balance from retrieval", async function(){
            const stakeValue = 25;
            const disburseValue = 10;
            await this.token.stakeBounty(qInit, stakeValue, {from:creator});
            await this.token.disburseBounty(qInit, rInit, disburseValue,
                {from:creator});
            await increaseTimeTo(this.endTime);
            await this.token.retrieveBounty(rInit, creator, {from:responder});
            const endingBalance = await this.token.balanceOf(responder);
            assert.equal(endingBalance.toNumber(), responderBalance +
                disburseValue);
        });
    })
});
