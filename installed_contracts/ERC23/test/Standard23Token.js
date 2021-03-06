'use strict';

const assertJump = require('../installed_contracts/zeppelin-solidity/test/helpers/assertJump');
var Standard23TokenMock = artifacts.require('./helpers/Standard23TokenMock.sol');

contract('Standard23Token', function(accounts) {
    let MAIN_ACCOUNT = accounts[0];
    let RECEIVING_ACCOUNT = accounts[1];
    let SPENDER_ACCOUNT = accounts[2]

    const INITAL_SUPPLY = 100;
    const TRANSFER_AMOUNT = 100;
    const APPROVE_AMOUNT = 40;

    let token;
    let tokenAddress;

    beforeEach(async () => {
        token = await Standard23TokenMock.new(MAIN_ACCOUNT, INITAL_SUPPLY);
        tokenAddress = token.address;
        console.log("tokenAddress =  " +tokenAddress);
    });


    it('Standard23Token #1 should return the correct totalSupply after construction', async function() {
        console.log("Standard23Token #1 BEGIN==========================================================");

        let totalSupply = await token.totalSupply();
        console.log("The totalSupply of the created Token should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
        assert.equal(totalSupply, INITAL_SUPPLY);

        let mainAccountBalance = await token.balanceOf(MAIN_ACCOUNT);
        console.log("The balance of the MAIN_ACCOUNT should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
        assert.equal(mainAccountBalance, INITAL_SUPPLY);
    });

    it('Standard23Token #2 should return the correct allowance amount after approval', async function() {
        console.log("Standard23Token #2 BEGIN==========================================================");
        console.log("SPENDER_ACCOUNT allowed to transfer " +APPROVE_AMOUNT +" because SPENDER_ACCOUNT has " +APPROVE_AMOUNT +" approved amount");

        let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
        console.log("mainAccountBalanceBeforeTransfer = " +mainAccountBalanceBeforeTransfer +" should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
        assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

        let spenderAccountBalanceBeforeTransfer = await token.balanceOf(SPENDER_ACCOUNT);
        console.log("spenderAccountBalanceBeforeTransfer = " +spenderAccountBalanceBeforeTransfer +" should equal to 0");
        assert.equal(spenderAccountBalanceBeforeTransfer, 0);

        await token.approve(SPENDER_ACCOUNT, APPROVE_AMOUNT);
        console.log("APPROVE_AMOUNT = " +APPROVE_AMOUNT);


        let allowance = await token.allowance(MAIN_ACCOUNT, SPENDER_ACCOUNT);
        console.log("Allowance = " +allowance +"  of SPENDER_ACCOUNT");
        assert.equal(allowance, APPROVE_AMOUNT);

        let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
        console.log("mainAccountBalanceAfterTransfer = " +mainAccountBalanceAfterTransfer +" should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
        assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY);

        let spenderAccountBalanceAfterTransfer = await token.balanceOf(SPENDER_ACCOUNT);
        console.log("spenderAccountBalanceAfterTransfer = " +spenderAccountBalanceAfterTransfer +" should equal to 0");
        assert.equal(spenderAccountBalanceAfterTransfer, 0);
    });
    

    it('Standard23Token #3 should return correct balances after transfering from another account', async function() {
        console.log("Standard23Token #3 BEGIN==========================================================");

        let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
        console.log("mainAccountBalanceBeforeTransfer = " +mainAccountBalanceBeforeTransfer +" should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
        assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

        let ReceivingAccountBalanceBeforeTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
        console.log("ReceivingAccountBalanceBeforeTransfer = " +ReceivingAccountBalanceBeforeTransfer +" should equal to 0");
        assert.equal(ReceivingAccountBalanceBeforeTransfer, 0);

        let spenderAccountBalanceBeforeTransfer = await token.balanceOf(SPENDER_ACCOUNT);
        console.log("spenderAccountBalanceBeforeTransfer = " +spenderAccountBalanceBeforeTransfer +" should equal to 0");
        assert.equal(spenderAccountBalanceBeforeTransfer, 0);

        await token.approve(SPENDER_ACCOUNT, APPROVE_AMOUNT);
        console.log("APPROVE_AMOUNT = " +APPROVE_AMOUNT);

        let allowance = await token.allowance(MAIN_ACCOUNT, SPENDER_ACCOUNT);
        console.log("Allowance = " +allowance +"  of SPENDER_ACCOUNT");
        assert.equal(allowance, APPROVE_AMOUNT);

        await token.transferFrom(MAIN_ACCOUNT, RECEIVING_ACCOUNT, APPROVE_AMOUNT, {from: SPENDER_ACCOUNT});

        let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
        var restBalance = INITAL_SUPPLY - APPROVE_AMOUNT;
        console.log("mainAccountBalanceAfterTransfer = " +mainAccountBalanceAfterTransfer +" should equal to NITAL_SUPPLY - APPROVE_AMOUNT = " +restBalance);
        assert.equal(mainAccountBalanceAfterTransfer, restBalance);

        let ReceivingAccountBalanceAfterTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
        console.log("ReceivingAccountBalanceAfterTransfer = " +ReceivingAccountBalanceAfterTransfer +" should equal to APPROVE_AMOUNT = " +APPROVE_AMOUNT);
        assert.equal(ReceivingAccountBalanceAfterTransfer, APPROVE_AMOUNT);

        let spenderAccountBalanceAfterTransfer = await token.balanceOf(SPENDER_ACCOUNT);
        console.log("spenderAccountBalanceAfterTransfer = " +spenderAccountBalanceAfterTransfer +" should equal to 0");
        assert.equal(spenderAccountBalanceAfterTransfer, 0);
    });


    it('Standard23Token #4 should throw an error when trying to transfer more than allowed', async function() {
        console.log("Standard23Token #4 BEGIN==========================================================");

        const TRANSFER_AMOUNT = 101;

        let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
        console.log("mainAccountBalanceBeforeTransfer = " +mainAccountBalanceBeforeTransfer +" should equal to INITAL_SUPPLY= " +INITAL_SUPPLY);
        assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

        let ReceivingAccountBalanceBeforeTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
        console.log("ReceivingAccountBalanceBeforeTransfer = " +ReceivingAccountBalanceBeforeTransfer +" should equal to 0");
        assert.equal(ReceivingAccountBalanceBeforeTransfer, 0);

        let spenderAccountBalanceBeforeTransfer = await token.balanceOf(SPENDER_ACCOUNT);
        console.log("spenderAccountBalanceBeforeTransfer = " +spenderAccountBalanceBeforeTransfer +" should equal to 0");
        assert.equal(spenderAccountBalanceBeforeTransfer, 0);

        await token.approve(SPENDER_ACCOUNT, APPROVE_AMOUNT);
        console.log("APPROVE_AMOUNT " +APPROVE_AMOUNT);
        try {
            console.log("Try to TransferFrom " +TRANSFER_AMOUNT +" MAIN_ACCOUNT to RECEIVING_ACCOUNT from SPENDER_ACCOUNT");
            await token.transferFrom(MAIN_ACCOUNT, RECEIVING_ACCOUNT, TRANSFER_AMOUNT, {from: SPENDER_ACCOUNT});
        } catch(error) {
            let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
            console.log("mainAccountBalanceAfterTransfer = " +mainAccountBalanceAfterTransfer +" should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
            assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY);

            let ReceivingAccountBalanceAfterTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
            console.log("ReceivingAccountBalanceAfterTransfer = " +ReceivingAccountBalanceAfterTransfer +" should equal to 0");
            assert.equal(ReceivingAccountBalanceAfterTransfer, 0);

            let spenderAccountBalanceAfterTransfer = await token.balanceOf(SPENDER_ACCOUNT);
            console.log("spenderAccountBalanceAfterTransfer = " +spenderAccountBalanceAfterTransfer +" should equal to 0");
            assert.equal(spenderAccountBalanceAfterTransfer, 0);

            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });

    it('Standard23Token #5 should throw an error when trying to transfer when not allowed', async function() {
        console.log("Standard23Token #5 BEGIN==========================================================");

        const TRANSFER_AMOUNT = 100;

        let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
        console.log("mainAccountBalanceBeforeTransfer = " +mainAccountBalanceBeforeTransfer +" should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
        assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

        let ReceivingAccountBalanceBeforeTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
        console.log("ReceivingAccountBalanceBeforeTransfer = " +ReceivingAccountBalanceBeforeTransfer + "should equal to 0");
        assert.equal(ReceivingAccountBalanceBeforeTransfer, 0);

        let spenderAccountBalanceBeforeTransfer = await token.balanceOf(SPENDER_ACCOUNT);
        console.log("spenderAccountBalanceBeforeTransfer = " +spenderAccountBalanceBeforeTransfer +" should equal to 0");
        assert.equal(spenderAccountBalanceBeforeTransfer, 0);

        try {
            console.log("Try to TransferFrom " +TRANSFER_AMOUNT +" MAIN_ACCOUNT to RECEIVING_ACCOUNT from SPENDER_ACCOUNT");
            await token.transferFrom(MAIN_ACCOUNT, RECEIVING_ACCOUNT, TRANSFER_AMOUNT, {from: MAIN_ACCOUNT});
        } catch(error) {    
            let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
            console.log("mainAccountBalanceAfterTransfer = " +mainAccountBalanceAfterTransfer +" should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
            assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY);

            let ReceivingAccountBalanceAfterTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
            console.log("ReceivingAccountBalanceAfterTransfer = " +ReceivingAccountBalanceAfterTransfer +" should equal to 0");
            assert.equal(ReceivingAccountBalanceAfterTransfer, 0);

            let spenderAccountBalanceAfterTransfer = await token.balanceOf(SPENDER_ACCOUNT);
            console.log("spenderAccountBalanceAfterTransfer = " +spenderAccountBalanceAfterTransfer +"should equal to 0");
            assert.equal(spenderAccountBalanceAfterTransfer, 0);

            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });

    it('Standard23Token #6 should throw an error when trying to transfer less than 0', async function() {
        console.log("Standard23Token #6 BEGIN==========================================================");

        const TRANSFER_AMOUNT = -1;
        const APPROVE_AMOUNT = 100;

        let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
        console.log("mainAccountBalanceBeforeTransfer = " +mainAccountBalanceBeforeTransfer +" should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
        assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

        let ReceivingAccountBalanceBeforeTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
        console.log("ReceivingAccountBalanceBeforeTransfer = " +ReceivingAccountBalanceBeforeTransfer +" should equal to 0");
        assert.equal(ReceivingAccountBalanceBeforeTransfer, 0);

        let spenderAccountBalanceBeforeTransfer = await token.balanceOf(SPENDER_ACCOUNT);
        console.log("spenderAccountBalanceBeforeTransfer = " +spenderAccountBalanceBeforeTransfer +" should equal to 0"); 
        assert.equal(spenderAccountBalanceBeforeTransfer, 0);

        await token.approve(RECEIVING_ACCOUNT, APPROVE_AMOUNT);
        console.log("APPROVE_AMOUNT " +APPROVE_AMOUNT);
        try {
            console.log("Try to TransferFrom " +TRANSFER_AMOUNT +" MAIN_ACCOUNT to RECEIVING_ACCOUNT from SPENDER_ACCOUNT");
            await token.transferFrom(MAIN_ACCOUNT, RECEIVING_ACCOUNT, TRANSFER_AMOUNT, {from: SPENDER_ACCOUNT});
        } catch(error) {
            let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
            console.log("mainAccountBalanceAfterTransfer = " +mainAccountBalanceAfterTransfer +" should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
            assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY);

            let ReceivingAccountBalanceAfterTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
            console.log("ReceivingAccountBalanceAfterTransfer should equal to " +ReceivingAccountBalanceAfterTransfer);
            assert.equal(ReceivingAccountBalanceAfterTransfer, 0);

            let spenderAccountBalanceAfterTransfer = await token.balanceOf(SPENDER_ACCOUNT);
            console.log("spenderAccountBalanceAfterTransfer should equal to " +spenderAccountBalanceAfterTransfer);
            assert.equal(spenderAccountBalanceAfterTransfer, 0);

            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });


    it('Standard23Token #7 should throw an error when trying to transfer more than supply', async function() {
        console.log("Standard23Token #7 BEGIN==========================================================");

        const TRANSFER_AMOUNT = 101;
        const APPROVE_AMOUNT = 101;

        let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
        console.log("mainAccountBalanceBeforeTransfer = " +mainAccountBalanceBeforeTransfer +" should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
        assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

        let ReceivingAccountBalanceBeforeTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
        console.log("ReceivingAccountBalanceBeforeTransfer = " +ReceivingAccountBalanceBeforeTransfer +" should equal to 0");
        assert.equal(ReceivingAccountBalanceBeforeTransfer, 0);

        let spenderAccountBalanceBeforeTransfer = await token.balanceOf(SPENDER_ACCOUNT);
        console.log("spenderAccountBalanceBeforeTransfer =" +spenderAccountBalanceBeforeTransfer +" should equal to 0");
        assert.equal(spenderAccountBalanceBeforeTransfer, 0);

        await token.approve(RECEIVING_ACCOUNT, APPROVE_AMOUNT);
        console.log("APPROVE_AMOUNT " +APPROVE_AMOUNT);
        try {
            console.log("Try to TransferFrom " +TRANSFER_AMOUNT +" MAIN_ACCOUNT to RECEIVING_ACCOUNT from SPENDER_ACCOUNT");
            await token.transferFrom(MAIN_ACCOUNT, RECEIVING_ACCOUNT, TRANSFER_AMOUNT, {from: SPENDER_ACCOUNT});
        } catch(error) {
            let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
            console.log("mainAccountBalanceBeforeTransfer = " +mainAccountBalanceBeforeTransfer +" should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
            assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY);

            let ReceivingAccountBalanceAfterTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
            console.log("ReceivingAccountBalanceAfterTransfer = " +ReceivingAccountBalanceAfterTransfer +" should equal to 0");
            assert.equal(ReceivingAccountBalanceAfterTransfer, 0);

            let spenderAccountBalanceAfterTransfer = await token.balanceOf(SPENDER_ACCOUNT);
            console.log("spenderAccountBalanceAfterTransfer = " +spenderAccountBalanceAfterTransfer +" should equal to 0");
            assert.equal(spenderAccountBalanceAfterTransfer, 0);

            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });


    it('Standard23Token #8 should throw an error when trying to transferFrom to 0x0', async function() {
        console.log("Standard23Token #8 BEGIN==========================================================");

        let token = await Standard23TokenMock.new(MAIN_ACCOUNT, INITAL_SUPPLY);

        let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
        console.log("mainAccountBalanceBeforeTransfer = " +mainAccountBalanceBeforeTransfer +" should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
        assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

        let spenderAccountBalanceBeforeTransfer = await token.balanceOf(SPENDER_ACCOUNT);
        console.log("spenderAccountBalanceBeforeTransfer = " +spenderAccountBalanceBeforeTransfer +" should equal to 0");
        assert.equal(spenderAccountBalanceBeforeTransfer, 0);

      await token.approve(SPENDER_ACCOUNT, APPROVE_AMOUNT);
      console.log("APPROVE_AMOUNT = " +APPROVE_AMOUNT);

      try {
        let transfer = await token.transferFrom(MAIN_ACCOUNT, 0x0, APPROVE_AMOUNT, {from: SPENDER_ACCOUNT});
        assert.fail('should have thrown before');
      } catch(error) {
        let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
        console.log("mainAccountBalanceBeforeTransfer = " +mainAccountBalanceBeforeTransfer +" should equal to INITAL_SUPPLY = " +INITAL_SUPPLY);
        assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY);

        let spenderAccountBalanceAfterTransfer = await token.balanceOf(SPENDER_ACCOUNT);
        console.log("spenderAccountBalanceAfterTransfer = " +spenderAccountBalanceAfterTransfer +" should equal to 0");
        assert.equal(spenderAccountBalanceAfterTransfer, 0);
        assertJump(error);
      }
    });

    describe('Standard23Token #9 validating allowance updates to spender', function() {
        console.log("Standard23Token #9 BEGIN==========================================================");

        it('Approval should start with zero and should increase by 50 then decrease by 10', async function() {
        
            let preApproved;
            let token = await Standard23TokenMock.new(MAIN_ACCOUNT, INITAL_SUPPLY);
        
            preApproved = await token.allowance(MAIN_ACCOUNT, SPENDER_ACCOUNT);
            console.log("preApproved = " +preApproved +" should equal to 0");
            assert.equal(preApproved, 0);

            await token.increaseApproval(SPENDER_ACCOUNT, 50);
            console.log("Increse approval to  50");
            let postIncrease = await token.allowance(MAIN_ACCOUNT, SPENDER_ACCOUNT);
            console.log("PostIncrese allowance = " +postIncrease +" should equal to 50");
            assert.equal(postIncrease,50);
            
            await token.decreaseApproval(SPENDER_ACCOUNT, 10);
            console.log("Increse approval by 10");
            let postDecrease = await token.allowance(MAIN_ACCOUNT, SPENDER_ACCOUNT);
            console.log("postDecrease allowance = " +postDecrease +" should equal to 40");
            assert.equal(postDecrease,40);
      })
    });
});
