var Holdme = artifacts.require("./Holdme.sol");
var HoldmeTokenSale = artifacts.require("./HoldmeTokenSale.sol");

module.exports = function(deployer) {;
  await deployer.deploy(Holdme);
  deployer.deploy(HoldmeTokenSale, Holdme.address);
};
