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
import './TokenController.sol';
import '../installed_contracts/ERC23/contracts/Utils.sol/';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/lifecycle/Pausable.sol';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/math/SafeMath.sol';

contract HoldmeTokenSale is TokenController, Pausable {
    using SafeMath for uint256;

    uint256 public constant TOKEN_PRICE_N = 1;                  // initial price in wei (numerator)
    uint256 public constant TOKEN_PRICE_D = 3030;                // initial price in wei (denominator)
    uint256 public constant MAX_GAS_PRICE = 500000000000 wei;    // maximum gas price for contribution transactions

    string public version = "0.1";

    uint256 public startTimePreLaunch = 0;          // Pre-Launch crowdsale start time (in seconds)
    uint256 public endTimePreLaunch = 0;            // Pre-Launch crowdsale end time (in seconds)
    uint256 public startTime = 0;                   // crowdsale start time (in seconds)
    uint256 public endTime = 0;                     // crowdsale end time (in seconds)
    uint256 public totalTokenCap = 1000000 ** 10 *18; // current token cap
    uint256 public totalTokenIssued = 0;            // token issued so far
    uint256 public totalEtherContributed = 0;       // ether contributed so far
    uint256 public totalBtcContributed = 0;         // bitcoin contributed so far
    bytes32 public realEtherCapHash;                // ensures that the real cap is predefined on deployment and cannot be changed later
    address public beneficiary = 0x0;               // address to receive all ether contributions
    address public btcs = 0x0;                      // bitcoin suisse address
    bool    public preLaunch = false;               // Set pre-launch to true or false

    address public devTeam = 0x0;                   // Multi sign address Developer Team

    bool public isFinalized = false;

    uint256 public decimals;

    // triggered on each contribution
    event Contribution(address indexed _contributor, uint256 _amount, uint256 _return);
    event Finalized();

    function HoldmeTokenSale (Holdme _token, address _centralAdmin, uint256 _startTime, uint256 _endTime, address _beneficiary, address _devTeam, uint256 _decimals)
        TokenController(_token)
    { 

        if (_centralAdmin != 0) {
          owner = _centralAdmin;
        } else {
          owner = msg.sender;
        }
        startTime = _startTime;
        endTime = _endTime;
        beneficiary = _beneficiary;
        devTeam = _devTeam;
        decimals = _decimals;
        
    }

    // fallback when investor transfering Ether to the crowdsale contract without calling any functions
    function() payable {
        contributeETH();
    }

    // ensures that the current time is between _startTime (inclusive) and _endTime (exclusive)
    modifier between() {
        assert((now >= startTime && now < endTime));
        _;
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


    function setStartTime(uint256 _newStartTime) 
        public 
        greaterThanZero(_newStartTime)
        onlyOwner 
        returns (bool success) 
    {
        startTime = _newStartTime;
        return true;
    }

    function setEndTime(uint256 _newEndTime) 
        public 
        greaterThanZero(_newEndTime)
        onlyOwner
        returns (bool success) 
    {
        //require(_newEndTime >= startTime);
        endTime = _newEndTime;
        return true;
    }

    /**
        @dev ETH contribution
        can only be called during the crowdsale

        @return tokens issued in return
    */
    function contributeETH()
        public
        payable
        between
        tokenMaxCapNotReached
        validAddress(msg.sender)
        greaterThanZero(msg.value)
        returns (uint256 amount)
    {
        return processContribution(msg.sender, msg.value);
    }


    /**
        @dev COINS contribution
        can only be called during the crowdsale
        only by whitelisted address

        @return tokens issued in return
    */
    function contributeCoins(address _contributor, uint256 _amount)
        public
        onlyOwner
        validAddress(_contributor)
        greaterThanZero(_amount)
        returns (uint256 amount)
    {
        return processContribution(_contributor, _amount);
    }

    /**
        @dev handles contribution logic
        note that the Contribution event is triggered using the sender as the contributor, regardless of the actual contributor

        @return tokens issued in return
    */
    function processContribution(address _contributor, uint256 _amount) private returns (uint256 amount) {
        uint256 tokenAmount = computeReturn(msg.value);
        totalEtherContributed = totalEtherContributed.add(msg.value);// update the total contribution amount
        totalTokenIssued = totalTokenIssued.add(tokenAmount);
        token.issue(msg.sender, tokenAmount);
        sendShares();
        Contribution(msg.sender, msg.value, tokenAmount);
        return tokenAmount;
    }

  
    // @return true if crowdsale event has ended
    function hasEnded() public constant returns (bool) {
        return now > endTime;
    }

    /**
    * @dev Must be called after crowdsale ends, to do some extra finalization
    * work. Calls the contract's finalization function.
    */
    function finalize() onlyOwner {
        require(!isFinalized);
        require(hasEnded());

        //finalization();
        Finalized();
    
        isFinalized = true;
    }

    /**
        @dev computes the number of tokens that should be issued for a given contribution

        @param _contribution    contribution amount

        @return computed number of tokens
    */
    function computeReturn(uint256 _contribution) public constant returns (uint256 amount) {
        uint256 calcAmount;
        uint256 divider;
        if (decimals == 0) {
            divider  = 10 ** 18;
            calcAmount = (_contribution.mul(TOKEN_PRICE_D)).div(TOKEN_PRICE_N).div(divider);
        } else if (decimals == 18) {
            calcAmount = (_contribution.mul(TOKEN_PRICE_D)).div(TOKEN_PRICE_N);
        } else {
            divider = 10 ** (18 - decimals);
            calcAmount = (_contribution.mul(TOKEN_PRICE_D)).div(TOKEN_PRICE_N).div(divider);
        }
        return calcAmount;
    }

    /**
        Sending Company shares for the Team
        Only executed in constructor
    */
    function sendShares() internal {
        uint256 totalShareToIssue =  totalTokenIssued.mul(79).div(21);
        totalTokenIssued = totalTokenIssued.add(totalShareToIssue);

        uint256 beneficiaryToken = totalTokenIssued.mul(51).div(100);
        uint256 devTeamToken = totalTokenIssued.mul(15).div(100);
        uint256 reverseToken = totalTokenIssued.mul(14).div(100);
      
        token.issue(beneficiary, beneficiaryToken);
        token.issue(devTeam, devTeamToken);  
        token.issue(owner, reverseToken);
    }
}