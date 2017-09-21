var Holdme = artifacts.require("./Holdme.sol");
var HoldmeTokenSale = artifacts.require('./HoldmeTokenSale.sol');

module.exports = function(deployer, network, accounts) {

	const HOLDME_MULTISIG =  '0x0bE9FC0FC5d2696edF93F9256F6871217695B4B6'; // iam-dev address
	const INITIAL_SUPPLY = 300000000 * Math.pow(10,18);
	const TOKEN_NAME = 'Holdme shares';
	const TOKEN_SYMBOL = 'HME';
	const DECIMALS = 18;

	
	
	const startTimeSale = Math.floor(Date.now() / 1000) + 100 * 24 * 60 * 60; // crowdsale hasn't started
 	const endTimeSale = startTimeSale + 60 * 24 * 60 * 60; // startTimeSale+60 days ==> endtime crowdsale hasn't started

 	//ropsten
 	const ROPSTEN = '0x0bE9FC0FC5d2696edF93F9256F6871217695B4B6';
	const beneficiary = '0x1dABC283dB78A4e94cAce54ed0858f606045962e';
	const devTeam_ropsten = '0xe377C8b3b3A5427E5E9AbA8C46BCd3F506ED9D38'; 		//should change to Multisign Dev wallet
	const yohanes = '0xB42b8f0aac75c7231AF3d9403cCFBE667892d2Cf';
	const WHITELISTS = [ROPSTEN, yohanes]; 

	const PARITY_ROPSTEN = '0x009BA084d72B44B2E069518F2d41DFaD76C463FE';

	//development network
	//var accounts = web3.eth.accounts;
	const OWNER_TESTRPC = accounts[0];
	const beneficiary_testrpc = accounts[1];
	const devTeam_testrpc = accounts[5];
	const whitelistAccount = accounts[9];

	const WHITELISTS_TESTRPC = [OWNER_TESTRPC, whitelistAccount]; 


	if (network == 'development') {
		deployer.deploy(Holdme, OWNER_TESTRPC, INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL, DECIMALS).then(function(instance) {
			token=instance
			return deployer.deploy(HoldmeTokenSale, Holdme.address, OWNER_TESTRPC, startTimeSale, endTimeSale, beneficiary_testrpc, devTeam_testrpc, WHITELISTS_TESTRPC, DECIMALS);
			return token.transferOwnership(HoldmeTokenSale.address);
		});
	} else if (network == 'ropsten') {
		deployer.deploy(Holdme, ROPSTEN, INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL, DECIMALS).then(function(instance) {
    		return deployer.deploy(HoldmeTokenSale, Holdme.address, ROPSTEN, startTimeSale, endTimeSale, beneficiary, devTeam_ropsten, WHITELISTS, DECIMALS);
    		return token.transferOwnership(HoldmeTokenSale.address);
    	});
	} else if (network == 'parity_ropsten') {
		deployer.deploy(Holdme, PARITY_ROPSTEN, INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL, DECIMALS).then(function(instance) {
    		return deployer.deploy(HoldmeTokenSale, Holdme.address, PARITY_ROPSTEN, startTimeSale, endTimeSale, beneficiary, devTeam_ropsten, WHITELISTS, DECIMALS);
    		return token.transferOwnership(HoldmeTokenSale.address);
    	});
	}	
};
