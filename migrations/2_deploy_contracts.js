var Holdme = artifacts.require("./Holdme.sol");
var HoldmeTokenSale = artifacts.require('./HoldmeTokenSale.sol');

module.exports = function(deployer, network, accounts) {

	const HOLDME_MULTISIG =  '0x0bE9FC0FC5d2696edF93F9256F6871217695B4B6'; // iam-dev address
	const INITIAL_SUPPLY = 300000000 * Math.pow(10,18);
	const TOKEN_NAME = 'Holdme shares';
	const TOKEN_SYMBOL = 'HME';
	const DECIMALS = 18;

	var accounts = web3.eth.accounts;
	
	const startTime = '';
	const beneficiary = '0x1dABC283dB78A4e94cAce54ed0858f606045962e';
	const devone = '0xe6EAaC5bc3BEe75D5f06cCa9674407861e5D8743'; //gilang
	const devtwo = '0xB42b8f0aac75c7231AF3d9403cCFBE667892d2Cf'; //yohanes
	const devtree = '0x2d0156a30af6856cb7d3cf5bb10061e780589751'; //arif 
	const advisor = '0xe377C8b3b3A5427E5E9AbA8C46BCd3F506ED9D38'; //elky metamask TEST
	const shareDev = 9000000 * Math.pow(10,18);
	const shareAdvisor = 24000000 * Math.pow(10,18);

	const OWNER_TESTRPC = accounts[0];
	const beneficiary_testrpc = accounts[1];
	const devone_testrpc = accounts[3];
	const devtwo_testrpc  = accounts[4]; 
	const devtree_testrpc =  accounts[5];  
	const advisor_testrpc = accounts[6]; 

	if (network == 'development') {
		deployer.deploy(Holdme, OWNER_TESTRPC, INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL, DECIMALS);
    	deployer.deploy(HoldmeTokenSale, 
    					beneficiary_testrpc, 
    					devone_testrpc, 
    					devtwo_testrpc, 
    					devtree_testrpc, 
    					advisor_testrpc, 
    					shareDev, 
    					shareAdvisor
    	);

	} else if (network == 'ropsten' || network == 'ropsten_gilang') {
		deployer.deploy(Holdme, OWNER_TESTRPC, INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL, DECIMALS);
    	deployer.deploy(HoldmeTokenSale, beneficiary, devone, devtwo, devtree, advisor, shareDev, shareAdvisor);

	}	
};
