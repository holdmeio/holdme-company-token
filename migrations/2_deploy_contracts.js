var Holdme = artifacts.require("../installed_contracts/ERC23/contracts/ClientStandard23Token.sol");
var HoldmeTokenSale = artifacts.require('./HoldmeTokenSale');

module.exports = function(deployer) {

	const holdmeMS =    '0x12345'
	const INITIAL_SUPPLY = 300000000 * Math.pow(10,18);
	const TOKEN_NAME = 'Holdme shares';
	const TOKEN_SYMBOL = 'HME';
	const DECIMALS = 18;

    deployer.deploy(Holdme, holdmeMS, INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL, DECIMALS);
    deployer.deploy(HoldmeTokenSale,);
  
};
