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

const balance = 500;
const community = "TestComm"

contract("Moderation", function([creator, responder, modA, modB, modC, nonMod,
    spenderA, spenderB]){
    beforeEach(async function(){
        await advanceBlock();
        this.midTime = latestTime()+ duration.minutes(10);
        this.endTime = latestTime()+ duration.days(1);
        this.token = await Moderation.new(creator, responder, modA, modB, modC,
            nonMod, spenderA, spenderB, qInit, rInit, balance, community, 1, 2);
    });
    describe("Challenge", function(){
        it("accounts deposit", async function(){
            // this.token.challenge(qInit, rInit, 10, 1, {from:spenderA});
            // this.token.challenge(qInit, rInit, 5, 1, {from:spenderB});
        });
        it("reverts when uninitialized", async function(){
            await assertRevert(this.token.challenge(qInit, rUnin, 50, 1,
                {from:creator}));
        });
        it("reverts when already challenged", async function(){

        });
        it("withdraws challenge deposit", async function(){

        });
        it("needed value invalidates and extends window", async function(){

        });
        it("reverts on invalid type", async function(){

        });
    });
    describe("Affirm", function(){

    });
    describe("Moderate", function(){
        it("only succeeds with community moderator", async function(){

        });
        it("can only moderator within of window", async function(){

        });
        it("reverts on additional attempt by a moderator", async function(){

        });
    });
    describe("Collection", function(){

    })
});
