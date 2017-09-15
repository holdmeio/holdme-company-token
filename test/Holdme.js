'use strict';


const assertJump = require('../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/test/helpers/assertJump');
var Holdme = artifacts.require('../contracts/Holdme.sol');


contract('Holdme', function(accounts) {

	let MAIN_ACCOUNT = accounts[0];
 	let RECEIVING_ACCOUNT = accounts[1];
 	let SPENDER_ACCOUNT = accounts[2]

 	const INITAL_SUPPLY = 300000000;
 	const TRANSFER_AMOUNT = 10000;
 	const APPROVE_AMOUNT = 1000;

 	let tokenName = "Holdme company token";
 	let tokenSymbol = "HME";
 	let tokenDecimals = 0;

 	let token;
 	let tokenAddress;


	beforeEach(async () => {
    	token = await Holdme.new(MAIN_ACCOUNT, INITAL_SUPPLY, tokenName, tokenSymbol, tokenDecimals);
    	tokenAddress = token.address;
		console.log("tokenAddress =  " +tokenAddress);
	});

    it("Holdme #1 should return the correct information after construction", async function() {
 		console.log("Holdme #1. BEGIN==========================================================");

		let totalSupply = await token.totalSupply();
    	console.log("The totalSupply of the created Token should equal to " +INITAL_SUPPLY);
    	assert.equal(totalSupply, INITAL_SUPPLY);

    	let name =  await token.name();
 		console.log("The Token name should be equal to " +web3.toAscii(name));
 		assert.equal(web3.toAscii(name).replace(/\u0000/g, ''), tokenName);

 		let symbol =  await token.symbol();
 		console.log("The Token symbol should be equal to " +web3.toAscii(symbol));
		assert.equal(web3.toAscii(symbol).replace(/\u0000/g, ''), tokenSymbol);

		let decimals = await token.decimals();
		console.log("The Token decimals should be equal to " +decimals);
		assert.equal(decimals, tokenDecimals);

    	console.log("What is the balance of MAIN_ACCOUNT?");
    	let mainAccountBalance = await token.balanceOf(MAIN_ACCOUNT);
    	console.log("The balance of the MAIN_ACCOUNT  should be " +INITAL_SUPPLY);
    	assert.equal(mainAccountBalance, INITAL_SUPPLY);
	});

	it("Holdme #2 should return correct balances after transfer", async function(){
		console.log("Holdme #2. BEGIN==========================================================");
 		console.log("MAIN_ACCOUNT should be able to transfer " +TRANSFER_AMOUNT +" token to RECEIVING_ACCOUNT while MAIN_ACCOUNT has " +INITAL_SUPPLY +" token");

   
		let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
    	console.log("mainAccountBalanceBeforeTransfer should be equal to " +mainAccountBalanceBeforeTransfer);
    	assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

    	let ReceivingAccountBalanceBeforeTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
    	console.log("ReceivingAccountBalanceBeforeTransfer should be equal to " +ReceivingAccountBalanceBeforeTransfer);
    	assert.equal(ReceivingAccountBalanceBeforeTransfer, 0);

    	try {
      		console.log("Try to transfer " +TRANSFER_AMOUNT +" from MAIN_ACCOUNT to RECEIVING_ACCOUNT");
      		await token.transfer(RECEIVING_ACCOUNT, TRANSFER_AMOUNT);
    	} catch(error) {
      		return assertJump(error);
    	}

    	let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
    	console.log("mainAccountBalanceAfterTransfer should be equal to " +mainAccountBalanceAfterTransfer);
    	assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY-TRANSFER_AMOUNT);

    	let ReceivingAccountBalanceAfterTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
    	console.log("ReceivingAccountBalanceAfterTransfer should be equal to " +ReceivingAccountBalanceAfterTransfer);
    	assert.equal(ReceivingAccountBalanceAfterTransfer, TRANSFER_AMOUNT);
  	});

  	it("Holdme #3 should throw an error when trying to transfer less than 0", async function() {
 		console.log("Holdme #3 BEGIN==========================================================");

 		var NEG_TRANSFER_AMOUNT =  -2;
	    console.log("MAIN_ACCOUNT tries to transfer " +NEG_TRANSFER_AMOUNT +" token to RECEIVING_ACCOUNT while TRANSFER_AMOUNT is smaller dan 0");

	    let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
	    console.log("mainAccountBalanceBeforeTransfer should be equal to " +mainAccountBalanceBeforeTransfer);
	    assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

	    let ReceivingAccountBalanceBeforeTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
	    console.log("ReceivingAccountBalanceBeforeTransfer should be equal to " +ReceivingAccountBalanceBeforeTransfer);
	    assert.equal(ReceivingAccountBalanceBeforeTransfer, 0);

	    try {
	      console.log("Try to transfer " +NEG_TRANSFER_AMOUNT +" from MAIN_ACCOUNT to RECEIVING_ACCOUNT");
	      await token.transfer(RECEIVING_ACCOUNT, NEG_TRANSFER_AMOUNT);
	    } catch(error) {
	      let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
	      console.log("mainAccountBalanceAfterTransfer should be equal to " +mainAccountBalanceAfterTransfer);
	      assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY);

	      let ReceivingAccountBalanceAfterTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
	      console.log("ReceivingAccountBalanceAfterTransfer should be equal to " +ReceivingAccountBalanceAfterTransfer);
	      assert.equal(ReceivingAccountBalanceAfterTransfer, 0);

	      return assertJump(error);
	    }
	    assert.fail('should have thrown before');
 	});

 	it("Holdme #4 should throw an error when trying to transfer more than balance", async function() {
	    console.log("Holdme #4 BEGIN==========================================================");

	    var HIGH_TRANSFER_AMOUNT = INITAL_SUPPLY +1;
	    console.log("MAIN_ACCOUNT tries to transfer " +HIGH_TRANSFER_AMOUNT +" token to RECEIVING_ACCOUNT while TRANSFER_AMOUNT is greater than than balance of MAIN_ACCOUNT");


	    let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
	    console.log("mainAccountBalanceBeforeTransfer should be equal to " +mainAccountBalanceBeforeTransfer);
	    assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

	    let ReceivingAccountBalanceBeforeTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
	    console.log("ReceivingAccountBalanceBeforeTransfer should be equal to" +ReceivingAccountBalanceBeforeTransfer);
	    assert.equal(ReceivingAccountBalanceBeforeTransfer, 0);

	    try {
	      console.log("Try to transfer " +HIGH_TRANSFER_AMOUNT +" from MAIN_ACCOUNT to RECEIVING_ACCOUNT");
	      await token.transfer(RECEIVING_ACCOUNT, HIGH_TRANSFER_AMOUNT);
	    } catch(error) {
	      let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
	      console.log("mainAccountBalanceAfterTransfer should be equal to " +mainAccountBalanceAfterTransfer);
	      assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY);

	      let ReceivingAccountBalanceAfterTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
	      console.log("ReceivingAccountBalanceAfterTransfer  should be equal to " +ReceivingAccountBalanceAfterTransfer);
	      assert.equal(ReceivingAccountBalanceAfterTransfer, 0);
	      
	      return assertJump(error);
	    }
	    assert.fail('should have thrown before');
	});

	it("Holdme #5 should throw an error when trying to transfer without any tokens", async function() {
	    console.log("Holdme #5 BEGIN==========================================================");
	    console.log("MAIN_ACCOUNT tries to transfer " +TRANSFER_AMOUNT +" token to RECEIVING_ACCOUNT while MAIN_ACCOUNT does not have any tokens");

	   	token = await Holdme.new(MAIN_ACCOUNT, 0, tokenName, tokenSymbol, tokenDecimals);
    	tokenAddress = token.address;
		console.log("tokenAddress =  " +tokenAddress);

	    let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
	    console.log("mainAccountBalanceBeforeTransfer should be equal to " +mainAccountBalanceBeforeTransfer);
	    assert.equal(mainAccountBalanceBeforeTransfer, 0);
	    
	    let ReceivingAccountBalanceBeforeTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
	    console.log("ReceivingAccountBalanceBeforeTransfer should be equal to " +ReceivingAccountBalanceBeforeTransfer);
	    assert.equal(ReceivingAccountBalanceBeforeTransfer, 0);

	    try {
	      console.log("Try to transfer " +TRANSFER_AMOUNT +" from MAIN_ACCOUNT to RECEIVING_ACCOUNT");
	      await token.transfer(RECEIVING_ACCOUNT, TRANSFER_AMOUNT);
	    } catch(error) {
	      let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
	      console.log("mainAccountBalanceAfterTransfer should be equal to " +mainAccountBalanceAfterTransfer);
	      assert.equal(mainAccountBalanceAfterTransfer, 0);

	      let ReceivingAccountBalanceAfterTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
	      console.log("ReceivingAccountBalanceAfterTransfer should be equal to " +ReceivingAccountBalanceAfterTransfer);
	      assert.equal(ReceivingAccountBalanceAfterTransfer, 0);
	      
	      return assertJump(error);
	    }
	    assert.fail('should have thrown before');
	});

   it('"Holdme #6 should throw an error when trying to transfer to 0x0', async function() {
	    console.log("Holdme #6 BEGIN==========================================================");

	    let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
	    console.log("mainAccountBalanceBeforeTransfer should be equal to " +mainAccountBalanceBeforeTransfer);
	    assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);
	    

	    try {
	      console.log("Try to transfer " +TRANSFER_AMOUNT +" from MAIN_ACCOUNT to 0x0");
	      let transfer = await token.transfer(0x0, TRANSFER_AMOUNT);
	      assert.fail('should have thrown before');
	    } catch(error) {
	      let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
	      console.log("mainAccountBalanceAfterTransfer should be equal to " +mainAccountBalanceAfterTransfer);
	      assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY);
	      assertJump(error);
	    }
	});

   	it('Holdme #7 should return the correct allowance amount after approval', async function() {
	    console.log("Holdme #2 BEGIN==========================================================");
	    console.log("SPENDER_ACCOUNT allowed to transfer " +APPROVE_AMOUNT +" because SPENDER_ACCOUNT has " +APPROVE_AMOUNT +" approved amount");


	    let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
	    console.log("mainAccountBalanceBeforeTransfer should be equal to " +mainAccountBalanceBeforeTransfer);
	    assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

	    let spenderAccountBalanceBeforeTransfer = await token.balanceOf(SPENDER_ACCOUNT);
	    console.log("spenderAccountBalanceBeforeTransfer should be equal to " +spenderAccountBalanceBeforeTransfer);
	    assert.equal(spenderAccountBalanceBeforeTransfer, 0);

	    await token.approve(SPENDER_ACCOUNT, APPROVE_AMOUNT);
	    console.log("APPROVE_AMOUNT = " +APPROVE_AMOUNT);


	    let allowance = await token.allowance(MAIN_ACCOUNT, SPENDER_ACCOUNT);
	    console.log("Allowance = " +allowance +"  of SPENDER_ACCOUNT");
	    assert.equal(allowance, APPROVE_AMOUNT);

	    let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
	    console.log("mainAccountBalanceAfterTransfer should be equal to " +mainAccountBalanceAfterTransfer);
	    assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY);

	    let spenderAccountBalanceAfterTransfer = await token.balanceOf(SPENDER_ACCOUNT);
	    console.log("spenderAccountBalanceAfterTransfer should be equal to " +spenderAccountBalanceAfterTransfer);
	    assert.equal(spenderAccountBalanceAfterTransfer, 0);
  	});

  	it('Holdme #8 should return correct balances after transfering from another account', async function() {
	    console.log("Holdme #8 BEGIN==========================================================");

	    let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
	    console.log("mainAccountBalanceBeforeTransfer=" +mainAccountBalanceBeforeTransfer);
	    assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

	    let ReceivingAccountBalanceBeforeTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
	    console.log("ReceivingAccountBalanceBeforeTransfer should be equal to " +ReceivingAccountBalanceBeforeTransfer);
	    assert.equal(ReceivingAccountBalanceBeforeTransfer, 0);

	    let spenderAccountBalanceBeforeTransfer = await token.balanceOf(SPENDER_ACCOUNT);
	    console.log("spenderAccountBalanceBeforeTransfer should be equal to " +spenderAccountBalanceBeforeTransfer);
	    assert.equal(spenderAccountBalanceBeforeTransfer, 0);

	    await token.approve(SPENDER_ACCOUNT, APPROVE_AMOUNT);
	    console.log("APPROVE_AMOUNT = " +APPROVE_AMOUNT);

	    let allowance = await token.allowance(MAIN_ACCOUNT, SPENDER_ACCOUNT);
	    console.log("Allowance = " +allowance +"  of SPENDER_ACCOUNT");
	    assert.equal(allowance, APPROVE_AMOUNT);

	    await token.transferFrom(MAIN_ACCOUNT, RECEIVING_ACCOUNT, APPROVE_AMOUNT, {from: SPENDER_ACCOUNT});

	    let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
	    console.log("mainAccountBalanceAfterTransfer  should be equal to " +mainAccountBalanceAfterTransfer);
	    assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY - APPROVE_AMOUNT);

	    let ReceivingAccountBalanceAfterTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
	    console.log("ReceivingAccountBalanceAfterTransfer should be equal to " +ReceivingAccountBalanceAfterTransfer);
	    assert.equal(ReceivingAccountBalanceAfterTransfer, APPROVE_AMOUNT);

	    let spenderAccountBalanceAfterTransfer = await token.balanceOf(SPENDER_ACCOUNT);
	    console.log("spenderAccountBalanceAfterTransfer = " +spenderAccountBalanceAfterTransfer);
	    assert.equal(spenderAccountBalanceAfterTransfer, 0);
    
  	});

  	it('Holdme #9 should throw an error when trying to transfer more than allowed', async function() {
	    console.log("Holdme #9 BEGIN==========================================================");

	    const APPROVE_AMOUNT = 99;
	    
	    let mainAccountBalanceBeforeTransfer = await token.balanceOf(MAIN_ACCOUNT);
	    console.log("mainAccountBalanceBeforeTransfer should be equal to " +mainAccountBalanceBeforeTransfer);
	    assert.equal(mainAccountBalanceBeforeTransfer, INITAL_SUPPLY);

	    let ReceivingAccountBalanceBeforeTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
	    console.log("ReceivingAccountBalanceBeforeTransfer should be equal to " +ReceivingAccountBalanceBeforeTransfer);
	    assert.equal(ReceivingAccountBalanceBeforeTransfer, 0);

	    let spenderAccountBalanceBeforeTransfer = await token.balanceOf(SPENDER_ACCOUNT);
	    console.log("spenderAccountBalanceBeforeTransfer should be equal to " +spenderAccountBalanceBeforeTransfer);
	    assert.equal(spenderAccountBalanceBeforeTransfer, 0);

	    await token.approve(SPENDER_ACCOUNT, APPROVE_AMOUNT);
	    console.log("APPROVE_AMOUNT " +APPROVE_AMOUNT);
	    try {
	      console.log("Try to TransferFrom " +TRANSFER_AMOUNT +" MAIN_ACCOUNT to RECEIVING_ACCOUNT from SPENDER_ACCOUNT");
	      await token.transferFrom(MAIN_ACCOUNT, RECEIVING_ACCOUNT, TRANSFER_AMOUNT, {from: SPENDER_ACCOUNT});
	    } catch(error) {
	      let mainAccountBalanceAfterTransfer = await token.balanceOf(MAIN_ACCOUNT);
	      console.log("mainAccountBalanceAfterTransfer  should be equal to " +mainAccountBalanceAfterTransfer);
	      assert.equal(mainAccountBalanceAfterTransfer, INITAL_SUPPLY);

	      let ReceivingAccountBalanceAfterTransfer = await token.balanceOf(RECEIVING_ACCOUNT);
	      console.log("ReceivingAccountBalanceAfterTransfer should be equal to " +ReceivingAccountBalanceAfterTransfer);
	      assert.equal(ReceivingAccountBalanceAfterTransfer, 0);

	      let spenderAccountBalanceAfterTransfer = await token.balanceOf(SPENDER_ACCOUNT);
	      console.log("spenderAccountBalanceAfterTransfer should be equal to " +spenderAccountBalanceAfterTransfer);
	      assert.equal(spenderAccountBalanceAfterTransfer, 0);

	      return assertJump(error);
	    }
	    assert.fail('should have thrown before');
  	});

  	describe('Holdme #10 validating allowance updates to spender', function() {
    console.log("Holdme #10 BEGIN==========================================================");

    it('Approval should start with zero and should increase by 50 then decrease by 10', async function() {
      
      let preApproved;
  
      preApproved = await token.allowance(MAIN_ACCOUNT, SPENDER_ACCOUNT);
      console.log("preApproved = " +preApproved);
      assert.equal(preApproved, 0);

      await token.increaseApproval(SPENDER_ACCOUNT, 50);
      console.log("Increse approval to  50");
      let postIncrease = await token.allowance(MAIN_ACCOUNT, SPENDER_ACCOUNT);
      console.log("PostIncrese allowance = " +postIncrease);
      assert.equal(postIncrease,50);
      
      await token.decreaseApproval(SPENDER_ACCOUNT, 10);
      console.log("Increse approval by 10");
      let postDecrease = await token.allowance(MAIN_ACCOUNT, SPENDER_ACCOUNT);
      console.log("postDecrease allowance = " +postDecrease);
      assert.equal(postDecrease,40);
    })
  });

});