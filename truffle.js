require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8547,
      network_id: "*" // Match any network id
    },
    ropsten: {
      host: "localhost",
      port: 8546,
      from: "0x0bE9FC0FC5d2696edF93F9256F6871217695B4B6",
      network_id: "*" // Match any network id
    },
    parity_ropsten: {
      host: "localhost",
      port: 8545,
      from: "0x009BA084d72B44B2E069518F2d41DFaD76C463FE",
      network_id: "*" // Match any network id
    },
    ropsten_gilang: {
      host: "localhost",
      port: 8545,
      from: "0x18d54cca8608d90661244af0feb0a3d3ad367acd",
      network_id: "*" // Match any network id
    }
  }  
};
