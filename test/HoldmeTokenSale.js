'use strict';


const assertJump = require('../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/test/helpers/assertJump');
var Holdme = artifacts.require('../contracts/Holdme.sol');
var HoldmeTokenSale = artifacts.require('../contracts/HoldmeTokenSale.sol');

contract('HoldmeTokenSale', function(accounts) {

	let MAIN_ACCOUNT = accounts[0];
 	let RECEIVING_ACCOUNT = accounts[1];
 	let SPENDER_ACCOUNT = accounts[2]

 	const INITAL_SUPPLY = 300000000;
 	const TRANSFER_AMOUNT = 10000;
 	const APPROVE_AMOUNT = 1000;

 	let startTimeSale = Math.floor(Date.now() / 1000) + 100 * 24 * 60 * 60; // crowdsale hasn't started
 	let endTimeSale = startTimeSale + 60 * 24 * 60 * 60; // startTimeSale+60 days ==> endtime crowdsale hasn't started

 	let startTimeInProgress = Math.floor(Date.now() / 1000) - 12 * 60 * 60; // ongoing crowdsale
	let startTimeFinished = startTimeInProgress + 60 * 24 * 60 * 60; // ongoing crowdsale

	const beneficiary = '0x1dABC283dB78A4e94cAce54ed0858f606045962e';
	const devone = '0xe6EAaC5bc3BEe75D5f06cCa9674407861e5D8743'; //gilang
	const devtwo = '0xB42b8f0aac75c7231AF3d9403cCFBE667892d2Cf'; //yohanes
	const devtree = '0x2d0156a30af6856cb7d3cf5bb10061e780589751'; //arif 
	const advisor = '0xe377C8b3b3A5427E5E9AbA8C46BCd3F506ED9D38'; //elky metamask TEST
	const shareDev = 9000000 * Math.pow(10,18);
	const shareAdvisor = 24000000 * Math.pow(10,18);

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

		tokenSale = await HoldmeTokenSale.new(MAIN_ACCOUNT, startTimeSale, endTimeSale, beneficiary, devone, devtwo, devtree, advisor, shareDev, shareAdvisor);
		tokenSaleAddress = tokenSale.address;
		console.log("tokenSaleAddress =  " +tokenSaleAddress);

	});

	it("HoldmeTokenSale #1 should return the correct information after construction", async function() {
 		console.log("HoldmeTokenSale #1. BEGIN==========================================================");


		let getBeneficiary = await tokenSale.beneficiary();
    	console.log("getBeneficiary = " +getBeneficiary);
    	assert.equal(getBeneficiary.toUpperCase(), beneficiary.toUpperCase());

    	let getAdvisor = await tokenSale.advisor();
    	console.log("getAdvisor = " +getAdvisor);
    	assert.equal(getAdvisor.toUpperCase(), advisor.toUpperCase());

    	let getDevone = await tokenSale.devone();
    	console.log("getDevone = " +getDevone);
    	assert.equal(getDevone.toUpperCase(), devone.toUpperCase());

    	let getDevtwo = await tokenSale.devtwo();
    	console.log("getDevtwo = " +getDevtwo);
    	assert.equal(getDevtwo.toUpperCase(), devtwo.toUpperCase());

    	let getDevtree = await tokenSale.devtree();
    	console.log("getDevtree = " +getDevtree);
    	assert.equal(getDevtree.toUpperCase(), devtree.toUpperCase());

    	let getShareAdvisor = await tokenSale.shareAdvisor();
    	console.log("getShareAdvisor = " +getShareAdvisor);
    	assert.equal(getShareAdvisor, shareAdvisor);

    	let getShareDev = await tokenSale.shareDev();
    	console.log("getShareDev = " +getShareDev);
    	assert.equal(getShareDev, shareDev);

    	let getStartTimeSale = await tokenSale.startTime();
    	console.log("getStartTimeSale not in progress= " +getStartTimeSale);
    	assert.equal(getStartTimeSale, startTimeSale);

    	let getEndTimeSale = await tokenSale.endTime();
    	console.log("getEndTimeSale not in progress= " +getEndTimeSale);
    	assert.equal(getEndTimeSale, endTimeSale);
    	
	});

	beforeEach(async () => {
    	await tokenSale.setToken(tokenAddress);
	});

	it("HoldmeTokenSale #2 should return the correct information after setToken", async function() {
 		console.log("HoldmeTokenSale #2. BEGIN==========================================================");

		await tokenSale.setToken(tokenAddress);

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

    	let beneficiaryBalance = await token.balanceOf(beneficiary);
    	console.log("The token balance of the beneficiary  should be equal to " +beneficiaryBalance);
    	assert.equal(beneficiaryBalance, 0);

    	let advisorBalance = await token.balanceOf(advisor);
    	console.log("The token balance of the advisor  should be equal to " +advisorBalance);
    	assert.equal(advisorBalance, 0);

    	let devoneBalance = await token.balanceOf(devone);
    	console.log("The token balance of the devone  should be equal to " +devoneBalance);
    	assert.equal(devoneBalance, 0);

    	let devtwoBalance = await token.balanceOf(devtwo);
    	console.log("The token balance of the devtwo  should be equal to " +devtwoBalance);
    	assert.equal(devtwoBalance, 0);

    	let devtreeBalance = await token.balanceOf(devtree);
    	console.log("The token balance of the devtree  should be equal to " +devtreeBalance);
    	assert.equal(devtreeBalance, 0);
    	
	});


	it("HoldmeTokenSale #3 should start the token sale", async function() {
 		console.log("HoldmeTokenSale #3. BEGIN==========================================================");

 		let start = await tokenSale.setStartTime(startTimeInProgress);
    	let end = await tokenSale.setEndTime(startTimeFinished);

 		let getStartTimeSale = await tokenSale.startTime();
    	console.log("getStartTimeSale in progress = " +getStartTimeSale);
    	assert.equal(getStartTimeSale, startTimeInProgress);

    	let getEndTimeSale = await tokenSale.endTime();
    	console.log("getEndTimeSale  in progress = " +getEndTimeSale);
    	assert.equal(getEndTimeSale, startTimeFinished);

	});

    it("HoldmeTokenSale #4 should stop the token sale and restart it again", async function() {
        console.log("HoldmeTokenSale #4. BEGIN==========================================================");

        let start = await tokenSale.setStartTime(startTimeInProgress);
        let end = await tokenSale.setEndTime(startTimeFinished);

        let getStartTimeSale = await tokenSale.startTime();
        console.log("getStartTimeSale in progress = " +getStartTimeSale);
        assert.equal(getStartTimeSale, startTimeInProgress);

        let getEndTimeSale = await tokenSale.endTime();
        console.log("getEndTimeSale  in progress = " +getEndTimeSale);
        assert.equal(getEndTimeSale, startTimeFinished);
        
       
        let saleStoppedBeforeStopped = await tokenSale.saleStopped();
        console.log("saleStoppedBeforeStopped = " +saleStoppedBeforeStopped);
        assert.isFalse(saleStoppedBeforeStopped);

        await tokenSale.emergencyStopSale();

        let saleStoppedAfterStopped = await tokenSale.saleStopped();
        console.log("saleStoppedAfterStopped = " +saleStoppedAfterStopped);
        assert.isTrue(saleStoppedAfterStopped);

        await tokenSale.restartSale();

        let saleStoppedAfterRestart = await tokenSale.saleStopped();
        console.log("saleStoppedAfterRestart = " +saleStoppedAfterRestart);
        assert.isFalse(saleStoppedAfterRestart);

    });

});	