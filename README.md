# Hold Me

HOLD ME is an Artificial Intelligence Revolution Live Chat software powered by Ethereum Blockchain


# HOLDME Company Token
Holdme Company Token (HME) is a company share. It means that that the HME is the stock of Holdme coporation.
HME is implemented as an Ethereum-based token on the Ethereum blockchain.
HME complies with the ERC23 standard. ERC23 tokens are backwards compatible with ERC20 tokens. It means that ERC23 supports every ERC20 functional and contracts or services working with ERC20 tokens will work with ERC23 tokens correctly.

## Token Emission
Tokens emission – 300 000 000 (300 millions)
Initial price for 1 token = 0.00033 ETH ( ± 1$=10 tokens)

## Company Shares
Total 2425 ETH funds are expected.
Total company shares: 300 000 000 HME Shares = 100% of the company shares.

* (21,5%) 63 000 000 HME Shares to be available in Token sale:
	* (0,5%) 1 500 000 HME Shares Pre-Launch;
	* Price per token during pre-launch = 0.00022 ETH
	* (21%) 61 500 000 HME Shares Token Sales;
* Price per token during pre-launch = 0.00033 ETH
* (14%) 42 000 000 HME Shares to be reserved for future use.
* (51%) 152 000 000 HME Shares reserved after the owners.
* (15%) 4 500 000 HME Shares goes to team.

Tokens will be sold for ETH, BTC, BCH, DASH and LTC.




## Requirements
To run tests you need to install the following software:

* [Nodejs v6.11.3 LTS](https://nodejs.org/)
* [Truffle v3.4.9](https://github.com/trufflesuite/truffle)
* [EthereumJS TestRPC v4.0.1](https://github.com/ethereumjs/testrpc)
* [Solidity v0.4.15](http://solidity.readthedocs.io/en/develop/installing-solidity.html)
* [Geth](https://github.com/ethereum/go-ethereum/wiki/geth)

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
cd holdme-company-token
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



# Unit Test

## Unit testing scenario's Holdme.sol

###  Holdme #1 should return the correct information after construction
* [X] totalSupply should be equal to 300000000
* [X] name should be equal to "Holdme company token"
* [X] symbol should be should be equal to "HME"
* [X] decimals should be should be equal to 18
* [X] Owner (MAIN_ACCOUNT) should owned all the tokens and this should be equal to 300000000 * Math.pow(10,18)

**Console Output:**
```

Holdme #1. BEGIN==========================================================
The totalSupply of the created Token should equal to 300000000
The Token name should be equal to Holdme company token
The Token symbol should be equal to HME
The Token decimals should be equal to 0
What is the balance of MAIN_ACCOUNT?
The balance of the MAIN_ACCOUNT  should be 300000000
    ✓ Holdme #1 should return the correct information after construction (162ms)


```


### Holdme #2 should return correct balances after transfer
* [X] Bob (main account) has 300000000 tokens (INITIAL_AMOUNT)
* [X] Bob transer 10000 tokens to Alice (TRANSFER_AMOUNT)
* [X] Alice has received 10000 tokens
* [X] Bob has 299990000 (INITIAL_AMOUNT - TRANSFER_AMOUNT) tokens left

**Console Output:**
```

Holdme #2. BEGIN==========================================================
MAIN_ACCOUNT should be able to transfer 10000 token to RECEIVING_ACCOUNT while MAIN_ACCOUNT has 300000000 token
mainAccountBalanceBeforeTransfer should be equal to 300000000
ReceivingAccountBalanceBeforeTransfer should be equal to 0
Try to transfer 10000 from MAIN_ACCOUNT to RECEIVING_ACCOUNT
mainAccountBalanceAfterTransfer should be equal to 299990000
ReceivingAccountBalanceAfterTransfer should be equal to 10000
    ✓ Holdme #2 should return correct balances after transfer (147ms)

```


### Holdme #3 should throw an error when trying to transfer less than 0
* [X] Bob (main account) has 300000000 tokens (INITIAL_AMOUNT)
* [X] Alice have 0 tokens
* [X] Bob try to transer -2 tokens to Alice
* [X] Throw an error when trying to transfer less than 0 
* [X] Bob still have  300000000 tokens left
* [X] Alice still have 0 tokens

**Console Output:**
```

Holdme #3 BEGIN==========================================================
MAIN_ACCOUNT tries to transfer -2 token to RECEIVING_ACCOUNT while TRANSFER_AMOUNT is smaller dan 0
mainAccountBalanceBeforeTransfer should be equal to 300000000
ReceivingAccountBalanceBeforeTransfer should be equal to 0
Try to transfer -2 from MAIN_ACCOUNT to RECEIVING_ACCOUNT
mainAccountBalanceAfterTransfer should be equal to 300000000
ReceivingAccountBalanceAfterTransfer should be equal to 0
    ✓ Holdme #3 should throw an error when trying to transfer less than 0 (120ms)


```


### Holdme #4 should throw an error when trying to transfer more than balance
* [X] Bob (main account) has 300000000 tokens (INITIAL_AMOUNT)
* [X] Alice still have 0 tokens
* [X] Bob try to transer 300000001 tokens to Alice
* [X] Throw an error when trying to transfer more than account balance 
* [X] Bob still have  300000000 tokens
* [X] Alice still have 0 tokens


**Console Output:**
```

Holdme #4 BEGIN==========================================================
MAIN_ACCOUNT tries to transfer 300000001 token to RECEIVING_ACCOUNT while TRANSFER_AMOUNT is greater than than balance of MAIN_ACCOUNT
mainAccountBalanceBeforeTransfer should be equal to 300000000
ReceivingAccountBalanceBeforeTransfer should be equal to0
Try to transfer 300000001 from MAIN_ACCOUNT to RECEIVING_ACCOUNT
mainAccountBalanceAfterTransfer should be equal to 300000000
ReceivingAccountBalanceAfterTransfer  should be equal to 0
    ✓ Holdme #4 should throw an error when trying to transfer more than balance (133ms)

```


### Holdme #5 should throw an error when trying to transfer without any tokens
* [X] Bob (main account) has 0 tokens (INITIAL_AMOUNT)
* [X] Alice still have 0 tokens
* [X] Bob try to transer 10000 tokens to Alice
* [X] Throw an error when trying to transfer more than account balance 
* [X] Bob still have  0 tokens
* [X] Alice still have 0 tokens


**Console Output:**
```

Holdme #5 BEGIN==========================================================
MAIN_ACCOUNT tries to transfer 10000 token to RECEIVING_ACCOUNT while MAIN_ACCOUNT does not have any tokens
tokenAddress =  0x48dd64ca679a464c3e77f240f12c167f2d2b10b0
mainAccountBalanceBeforeTransfer should be equal to 0
ReceivingAccountBalanceBeforeTransfer should be equal to 0
Try to transfer 10000 from MAIN_ACCOUNT to RECEIVING_ACCOUNT
mainAccountBalanceAfterTransfer should be equal to 0
ReceivingAccountBalanceAfterTransfer should be equal to 0
    ✓ Holdme #5 should throw an error when trying to transfer without any tokens (183ms)


```


### Holdme #6 should throw an error when trying to transfer to 0x0
* [X] Bob (main account) has 300000000 tokens (INITIAL_AMOUNT)
* [X] Bob try to transer 100 tokens to 0x0
* [X] Throw an error when trying to transfer to 0x0
* [X] Bob still have  300000000 tokens

**Console Output:**
```

Holdme #6 BEGIN==========================================================
mainAccountBalanceBeforeTransfer should be equal to 300000000
Try to transfer 10000 from MAIN_ACCOUNT to 0x0
mainAccountBalanceAfterTransfer should be equal to 300000000
    ✓ "Holdme #6 should throw an error when trying to transfer to 0x0 (87ms)


```
