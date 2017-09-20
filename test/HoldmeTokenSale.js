'use strict';

import ether from '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/test/helpers/ether';
import {advanceBlock} from '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/test/helpers/advanceToBlock';
import latestTime from '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/test/helpers/latestTime';
import {increaseTimeTo, duration} from '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/test/helpers/increaseTime';
import EVMThrow from '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/test/helpers/EVMThrow';

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()


const assertJump = require('../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/test/helpers/assertJump');
var Holdme = artifacts.require('../contracts/Holdme.sol');
var HoldmeTokenSale = artifacts.require('../contracts/HoldmeTokenSale.sol');

contract('HoldmeTokenSale', function(accounts) {


	let MAIN_ACCOUNT = accounts[0];
 	let RECEIVING_ACCOUNT = accounts[1];
 	let SPENDER_ACCOUNT = accounts[2];
    let CONTRIBUTER = accounts[3];
    let BENIFICIARY = accounts[4];
    let DEVTEAM = accounts[5];
  
 	const INITAL_SUPPLY = 0;
    const CONTRIBUTE_AMOUNT = ether(1);

 	let startTimeSale = Math.floor(Date.now() / 1000) + 100 * 24 * 60 * 60; // crowdsale hasn't started
 	let endTimeSale = startTimeSale + 60 * 24 * 60 * 60; // startTimeSale+60 days ==> endtime crowdsale hasn't started

 	let startTimeInProgress = Math.floor(Date.now() / 1000) - 12 * 60 * 60; // ongoing crowdsale
    let endTimeInProgress = startTimeInProgress + 60 * 24 * 60 * 60; // ongoing crowdsale

	let endTimeFinished = startTimeInProgress - 30 * 24 * 60 * 60; // ongoing crowdsale

 	let tokenName = "Holdme company token";
 	let tokenSymbol = "HME";
 	let tokenDecimals = 0;

 	let token;
 	let tokenAddress;
 	let tokenSale;
 	let tokenSaleAddress;


	beforeEach(async () => {
    	token = await Holdme.new(MAIN_ACCOUNT, INITAL_SUPPLY, tokenName, tokenSymbol, tokenDecimals);
    	tokenAddress = token.address;
		console.log("tokenAddress =  " +tokenAddress);

		tokenSale = await HoldmeTokenSale.new(tokenAddress, MAIN_ACCOUNT, startTimeSale, endTimeSale, BENIFICIARY, DEVTEAM, tokenDecimals);
		tokenSaleAddress = tokenSale.address;
		console.log("tokenSaleAddress =  " +tokenSaleAddress);

        var test = await token.transferOwnership(tokenSaleAddress);
        console.log(test.logs[0]);

	});

	it("HoldmeTokenSale #1 should return the correct information after construction", async function() {
 		console.log("HoldmeTokenSale #1. BEGIN==========================================================");
   
		let getBeneficiary = await tokenSale.beneficiary();
    	console.log("getBeneficiary = " +getBeneficiary);
    	assert.equal(getBeneficiary.toUpperCase(), BENIFICIARY.toUpperCase());

    	let getStartTimeSale = await tokenSale.startTime();
    	console.log("getStartTimeSale not in progress= " +getStartTimeSale);
    	assert.equal(getStartTimeSale, startTimeSale);

    	let getEndTimeSale = await tokenSale.endTime();
    	console.log("getEndTimeSale not in progress= " +getEndTimeSale);
    	assert.equal(getEndTimeSale, endTimeSale);

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
        

        let mainAccountBalance = await token.balanceOf(MAIN_ACCOUNT);
        console.log("The token balance of the MAIN_ACCOUNT  should be " +INITAL_SUPPLY);
        assert.equal(mainAccountBalance, INITAL_SUPPLY);

        let beneficiaryBalance = await token.balanceOf(BENIFICIARY);
        console.log("The token balance of the beneficiary  should be equal to " +beneficiaryBalance);
        assert.equal(beneficiaryBalance, 0);

        let devTeamBalance = await token.balanceOf(DEVTEAM);
        console.log("The token balance of the developer team  should be equal to " +devTeamBalance);
        assert.equal(devTeamBalance, 0);
    	
	});

	it("HoldmeTokenSale #2 should start the token sale", async function() {
 		console.log("HoldmeTokenSale #2. BEGIN==========================================================");

 		let start = await tokenSale.setStartTime(startTimeInProgress);
    	let end = await tokenSale.setEndTime(endTimeInProgress);

 		let getStartTimeSale = await tokenSale.startTime();
    	console.log("getStartTimeSale in progress = " +getStartTimeSale);
    	assert.equal(getStartTimeSale, getStartTimeSale);

    	let getEndTimeSale = await tokenSale.endTime();
    	console.log("getEndTimeSale  in progress = " +getEndTimeSale);
    	assert.equal(getEndTimeSale, getEndTimeSale);

	});

    it("HoldmeTokenSale #3 should stop the token sale and restart it again", async function() {
        console.log("HoldmeTokenSale #3. BEGIN==========================================================");

        let start = await tokenSale.setStartTime(startTimeInProgress);
        let end = await tokenSale.setEndTime(endTimeInProgress);

        let getStartTimeSale = await tokenSale.startTime();
        console.log("getStartTimeSale in progress = " +getStartTimeSale);
        assert.equal(getStartTimeSale, startTimeInProgress);

        let getEndTimeSale = await tokenSale.endTime();
        console.log("getEndTimeSale  in progress = " +getEndTimeSale);
        assert.equal(getEndTimeSale, getEndTimeSale);
        
       
        let saleStoppedBeforeStopped = await tokenSale.paused();
        console.log("saleStoppedBeforeStopped = " +saleStoppedBeforeStopped);
        assert.isFalse(saleStoppedBeforeStopped);

        await tokenSale.pause();

        let saleStoppedAfterStopped = await tokenSale.paused();
        console.log("saleStoppedAfterStopped = " +saleStoppedAfterStopped);
        assert.isTrue(saleStoppedAfterStopped);

        await tokenSale.unpause();

        let saleStoppedAfterRestart = await tokenSale.paused();
        console.log("saleStoppedAfterRestart = " +saleStoppedAfterRestart);
        assert.isFalse(saleStoppedAfterRestart);

    });


    it("HoldmeTokenSale #4 should able to contribute ETH after start the token sale", async function() {
        console.log("HoldmeTokenSale #4. BEGIN==========================================================");

        let start = await tokenSale.setStartTime(startTimeInProgress);
        let end = await tokenSale.setEndTime(endTimeInProgress);

        let getStartTimeSale = await tokenSale.startTime();
        console.log("getStartTimeSale in progress = " +startTimeInProgress);
        assert.equal(getStartTimeSale, startTimeInProgress);

        let getEndTimeSale = await tokenSale.endTime();
        console.log("getEndTimeSale  in progress = " +endTimeInProgress);
        assert.equal(getEndTimeSale, endTimeInProgress);

        const ethContributerBalanceBeforeInvestment = await web3.eth.getBalance(CONTRIBUTER);
        console.log("ethContributerBalanceBeforeInvestment = " +ethContributerBalanceBeforeInvestment);

        const ethBenificiaryBalanceBeneficiaryBeforeInvestment = await web3.eth.getBalance(BENIFICIARY);
        console.log("ethBenificiaryBalanceBeneficiaryBeforeInvestment = " +ethBenificiaryBalanceBeneficiaryBeforeInvestment);
            
        var sale = await tokenSale.contributeETH({from: CONTRIBUTER,value: web3.toWei(1, 'ether')});

        var totalEtherContributed = await tokenSale.totalEtherContributed();
        console.log("totalEtherContributed = " +totalEtherContributed);

        var totalTokenIssued = await tokenSale.totalTokenIssued();
        console.log("totalTokenIssued = " +totalTokenIssued);

        const contributerTokenBalanceAfterInvestments = await token.balanceOf(CONTRIBUTER);
        console.log("contributerTokenBalanceAfterInvestments = " +contributerTokenBalanceAfterInvestments);


        const ethContributerBalanceAfterInvestment = await web3.eth.getBalance(CONTRIBUTER);
        console.log("ethContributerBalanceAfterInvestment = " +ethContributerBalanceAfterInvestment);

    });
    /*
    it("HoldmeTokenSale #5 should able send shares after end sales", async function() {
        console.log("HoldmeTokenSale #6. BEGIN==========================================================");

        let start = await tokenSale.setStartTime(startTimeInProgress);
        let end = await tokenSale.setEndTime(endTimeInProgress);

        let getStartTimeSale = await tokenSale.startTime();
        console.log("getStartTimeSale in progress = " +getStartTimeSale);
        assert.equal(getStartTimeSale, startTimeInProgress);

        let getEndTimeSale = await tokenSale.endTime();
        console.log("getEndTimeSale  in progress = " +getEndTimeSale);
        assert.equal(getEndTimeSale, endTimeInProgress);

        const ethContributerBalanceBeforeInvestment = await web3.eth.getBalance(CONTRIBUTER);
        console.log("ethContributerBalanceBeforeInvestment = " +ethContributerBalanceBeforeInvestment);

        var sale = await tokenSale.contributeETH(CONTRIBUTER, {value: web3.toWei(1, 'ether')});
        //console.log(sale);

        const contributerTokenBalanceAfterInvestments = await token.balanceOf(CONTRIBUTER);
        console.log("contributerTokenBalanceAfterInvestments = " +contributerTokenBalanceAfterInvestments);


        const ethContributerBalanceAfterInvestment = await web3.eth.getBalance(CONTRIBUTER);
        console.log("ethContributerBalanceAfterInvestment = " +ethContributerBalanceAfterInvestment);

        var totalTokenIssued = await tokenSale.totalTokenIssued();
        console.log("totalTokenIssued = " +totalTokenIssued);

        let finish = await tokenSale.setEndTime(endTimeFinished);
        console.log("finish = " +endTimeFinished);


       // await tokenSale.finalize();

        var totalTokenIssuedAfterFinish = await tokenSale.totalTokenIssued();
        console.log("totalTokenIssuedAfterFinish = " +totalTokenIssuedAfterFinish);

        const beneficiaryBalanceAfterFinish = await token.balanceOf(beneficiary);
        console.log("beneficiaryBalanceAfterFinish = " +beneficiaryBalanceAfterFinish);

        //const devTeamBalanceAfterFinish = await token.balanceOf(DEVTEAM);
        //console.log("devTeamBalanceAfterFinish = " +devTeamBalanceAfterFinish);

        //const ownerBalanceAfterFinish = await token.balanceOf(MAIN_ACCOUNT);
        //console.log("ownerBalanceAfterFinish = " +ownerBalanceAfterFinish);
        
    });*/

});	