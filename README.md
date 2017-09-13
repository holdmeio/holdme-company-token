# Hold Me

HOLD ME is an Artificial Intelligence Revolution Live Chat software powered by Ethereum Blockchain


# HOLDME Company Token
Holdme Company Token (HME) is a company share. It means that that the HME is the stock of Holdme coporation.
HME is implemented as an Ethereum-based token on the Ethereum blockchain.
HME complies with the ERC23 standard. ERC23 tokens are backwards compatible with ERC20 tokens. It means that ERC23 supports every ERC20 functional and contracts or services working with ERC20 tokens will work with ERC23 tokens correctly.


## Requirements
To run tests you need to install the following software:

* [Nodejs v6.11.3 LTS] (https://nodejs.org/)
* [Truffle v3.4.9] (https://github.com/trufflesuite/truffle)
* [EthereumJS TestRPC v4.0.1] (https://github.com/ethereumjs/testrpc)
* [Solidity v0.4.15] (http://solidity.readthedocs.io/en/develop/installing-solidity.html)
* [Geth] (https://github.com/ethereum/go-ethereum/wiki/geth)

# Getting Started
Holdme integrates with Truffle, an Ethereum development environment. 
Testrpc is a Node.js based Ethereum client for testing and development. It uses ethereumjs to simulate full client behavior and make developing Ethereum applications much faster. It also includes all popular RPC functions and features (like events) and can be run deterministically to make development a breeze.

Please install truffle and testrpc to be able to test HME smart contracts.

## Install Truffle
```shell
npm install -g truffle
```


## Install TestRPC
```shell
npm install -g ethereumjs-testrpc
```

## Install geth
```shell
npm install -g geth
```

## Get HME smart contracts
```shell
git clone https://github.com/iam-dev/ERC23.git
```

# How to test on Development Network
Open the terminal and run the following commands:
```shell
testrpc
```
Open another terminal and run the following commands:
```shell
cd hme
truffle compile --all

```

## How to do unit testing
```shell
truffle test --network development
```

## Migrate to testrpc
```shell
truffle migrate --network development
```

# How to test on Ropsten Test Network
Change the Ethereum Wallet addrress in truffle.js file. Add your  ETH wallet address

Open the terminal and run the following commands:
```shell
geth --testnet --syncmode "fast" --unlock "YOUR ETH WALLET ADDRESS" --rpc --rpcapi "eth,net,web3,personal" --rpccorsdomain '*' --rpcaddr localhost --rpcport 8546 console
```

Open another terminal and run the following commands:
```shell
cd hme
truffle compile --all
truffle migrate --network ropsten
```