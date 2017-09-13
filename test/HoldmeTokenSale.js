'use strict';

const assertJump = require('./helpers/assertJump');
var Holdme = artifacts.require('../contracts/Holdme.sol');
var HoldmeTokenSale = artifacts.require('../contracts/HoldmeTokenSale.sol');


contract('HoldmeTokenSale', function(accounts) {

	let MAIN_ACCOUNT = accounts[0];
 	let RECEIVING_ACCOUNT = accounts[1];
 	let SPENDER_ACCOUNT = accounts[2]

 	const INITAL_SUPPLY = 300000000;
 	const TRANSFER_AMOUNT = 10000;
 	const APPROVE_AMOUNT = 1000;

 	const startTime = '';
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

		tokenSale = await HoldmeTokenSale.new(MAIN_ACCOUNT, beneficiary, devone, devtwo, devtree, advisor, shareDev, shareAdvisor);
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

    	let getShareDev = await tokenSale.shareDev();
    	console.log("getShareDev = " +getShareDev);
    	assert.equal(getShareDev, shareDev);
    	
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

    	console.log("What is the balance of MAIN_ACCOUNT?");
    	let mainAccountBalance = await token.balanceOf(MAIN_ACCOUNT);
    	console.log("The balance of the MAIN_ACCOUNT  should be " +INITAL_SUPPLY);
    	assert.equal(mainAccountBalance, INITAL_SUPPLY);
    	
	});



});	