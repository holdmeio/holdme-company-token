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

    uint256 public decimals;                                    // To be able to calculate the token amount
    uint256 public constant TOKEN_PRICE_N = 1;                  // initial price in wei (numerator)
    uint256 public constant TOKEN_PRICE_D = 3030;               // initial price in wei (denominator)
    uint256 public constant MAX_GAS_PRICE = 60000000000 wei;    // maximum gas price for contribution transactions

    string public version = "1.0";

    uint256 public startTime = 1506729540;                      // crowdsale start time (in seconds) Presale starts 2017/09/29 23:59:00
    uint256 public endTime = 1507420740;                        // crowdsale end time (in seconds) Presale ends 2017/10/07 23:59:00
    uint256 public totalTokenCap = 300000000;                   // current token cap
    uint256 public totalTokenIssued = 0;                        // token issued so far
    uint256 public totalEtherContributed = 0;                   // ether contributed so far
    address public beneficiary = 0x0;                           // address to receive all ether contributions
    address public devTeam = 0x0;                               // Multi sign address Developer Team
    bool    public preLaunch = false;                           // Set pre-launch to true or false
    bool    public isFinalized = false;                         // When Pre-Sale or sale is end, isFinalized will set to true

 


    // triggered on each contribution
    event Contribution(address indexed _contributor, uint256 _amount, uint256 _return);
    event Finalized();

    function HoldmeTokenSale (Holdme _token, address _centralAdmin, uint256 _startTime, uint256 _endTime, address _beneficiary, address _devTeam, address[] _whitelists ,uint256 _decimals)
        TokenController(_token)
        Whitelist(_whitelists, maxAddresses)
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

    // verifies that the gas price is lower than 60 gwei
    modifier validGasPrice() {
        assert(tx.gasprice <= MAX_GAS_PRICE);
        _;
    }
    
     /**
    *   @dev startPresale. Start the Pre-sale
    *      
    *   @return A boolean that indicates if the operation was successful.
    */
    function startPresale() onlyOwner returns (bool success) {
        require(!preLaunch);
        preLaunch = true;
        return true;
    }

    /**
    *   @dev setStartTime change the starttime.
    *        for example to be able to start ICO after pre-sale
    *
    *   @param _newStartTime the new start time to be set
    *
    *   @return A boolean that indicates if the operation was successful.
    */
    function setStartTime(uint256 _newStartTime) 
        public 
        onlyOwner
        greaterThanZero(_newStartTime)
        returns (bool success) 
    {
        startTime = _newStartTime;
        return true;
    }

    /**
    *   @dev setEndTime change the end time .
    *        for example to be able to start ICO after pre-sale
    *
    *   @param _newEndTime the new end time to be set
    *
    *   @return A boolean that indicates if the operation was successful.
    */
    function setEndTime(uint256 _newEndTime) 
        public 
        onlyOwner
        greaterThanZero(_newEndTime)
        returns (bool success) 
    {
        //require(_newEndTime >= startTime);
        endTime = _newEndTime;
        return true;
    }

    /**
    *   @dev ETH contribution
    *   can only be called during the crowdsale
    *
    *   @return tokens issued in return
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
        require(!isFinalized);
        uint256 realEther = 1;
        return processContribution(msg.sender, msg.value, realEther);
    }


    /**
    *    @dev COINS contribution
    *    can only be called only by whitelisted address
    *
    *   @param _contributor the address of the contributor
    *   @param _amount the amount of ether in wei of the contributor
    *
    *    @return tokens issued in return
    */
    function contributeCoins(address _contributor, uint256 _amount)
        public
        addressWhitelisted(msg.sender)
        validAddress(_contributor)
        greaterThanZero(_amount)
        returns (uint256 amount)
    {
        require(!isFinalized);
        uint256 realEther = 0;
        return processContribution(_contributor, _amount, realEther);
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
        uint256 tokenPrice;

        if (preLaunch) {
            tokenPrice = TOKEN_PRICE_D.mul(35).div(100); //35% discount on Pre-sale
        } else {
            tokenPrice = TOKEN_PRICE_D;
        }

        calcAmount = (_contribution.mul(tokenPrice)).div(TOKEN_PRICE_N);
        calcAmount = removeDecimals(calcAmount);

        return calcAmount;
    }

    /**
        Sending Company shares for the Team
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

    /**
        @dev handles contribution logic
        note that the Contribution event is triggered using the sender as the contributor, regardless of the actual contributor

        @return tokens issued in return
    */
    function processContribution(address _contributor, uint256 _amount, uint256 _realEther) private returns (uint256 amount) {
        uint256 tokenAmount = computeReturn(_amount);
        if (_realEther == 1 && msg.value > 0) {
            totalEtherContributed = totalEtherContributed.add(msg.value);// update the total contribution amount, only update when real ether has been sent 
        }
        token.issue(_contributor, tokenAmount);
        tokenAmount = removeDecimals(tokenAmount);
        totalTokenIssued = totalTokenIssued.add(tokenAmount);
        sendShares();
        Contribution(_contributor, _amount, tokenAmount);
        return tokenAmount;
    }

    // remove decimals of the tokens
    function removeDecimals(uint256 _amount) internal returns (uint256 newAmount) {
        uint256 divider;

        if (decimals == 0) {
            divider  = 10 ** 18;
            newAmount = _amount.div(divider);
        } else if (decimals == 18) {
            newAmount = _amount;
        } else {
            divider = 10 ** (18 - decimals);
            newAmount = _amount.div(divider);
        }
        return newAmount;
    }
}