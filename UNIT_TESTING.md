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


### Holdme #7 should return the correct allowance amount after approval
* [X] Bob (main account) has 300000000 tokens (INITIAL_AMOUNT)
* [X] Alice (spender) still have 0 tokens
* [X] Bob gives approval to Alice to be able to  transfer 1000 tokens
* [X] Allowance of Alice must be tokens
* [X] Bob still have  300000000 tokens
* [X] Alice still have 0 tokens


**Console Output:**
```

Holdme #7 BEGIN==========================================================
SPENDER_ACCOUNT allowed to transfer 1000 because SPENDER_ACCOUNT has 1000 approved amount
mainAccountBalanceBeforeTransfer should be equal to 300000000
spenderAccountBalanceBeforeTransfer should be equal to 0
APPROVE_AMOUNT = 1000
Allowance = 1000  of SPENDER_ACCOUNT
mainAccountBalanceAfterTransfer should be equal to 300000000
spenderAccountBalanceAfterTransfer should be equal to 0
    ✓ Holdme #7 should return the correct allowance amount after approval (191ms)

```


### Holdme #8 should return correct balances after transfering from another account
* [X] Bob (main account) has 300000000 tokens (INITIAL_AMOUNT)
* [X] Alice (spender) has 0 tokens
* [X] Chris (receiver) has 0 tokens
* [X] Bob gives approval to Alice to be able to transferFrom 1000
* [X] Allowance of Alice must be 1000
* [X] Alice transfer 1000 tokens to Chris
* [X] Bob will have 299999000 tokens left
* [X] Chris will have 1000 tokens left
* [X] Alice still have 0 tokens

**Console Output:**
```

Holdme #8 BEGIN==========================================================
mainAccountBalanceBeforeTransfer=300000000
ReceivingAccountBalanceBeforeTransfer should be equal to 0
spenderAccountBalanceBeforeTransfer should be equal to 0
APPROVE_AMOUNT = 1000
Allowance = 1000  of SPENDER_ACCOUNT
mainAccountBalanceAfterTransfer  should be equal to 299999000
ReceivingAccountBalanceAfterTransfer should be equal to 1000
spenderAccountBalanceAfterTransfer = 0
    ✓ Holdme #8 should return correct balances after transfering from another account (259ms)


```


### Holdme #9 should throw an error when trying to transfer more than allowed
* [X] Bob (main account) has 300000000 tokens (INITIAL_AMOUNT)
* [X] Alice (spender) have 0 tokens
* [X] Chris (receiver) have 0 tokens
* [X] Bob gives approval to Alice to be able to transferFrom 99
* [X] Alice transfer 10000 tokens to Chris
* [X] Throw an error when trying to transferFrom more than allowed
* [X] Bob still have 99 tokens left
* [X] Chris will have 0 tokens left
* [X] Alice still have 0 tokens

**Console Output:**
```

Holdme #9 BEGIN==========================================================
mainAccountBalanceBeforeTransfer should be equal to 300000000
ReceivingAccountBalanceBeforeTransfer should be equal to 0
spenderAccountBalanceBeforeTransfer should be equal to 0
APPROVE_AMOUNT 99
Try to TransferFrom 10000 MAIN_ACCOUNT to RECEIVING_ACCOUNT from SPENDER_ACCOUNT
mainAccountBalanceAfterTransfer  should be equal to 300000000
ReceivingAccountBalanceAfterTransfer should be equal to 0
spenderAccountBalanceAfterTransfer should be equal to 0
    ✓ Holdme #9 should throw an error when trying to transfer more than allowed (229ms)


```


### Holdme #10 Approval should start with zero and should increase by 50 then decrease by 10
* [X] Pre approved amount should be 0
* [X] Increse approval with 50
* [X] Post increse allowance should be 50
* [X] Increse approval by 10
* [X] Post Decrease allowance should be 40

**Console Output:**
```

Holdme #10 validating allowance updates to spender
tokenAddress =  0x6db318ba4a2691a89623fdb37bff07ffd7e3d4fb
preApproved = 0
Increse approval to  50
PostIncrese allowance = 50
Increse approval by 10
postDecrease allowance = 40
      ✓ Approval should start with zero and should increase by 50 then decrease by 10 (159ms)
      
```

###  Holdme #11 should issue a given amount of tokens to a given address
* [X] mainAccountBalanceBeforeIssue should be equal to INITAL_SUPPLY = 300000000
* [X] Issue 100 tokens
* [X] mainAccountBalanceAfterIssue should be equal to INITAL_SUPPLY + MINT_AMOUNT = 300000100
* [X] totalSupplyAfterIssue should be equal to INITAL_SUPPLY + MINT_AMOUNT = 300000100

**Console Output:**
```

Holdme #11 BEGIN==========================================================
mainAccountBalanceBeforeIssue = 300000000 should equal to INITAL_SUPPLY = 300000000
mainAccountBalanceAfterIssue = 300000100 should equal to INITAL_SUPPLY + ISSUE_AMOUNT = 300000100
totalSupplyAfterIssue = 300000000 should equal to INITAL_SUPPLY + ISSUE_AMOUNT = 300000100
    ✓ Holdme #11 should issue a given amount of tokens to a given address (134ms)


```

### Holdme #12 should fail to issue after call to finishIssuance
* [X] mainAccountBalanceBeforeIssue should be equal to 300000000
* [X] issuanceFinished = true
* [X] Issue a new token 
* [X] Issuance a new token should fail
* [X] receivingAccountBalanceAfterIssue should be equal to 0

**Console Output:**
```

Holdme #12 BEGIN==========================================================
mainAccountBalanceBeforeIssue = 300000000 should equal to INITAL_SUPPLY = 300000000
issuanceFinished = true
receivingAccountBalanceAfterIssue = 0 should equal to  0
    ✓ Holdme #12 should fail to issue after call to finishIssuance (174ms)

```


## Unit testing scenario's HoldmeTokenSale.sol

###  HoldmeTokenSale #1 should return the correct information after construction
* [X] Beneficiary should be equal to 0x1dabc283db78a4e94cace54ed0858f606045962e
* [X] Advisor should be equal to 0xe377c8b3b3a5427e5e9aba8c46bcd3f506ed9d38
* [X] Devone address should be equal to 0xe6eaac5bc3bee75d5f06cca9674407861e5d8743
* [X] Devtwo address should be equal to 0xb42b8f0aac75c7231af3d9403ccfbe667892d2cf
* [X] Devthree address should be equal to 0x2d0156a30af6856cb7d3cf5bb10061e780589751
* [X] Company Share of Advisor should be equal to 24000000
* [X] StartTimeSale not in progress should be equal to 100 days from now
* [X] getEndTimeSale not in progress should be equal StartTimeSale + 60 days
* [X] totalSupply should be equal to 300000000
* [X] name should be equal to "Holdme company token"
* [X] symbol should be should be equal to "HME"
* [X] decimals should be should be equal to 18
* [X] Owner (MAIN_ACCOUNT) should owned all the tokens and this should be equal to 300000000 * Math.pow(10,18)
* [X] The Token balance of beneficiary should be 0
* [X] The Token balance of advisor should be 0
* [X] The Token balance of devone should be 0
* [X] The Token balance of devtwo should be 0
* [X] The Token balance of devtree should be 0x0

**Console Output:**
```

HoldmeTokenSale #1. BEGIN==========================================================
getBeneficiary = 0xfc393e198aac7327b2e2c67494d1fc07c5632b3d
getAdvisor = 0x52322cd3fcd5d141e7ca5c49f5a895b5779e4241
getDevone = 0x171854d486bf0cb96669f7ad5514648c5fb968a5
getDevtwo = 0x9a03f20aaa03028a3fdf188a54fe121ba1d6d3a4
getDevtree = 0xd14bf9d79b9aa2460b275d17c01649cf46fcdc5c
getShareAdvisor = 2.4e+25
getShareDev = 9e+24
getStartTimeSale not in progress= 1514536066
getEndTimeSale not in progress= 1519720066
The totalSupply of the created Token should equal to 300000000
The Token name should be equal to Holdme company token
The Token symbol should be equal to HME
The Token decimals should be equal to 0
The token balance of the MAIN_ACCOUNT  should be 300000000
The token balance of the beneficiary  should be equal to 0
The token balance of the advisor  should be equal to 0
The token balance of the devone  should be equal to 0
The token balance of the devtwo  should be equal to 0
The token balance of the devtree  should be equal to 0
    ✓ HoldmeTokenSale #1 should return the correct information after construction (465ms)

```



### HoldmeTokenSale #2 should start the token sale
* [X] StartTimeSale in progress should be equal to today
* [X] getEndTimeSale in progress should be equal today + 60

**Console Output:**
```

HoldmeTokenSale #2. BEGIN==========================================================
getStartTimeSale in progress= 1505266917
getEndTimeSale  in progress= 1510450917
    ✓ HoldmeTokenSale #2 should start the token sale (109ms)

```
### HoldmeTokenSale #3 should stop the token sale and restart it again
* [X] StartTimeSale in progress should be equal to today
* [X] getEndTimeSale in progress should be equal today + 60
* [X] saleStoppedBefore should be equal to false
* [X] emergencyStopSale() function has been called
* [X] restartSale() function has been called
* [X] saleStoppedAfterRestart should be equal to false

**Console Output:**
```

HoldmeTokenSale #3. BEGIN==========================================================
getStartTimeSale in progress = 1505270075
getEndTimeSale  in progress = 1510454075
saleStoppedBeforeStopped = false
saleStoppedAfterStopped = true
saleStoppedAfterRestart = false
    ✓ HoldmeTokenSale #3 should stop the token sale and restart it again (263ms)

```

### HoldmeTokenSale #4 should able to contribute ETH after start the token sale
* [X] StartTimeSale in progress should be equal to today
* [X] getEndTimeSale in progress should be equal today + 60
* [X] ethContributerBalanceBeforeInvestment should be equal to 100 eth
* [X] ethBenificiaryBalanceBeneficiaryBeforeInvestment should be equal to 100 eth
* [X] Contributer contribute 50 ether
* [X] totalEtherContributed should be equal to 50 ether
* [X] totalTokenIssued  should be equal to 5000 tokens

**Console Output:**
```

HoldmeTokenSale #4. BEGIN==========================================================
getStartTimeSale in progress = 1505852866
getEndTimeSale  in progress = 1511036866
ethContributerBalanceBeforeInvestment = 100000000000000000000
ethBenificiaryBalanceBeneficiaryBeforeInvestment = 100000000000000000000
totalEtherContributed = 50
totalTokenIssued = 5000
contributerTokenBalanceAfterInvestments = 5000
ethContributerBalanceAfterInvestment = 100000000000000000000
ethBenificiaryBalanceBeneficiaryAfterInvestment = 100000000000000000000
    ✓ HoldmeTokenSale #4 should able to contribute ETH after start the token sale (707ms)

```