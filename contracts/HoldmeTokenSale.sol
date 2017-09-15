pragma solidity ^0.4.15;


 /**
 * @title Holdme Token Sale
 *
 * Created by IaM <DEV> (Elky Bachtiar) 
 * https://www.iamdeveloper.io
 *
 *
 */

import './Holdme.sol/';
import '../installed_contracts/ERC23/contracts/Utils.sol/';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/lifecycle/Pausable.sol';
//import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/Token/TokenTimelock.sol';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/math/SafeMath.sol';
//import './TokenVault.sol';
import './PricingScheme.sol';

contract HoldmeTokenSale is Ownable, Utils, Pausable {
    using SafeMath for uint256;

    uint256 public constant TOKEN_PRICE_N = 1;                  // initial price in wei (numerator)
    uint256 public constant TOKEN_PRICE_D = 100;                // initial price in wei (denominator)
    uint256 public constant MAX_GAS_PRICE = 50000000000 wei;    // maximum gas price for contribution transactions

    Holdme public token;        // The token
    //TokenVault public tokenVault;                 // Token Vault where addresses are stored before tokens are released
    PricingScheme public pricingScheme;

    string public version = "0.1";

    uint256 public startTimePreLaunch = 0;          // Pre-Launch crowdsale start time (in seconds)
    uint256 public endTimePreLaunch = 0;            // Pre-Launch crowdsale end time (in seconds)
    uint256 public startTime = 0;                   // crowdsale start time (in seconds)
    uint256 public endTime = 0;                     // crowdsale end time (in seconds)
    uint256 public totalTokenCap = 1000000;         // current token cap
    uint256 public totalTokenIssued = 0;            // token issued so far
    uint256 public totalEtherContributed = 0;       // ether contributed so far
    uint256 public totalBtcContributed = 0;         // bitcoin contributed so far
    bytes32 public realEtherCapHash;                // ensures that the real cap is predefined on deployment and cannot be changed later
    address public beneficiary = 0x0;               // address to receive all ether contributions
    address public devteam = 0x0;
    address public btcs = 0x0;                      // bitcoin suisse address
    bool    public preLaunch = false;               // Set pre-launch to true or false

    address public devone = 0x0;                    // address Developer 1 to receive Company Share
    address public devtwo = 0x0;                    // address Developer 2 to receive Company Share
    address public devtree = 0x0;                   // address Developer 3 to receive Company Share
    address public advisor = 0x0;                   // address Advisor to receive Company Share

    uint256 public shareDev = 0;
    uint256 public shareAdvisor = 0;
    uint256 public shareBeneficiary = 0;

    bool public isFinalized = false;

    address public owner;


    /** State machine
    *
    * - Preparing: All contract initialization calls and variables have not been set yet
    * - Presale: We have not passed start time yet
    * - Sale: Active crowdsale
    * - Success: Minimum funding goal reached
    * - Failure: Minimum funding goal not reached before ending time
    * - Finalized: The finalized has been called and succesfully executed
    */
    enum State{Unknown, Preparing, Presale, Sale, Success, Failure, Finalized}

    // triggered on each contribution
    event Contribution(address indexed _contributor, uint256 _amount, uint256 _return);
    event Finalized();

    function HoldmeTokenSale (
<<<<<<< HEAD
        uint256 _startTimePreLaunch,
        uint256 _startTime, 
=======
        address _centralAdmin,
        uint256 _startTime, 
        uint256 _endTime, 
>>>>>>> ec95b88a2949fa988dca6c571732a5719779304e
        address _beneficiary, 
        address _devone, 
        address _devtwo, 
        address _devthree, 
        address _advisor
        //uint256 _shareDev,
        //uint256 _shareAdvisor
    ) { 
<<<<<<< HEAD
        startTimePreLaunch = _startTimePreLaunch;
        endTimePreLaunch = endTimePreLaunch + DURATION_PRELAUNCH;
        startTime = _startTime;
        endTime = startTime + DURATION;
=======
        require(_startTime >= now &&
                _endTime >= _startTime);

        if (_centralAdmin != 0) {
          owner = _centralAdmin;
        } else {
          owner = msg.sender;
        }
        startTime = _startTime;
        endTime = _endTime;
>>>>>>> ec95b88a2949fa988dca6c571732a5719779304e
        beneficiary = _beneficiary;
        devone = _devone;
        devtwo = _devtwo;
        devtree = _devthree;
        advisor = _advisor;
<<<<<<< HEAD
        //shareDev = _shareDev;
        //shareAdvisor = _shareAdvisor;
        //shareBeneficiary = _shareBeneficiary;
        //sendShares();
    }

    function setToken(address _token) validAddress(_token) onlyOwner {
        token = UpgradeableStandard23Token(_token);
=======
        shareDev = _shareDev;
        shareAdvisor = _shareAdvisor;
>>>>>>> ec95b88a2949fa988dca6c571732a5719779304e
    }

    // fallback when investor transfering Ether to the crowdsale contract without calling any functions
    function() payable {
        contributeETH(msg.sender, msg.value);
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


    function setToken(address _token) 
        public 
        validAddress(_token)
        onlyOwner
        returns (bool success)
    {
        token = Holdme(_token);
        return true;
    }

    function setStartTime(uint256 _newStartTime) 
        public 
        greaterThanZero(_newStartTime)
        onlyOwner 
        returns (bool success) 
    {
        require(_newStartTime >= now);

        startTime = _newStartTime;
        return true;
    }

    function setEndTime(uint256 _newEndTime) 
        public 
        greaterThanZero(_newEndTime)
        onlyOwner
        returns (bool success) 
    {
        require(_newEndTime >= startTime);
        endTime = _newEndTime;
        return true;
    }
    /*
    function setTokenVault(address _tokenVault) 
        public
        validAddress(_tokenVault)
        onlyOwner
    {
        tokenVault = TokenVault(_tokenVault);
    }
    */

    function setPricingScheme(address _pricingScheme) 
        public
        validAddress(_pricingScheme) 
        onlyOwner
    {
        pricingScheme = PricingScheme(_pricingScheme);
    }


    /**
        @dev computes the number of tokens that should be issued for a given contribution

        @param _contribution    contribution amount

        @return computed number of tokens
    */
    function computeReturn(uint256 _contribution) public constant returns (uint256) {
        return (_contribution.mul(TOKEN_PRICE_D)).div(TOKEN_PRICE_N);
    }

<<<<<<< HEAD
    function percent(uint256 numerator, uint256 denominator, uint256 precision) private constant returns(uint quotient) {
        // caution, check safe-to-multiply here
        uint256 _numerator  = numerator * 10 ** (precision.add(1));
        // with rounding of last digit
        uint256 _quotient =  ((_numerator / denominator) + 5).div(10);
        return ( _quotient);
    }

    /**
        Sending Company shares for the Team
        Only executed in constructor
    */
    function sendShares() internal onlyOwner {
        token.transfer(devone, shareDev);
        token.transfer(devtwo, shareDev);
        token.transfer(devtree, shareDev);
        token.transfer(advisor, shareAdvisor);
    }
=======
  
>>>>>>> ec95b88a2949fa988dca6c571732a5719779304e

    /**
        @dev ETH contribution
        can only be called during the crowdsale

        @return tokens issued in return
    */
    function contributeETH(address _contributer, uint256 _amount)
        public
        payable
        between
        tokenMaxCapNotReached
        validAddress(_contributer)
        greaterThanZero(_amount)
        returns (uint256 amount)
    {
<<<<<<< HEAD
        require(_contributer != 0x0);
        require(msg.value!=0);
        //uint256 discount = 0;
        uint256 tokenAmount = pricingScheme.calculatePrice(msg.value,1);
        processContribution(_contributer, tokenAmount);
=======
        require(_contributer != 0x0 &&
                _amount > 0);

        uint256 tokenAmount = computeReturn(_amount);
        processContribution(_contributer, _amount, tokenAmount);
>>>>>>> ec95b88a2949fa988dca6c571732a5719779304e
        return tokenAmount;
    }

    /**
        @dev Contribution through BTC
        can only be called by owner

        @return tokens issued in return
    */
    function contributeBTC(address _contributer, uint256 _amount, uint256 _btcToEthPrice)
        public
        payable
        onlyOwner
        tokenMaxCapNotReached
        validAddress(_contributer)
        greaterThanZero(_amount)
        returns (uint256 amount)
    {
<<<<<<< HEAD
        require(_contributer != 0x0);
        require(msg.value!=0);
        //uint256 discount = 0;
        uint256 tokenAmount = pricingScheme.calculatePrice(msg.value.mul(_btcToEthPrice),1);
        processContribution(_contributer, tokenAmount);
=======
        require(_contributer != 0x0 &&
                _amount > 0);

        uint256 tokenAmount = computeReturn(_amount.mul(_btcToEthPrice));
        processContribution(_contributer, _amount, tokenAmount);
>>>>>>> ec95b88a2949fa988dca6c571732a5719779304e
        return tokenAmount;
    }

    /**
        @dev handles contribution logic
        note that the Contribution event is triggered using the sender as the contributor, regardless of the actual contributor

        @return tokens issued in return
    */
    function processContribution(address _contributer, uint256 _ethAmount, uint256 _tokenAmount) 
        private
        onlyOwner
        tokenMaxCapNotReached()
        validGasPrice
    {
        assert(beneficiary.send(_ethAmount)); // transfer the ether to the beneficiary account
        totalEtherContributed = totalEtherContributed.add(_ethAmount);// update the total contribution amount

        //tokenVault.setInvestor(_contributer, _tokenAmount);
        totalTokenIssued = totalTokenIssued.add(_tokenAmount);

        Contribution(_contributer, _ethAmount, _tokenAmount);
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

        finalization();
        Finalized();
    
        isFinalized = true;
    }

    /**
    * @dev Can be overriden to add finalization logic. The overriding function
    * should call super.finalization() to ensure the chain of finalization is
    * executed entirely.
    */
    function finalization() internal {
        sendShares();
    }

<<<<<<< HEAD

    /**
    * Crowdfund state machine management.
    *
    * We make it a function and do not assign the result to a variable, so there is no chance of the variable being stale.
    */
    function getState() public constant returns (State) {
    if (isFinalized)
        return State.Finalized;
    else if (now < startTimePreLaunch)
        return State.Preparing;
    else if (startTimePreLaunch == 0 || endTimePreLaunch == 0 || startTime == 0 || endTime == 0 || beneficiary == 0)
        return State.Preparing;
    else if (now >= startTime && now < endTime)
        return State.Sale;
    else
        return State.Failure;
    }
}
=======
    /**
        Sending Company shares for the Team
        Only executed in constructor
    */
    function sendShares() internal onlyOwner{
        token.transfer(devone, shareDev);               
        token.transfer(devtwo, shareDev);               
        token.transfer(devtree, shareDev);             
        token.transfer(advisor, shareAdvisor);        
    }
}
>>>>>>> ec95b88a2949fa988dca6c571732a5719779304e
