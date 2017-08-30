pragma solidity ^0.4.15;


 /**
 * @title Holdme Token Sale
 *
 * Created by IaM <DEV> (Elky Bachtiar) 
 * https://www.iamdeveloper.io
 *
 *
 */

import './Holdme.sol';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol';
import '../installed_contracts/ERC23/installed_contractszeppelin-solidity/contracts/math/SafeMath.sol';

 contract HoldmeTokenSale is Ownable {
    using SafeMath for uint256;

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

    address public devone = 0x0;                    // address Developer 1 to receive 3% Company Share
    address public devtwo = 0x0;                    // address Developer 2 to receive 3% Company Share
    address public devtree = 0x0;                  // address Developer 3 to receive 3% Company Share
    address public advisor = 0x0;                   // address Advisor to receive 8% Company Share

 	// triggered on each contribution
 	event Contribution(address indexed _contributor, uint256 _amount, uint256 _return);


 	function HoldmeTokenSale (uint256 _startTime, address _beneficiary, address _devone, address _devtwo, address _devthree, address _advisor) { 
 		startTime = _startTime;
 		endTime = startTime + DURATION;
 		beneficiary = _beneficiary;
        devone = _devone;
        devtwo = _devtwo;
        devtree = _devthree;
        advisor = _advisor;
        token = Holdme(msg.sender);
        sendShares();
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
        Sending Company shares for the Team
    */
    function sendShares() private {
        uint256 shareDev = token.totalSupply.mul(0.03);
        uint256 shareAdvisor = token.totalSupply.mul(0.08);
        uint256 shareBeneficiary = token.totalSupply.mul(0.51);

        token.transfer(devone, shareDev);               // Developer one receives 3% shares of the Company
        token.transfer(devtwo, shareDev);               // Developer two receives 3% shares of the Company
        token.transfer(devtree, shareDev);              // Developer three receives 3% shares of the Company
        token.transfer(advisor, shareAdvisor);          // Advisor three receives 8% shares of the Company
        token.transfer(beneficiary, shareBeneficiary);  //Beneficiary receives 51% sharesof the Company
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
        token.transfer(msg.sender, tokenAmount); // issue new funds to the contributor in the smart token
        //token.issue(beneficiary, tokenAmount); // issue tokens to the beneficiary
        totalTokenIssued = safeAdd(totalTokenIssued,tokenAmount);

        Contribution(msg.sender, msg.value, tokenAmount);
        return tokenAmount;
    }

 	// fallback when investor transfering Ether to the crowdsale contract without calling any functions
    function() payable {
		contributeETH(msg.sender);
    }

 }
 