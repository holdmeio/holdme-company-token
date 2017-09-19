
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4700000
    },
    ropsten: {
      host: "localhost",
      port: 8546,
      from: "0x0bE9FC0FC5d2696edF93F9256F6871217695B4B6",
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
