import assertRevert from './helpers/assertRevert'
import { advanceBlock } from './helpers/advanceToBlock'
import { increaseTimeTo, duration } from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import SGet from './helpers/SGet'

const Moderation = artifacts.require('ModerationTest')
const itemHashes = [
  '0x027e57bcbae76c4b6a1c5ce589be41232498f1af86e1b1a2fc2bdffd740e9b39',
  '0xccef599d1a13bed9989e424011aed2c023fce25917864cd7de38a761567410b8',
  '0xccef599d1a13bed9989e424011aed2c023fce25917864cd7de38a761567410b5',
  '0x027e57bcbae76c4b6a1c5ce589be41232498f1af86e1b1a2fc2bdffd740e9b3e',
  '0x027e57bcbae76c4b6a1c5ce589be41232498f1af86e1b1a2fc2bdffd740e9b3b'
]
const qInit = itemHashes[0]
const rInit = itemHashes[1]
const rUnin = itemHashes[2]
const rTypeTwo = itemHashes[3]

const community = 'TestComm'
const staked = 50000
const disbursed = 25000
const balance = 500
const windowTime = 5000
const modDeposit = 120
const modLockout = 5000
const depositNeed = 500

contract('Moderation', function ([creator, responder, modA, modB, modC, nonMod,
  spenderA, spenderB, spenderC]) {
  beforeEach(async function () {
    await advanceBlock()
    this.midTime = latestTime() + duration.minutes(10)
    this.endTime = latestTime() + duration.days(1)
    this.token = await Moderation.new(responder, qInit, rInit, rTypeTwo,
      community, 1, 2, staked, disbursed, windowTime, modDeposit, modLockout)
    await this.token.setBalance(spenderA, balance)
    await this.token.setBalance(spenderB, balance)
    await this.token.setBalance(spenderC, balance)
    await this.token.setBalance(modA, balance)
    await this.token.setBalance(modB, balance)
    await this.token.setBalance(modC, balance)
  })
  describe('Challenge', function () {
    it('initializes correctly by type', async function () {
      let depositNeeded = await this.token.challengeDepositNeeded(qInit,
        rInit, 1)
      assert.equal(depositNeeded, staked / 100)
      depositNeeded = await this.token.challengeDepositNeeded(qInit,
        rTypeTwo, 2)
      assert.equal(depositNeeded, disbursed / 100)
    })
    it('accounts deposit', async function () {
      const aDeposit = 10
      const bDeposit = 5
      await this.token.challenge(qInit, rInit, aDeposit, 1,
        {from: spenderA})
      await this.token.challenge(qInit, rInit, bDeposit, 1,
        {from: spenderB})
      const spenderADeposit = await this.token.getSUint(SGet(rInit, 'CDeposit',
        1, spenderA))
      const spenderBDeposit = await this.token.getSUint(SGet(rInit, 'CDeposit',
        1, spenderB))
      const totalDeposit = await this.token.getSUint(SGet(rInit,
        'CDepositTotal', 1))
      assert.equal(spenderADeposit, aDeposit)
      assert.equal(spenderBDeposit, bDeposit)
      assert.equal(totalDeposit.toNumber(), aDeposit + bDeposit)
    })
    it('needed value invalidates and extends window', async function () {
      const preValidity = await this.token.getSBool(SGet(rInit, 'isInvalid', 1))
      await this.token.challenge(qInit, rInit, 250, 1, {from: spenderA})
      await this.token.challenge(qInit, rInit, 250, 1, {from: spenderB})
      const windowValue = await this.token.getSUint(SGet(rInit,
        'moderationWindow', 1))
      const postValidity = await this.token.getSBool(SGet(rInit, 'isInvalid', 1))
      assert.equal(windowValue.toNumber(), latestTime() + windowTime)
      assert.equal(!preValidity, postValidity)
      assert(postValidity)
    })
    it('reverts when uninitialized', async function () {
      await assertRevert(this.token.challenge(qInit, rUnin, 5, 1,
        {from: spenderA}))
    })
    it('reverts when already challenged', async function () {
      await this.token.challenge(qInit, rInit, 250, 1, {from: spenderA})
      await this.token.challenge(qInit, rInit, 250, 1, {from: spenderB})
      await assertRevert(this.token.challenge(qInit, rInit, 10, 1,
        {from: spenderC}))
    })
    it('withdraws challenge deposit', async function () {
      const value = 250
      const preBalance = await this.token.getSUint(SGet('balance', spenderA))
      await this.token.challenge(qInit, rInit, value, 1, {from: spenderA})
      const postBalance = await this.token.getSUint(SGet('balance', spenderA))
      assert.equal(preBalance.toNumber() - value, postBalance.toNumber())
    })
    it('reverts on invalid type', async function () {
      await assertRevert(this.token.challenge(qInit, rUnin, 5, 10,
        {from: spenderA}))
    })
  })
  describe('Affirm', function () {
    it('accounts deposits', async function () {
      await this.token.challenge(qInit, rInit, 500, 1, {from: spenderC})
      const aDeposit = 10
      const bDeposit = 5
      await this.token.affirm(rInit, aDeposit, 1, {from: spenderA})
      await this.token.affirm(rInit, bDeposit, 1, {from: spenderB})
      const spenderADeposit = await this.token.getSUint(SGet(rInit, 'ADeposit',
        1, spenderA))
      const spenderBDeposit = await this.token.getSUint(SGet(rInit, 'ADeposit',
        1, spenderB))
      const totalDeposit = await this.token.getSUint(SGet(rInit,
        'ADepositTotal', 1))
      assert.equal(spenderADeposit.toNumber(), aDeposit)
      assert.equal(spenderBDeposit.toNumber(), bDeposit)
      assert.equal(totalDeposit.toNumber(), aDeposit + bDeposit)
    })
    it('needed value extends moderation window further', async function () {
      await this.token.challenge(qInit, rInit, 500, 1, {from: spenderA})
      const cWindow = await this.token.getSUint(SGet(rInit,
        'moderationWindow', 1))
      await increaseTimeTo(this.midTime)
      await this.token.affirm(rInit, 500, 1, {from: spenderB})
      const aWindow = await this.token.getSUint(SGet(rInit,
        'moderationWindow', 1))
      assert(aWindow > cWindow)
      assert.equal(aWindow.toNumber(), latestTime() + windowTime)
    })
    it('reverts if not challenged', async function () {
      await assertRevert(this.token.affirm(rInit, 10, 1,
        {from: spenderA}))
    })
    it('withdraws affirm deposit', async function () {
      const need = 500
      const preBalance = await this.token.getSUint(SGet('balance', spenderB))
      await this.token.challenge(qInit, rInit, need, 1, {from: spenderA})
      await this.token.affirm(rInit, need, 1, {from: spenderB})
      const postBalance = await this.token.getSUint(SGet('balance', spenderB))
      assert.equal(preBalance.toNumber() - need, postBalance.toNumber())
    })
  })
  describe('Moderation', function () {
    beforeEach(async function () {
      await this.token.challenge(qInit, rInit, 500, 1, {from: spenderA})
      await this.token.affirm(rInit, 500, 1, {from: spenderB})
      await this.token.activateModerator(community, {from: modA})
      await this.token.activateModerator(community, {from: modB})
      await this.token.activateModerator(community, {from: modC})
    })
    it('only succeeds with community moderator', async function () {
      await this.token.moderateObject(qInit, rInit, 1, true, {from: modA})
      await assertRevert(this.token.moderateObject(qInit, rInit, 1, true,
        {from: nonMod}))
    })
    it('can only moderator within of window', async function () {
      await increaseTimeTo(this.endTime)
      await assertRevert(this.token.moderateObject(qInit, rInit, 1, true,
        {from: modA}))
    })
    it('reverts on additional attempt by a moderator', async function () {
      await this.token.moderateObject(qInit, rInit, 1, true, {from: modA})
      await assertRevert(this.token.moderateObject(qInit, rInit, 1, true,
        {from: modA}))
    })
    it('modifies validity with majority', async function () {
      let isInvalid = await this.token.getSBool(SGet(rInit, 'isInvalid', 1))
      assert(isInvalid)

      await this.token.moderateObject(qInit, rInit, 1, true, {from: modA})
      isInvalid = await this.token.getSBool(SGet(rInit, 'isInvalid', 1))
      assert(!isInvalid)

      await this.token.moderateObject(qInit, rInit, 1, false, {from: modB})
      await this.token.moderateObject(qInit, rInit, 1, false, {from: modC})
      isInvalid = await this.token.getSBool(SGet(rInit, 'isInvalid', 1))
      assert(isInvalid)
    })
  })
  describe('Moderator', function () {
    it('withdraws on activation', async function () {
      const preBalance = await this.token.getSUint(SGet('balance', spenderA))
      await this.token.activateModerator(community, {from: spenderA})
      const postBalance = await this.token.getSUint(SGet('balance', spenderA))
      assert.equal(postBalance, preBalance - modDeposit)
    })
    it('deposits on deactivation', async function () {
      await this.token.activateModerator(community, {from: spenderA})
      const preBalance = await this.token.getSUint(SGet('balance', spenderA))
      await this.token.deactivateModerator(community, {from: spenderA})
      const postBalance = await this.token.getSUint(SGet('balance', spenderA))
      assert.equal(postBalance.toNumber(), preBalance.toNumber() +
                modDeposit)
    })
    it('reverts on activation in lockout winodw', async function () {
      await this.token.activateModerator(community, {from: spenderA})
      await this.token.deactivateModerator(community, {from: spenderA})
      await assertRevert(this.token.activateModerator(community,
        {from: spenderA}))
    })
    it('reverts without sufficient balance', async function () {
      await assertRevert(this.token.activateModerator(community,
        {from: nonMod}))
    })
  })
  describe('Collection', function () {
    beforeEach(async function () {
      await this.token.challenge(qInit, rInit, depositNeed, 1,
        {from: spenderA})
      await this.token.affirm(rInit, depositNeed, 1, {from: spenderB})
      await this.token.activateModerator(community, {from: modA})
      await this.token.activateModerator(community, {from: modB})
      await this.token.activateModerator(community, {from: modC})
    })
    it('challenge deposit retrieved on invalidation', async function () {
      await this.token.moderateObject(qInit, rInit, 1, false, {from: modA})
      await increaseTimeTo(this.endTime)
      let preBalance = await this.token.getSUint(SGet('balance', spenderA))
      await this.token.retrieveModerationDeposit(rInit, 1,
        {from: spenderA})
      let postBalance = await this.token.getSUint(SGet('balance', spenderA))
      assert.equal(postBalance.toNumber(), preBalance.toNumber() +
                depositNeed)

      preBalance = await this.token.getSUint(SGet('balance', spenderB))
      await this.token.retrieveModerationDeposit(rInit, 1,
        {from: spenderB})
      postBalance = await this.token.getSUint(SGet('balance', spenderB))
      assert.equal(postBalance.toNumber(), preBalance.toNumber())
    })
    it('affirm deposit retrieved on validation', async function () {
      await this.token.moderateObject(qInit, rInit, 1, true, {from: modA})
      await increaseTimeTo(this.endTime)
      let preBalance = await this.token.getSUint(SGet('balance', spenderA))
      await this.token.retrieveModerationDeposit(rInit, 1,
        {from: spenderA})
      let postBalance = await this.token.getSUint(SGet('balance', spenderA))
      assert.equal(postBalance.toNumber(), preBalance.toNumber())

      preBalance = await this.token.getSUint(SGet('balance', spenderB))
      await this.token.retrieveModerationDeposit(rInit, 1,
        {from: spenderB})
      postBalance = await this.token.getSUint(SGet('balance', spenderB))
      assert.equal(postBalance.toNumber(), preBalance.toNumber() +
                depositNeed)
    })
    it('proportional moderator payment is collected', async function () {
      await this.token.moderateObject(qInit, rInit, 1, false, {from: modA})
      await this.token.moderateObject(qInit, rInit, 1, true, {from: modB})
      await this.token.moderateObject(qInit, rInit, 1, false, {from: modC})
      await increaseTimeTo(this.endTime)
      const depositTotal = await this.token.getSUint(SGet(rInit,
        'CDepositTotal', 1))
      var modList = [modA, modB, modC]
      const moderatorPayment = Math.floor(depositTotal / modList.length)
      modList.forEach(async function (x) {
        let preBalance = await this.token.getSUint(SGet('balance', x))
        await this.token.collectModerationPayment(rInit, 1, {from: x})
        let postBalance = await this.token.getSUint(SGet('balance', x))
        assert.equal(postBalance.toNumber(), preBalance.toNumber() +
                    moderatorPayment)
      })
    })
    it('reverts payment collection without moderating', async function () {
      await this.token.moderateObject(qInit, rInit, 1, false, {from: modA})
      await this.token.moderateObject(qInit, rInit, 1, true, {from: modB})
      await increaseTimeTo(this.endTime)
      await assertRevert(this.token.collectModerationPayment(rInit, 1,
        {from: modC}))
    })
    it('reverts collections within moderation window', async function () {
      await this.token.moderateObject(qInit, rInit, 1, false, {from: modA})
      await increaseTimeTo(this.midTime)
      await assertRevert(this.token.retrieveModerationDeposit(rInit, 1,
        {from: spenderA}))
      await assertRevert(this.token.collectModerationPayment(rInit, 1,
        {from: modA}))
    })
    it('reverts on additional attempt to collect', async function () {
      await this.token.moderateObject(qInit, rInit, 1, false, {from: modA})
      await increaseTimeTo(this.endTime)
      await this.token.retrieveModerationDeposit(rInit, 1,
        {from: spenderA})
      await assertRevert(this.token.retrieveModerationDeposit(rInit, 1,
        {from: spenderA}))
    })
  })
})
