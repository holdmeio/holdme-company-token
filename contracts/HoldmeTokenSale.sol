pragma solidity ^0.4.15;


 /**
 * @title Holdme Token Sale
 *
 * Created by IaM <DEV> (Elky Bachtiar) 
 * https://www.iamdeveloper.io
 *
 *
 */

 contract HoldmeTokenSale is Ownable {
 	uint256 public constant DURATION = 14 days;                 // crowdsale duration
 	uint256 public constant ETH_PRICE_PER_TOKEN = 1.            // 1 Token = 1 ETH 
 	uint256 public constant TOKEN_PRICE_N = 1;                  // initial price in wei (numerator)
    uint256 public constant TOKEN_PRICE_D = 100;                // initial price in wei (denominator)

 	Holdme public token;        // The token

 	string public version = '0.1';

    uint256 public startTime = 0;                   // crowdsale start time (in seconds)
    uint256 public endTime = 0;                     // crowdsale end time (in seconds)
    uint256 public totalTokenCap = 1000000;         // current token cap
    uint256 public totalTokenIssued = 0;			// token issued so far
    uint256 public totalEtherContributed = 0;       // ether contributed so far
    uint256 public totalBtcContributed = 0;         // bitcoin contributed so far
    bytes32 public realEtherCapHash;                // ensures that the real cap is predefined on deployment and cannot be changed later
    address public beneficiary = 0x0;               // address to receive all ether contributions
    address public btcs = 0x0;                      // bitcoin suisse address

 	// triggered on each contribution
 	event Contribution(address indexed _contributor, uint256 _amount, uint256 _return);


 	function HoldmeTokenSale (uint256 _startTime) { 
 		startTime = _startTime;
 		endTime = startTime + DURATION;
 		beneficiary = _beneficiary;
 	}

 	// ensures that we didn't reach the token max cap
    modifier tokenMaxCapNotReached() {
        assert(totalTokenIssued <= totalTokenCap);
        _;
    }

    // verifies that the gas price is lower than 50 gwei
    modifier validGasPrice() {
        assert(tx.gasprice <= MAX_GAS_PRICE);
        _;
    }

    /**
        @dev computes the number of tokens that should be issued for a given contribution

        @param _contribution    contribution amount

        @return computed number of tokens
    */
    function computeReturn(uint256 _contribution) public constant returns (uint256) {
        return safeMul(_contribution, TOKEN_PRICE_D) / TOKEN_PRICE_N;
    }

 	/**
        @dev ETH contribution
        can only be called during the crowdsale

        @return tokens issued in return
    */
    function contributeETH(address _contributer)
        public
        payable
        between(startTime, endTime)
        returns (uint256 amount)
    {
        return processContribution(_contributer);
    }

    /**
        @dev handles contribution logic
        note that the Contribution event is triggered using the sender as the contributor, regardless of the actual contributor

        @return tokens issued in return
    */
    function processContribution() private
        active
        tokenMaxCapNotReached()
        validGasPrice
        returns (uint256 amount)
    {
        uint256 tokenAmount = computeReturn(msg.value);
        assert(beneficiary.send(msg.value)); // transfer the ether to the beneficiary account
        totalEtherContributed = safeAdd(totalEtherContributed, msg.value); // update the total contribution amount
        token.issue(msg.sender, tokenAmount); // issue new funds to the contributor in the smart token
        token.issue(beneficiary, tokenAmount); // issue tokens to the beneficiary
        totalTokenIssued = safeAdd(totalTokenIssued,tokenAmount);

        Contribution(msg.sender, msg.value, tokenAmount);
        return tokenAmount;
    }

 	// fallback when investor transfering Ether to the crowdsale contract without calling any functions
    function() payable {
		contributeETH(msg.sender);
    }

 }
 