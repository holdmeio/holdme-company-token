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
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/math/SafeMath.sol';
import './TokenVault.sol';
import './PricingScheme.sol';

contract HoldmeTokenSale is Ownable, Utils {
    using SafeMath for uint256;

    uint256 public constant TOKEN_PRICE_N = 1;            // initial price in wei (numerator)
    uint256 public constant TOKEN_PRICE_D = 100;          // initial price in wei (denominator)
    uint256 public constant MAX_GAS_PRICE = 50000000000 wei;    // maximum gas price for contribution transactions

    Holdme public token;        // The token
    TokenVault public tokenVault;                   // Token Vault where addresses are stored before tokens are released
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
    address public btcs = 0x0;                      // bitcoin suisse address
    bool    public preLaunch = false;               // Set pre-launch to true or false

    address public devone = 0x0;                    // address Developer 1 to receive 3% Company Share
    address public devtwo = 0x0;                    // address Developer 2 to receive 3% Company Share
    address public devtree = 0x0;                   // address Developer 3 to receive 3% Company Share
    address public advisor = 0x0;                   // address Advisor to receive 8% Company Share

    uint256 public shareDev = 0;
    uint256 public shareAdvisor = 0;
    uint256 public shareBeneficiary = 0;

    bool public isFinalized = false;

    address public owner;


    // triggered on each contribution
    event Contribution(address indexed _contributor, uint256 _amount, uint256 _return);
    event Finalized();

    function HoldmeTokenSale (
        address _centralAdmin,
        uint256 _startTime, 
        uint256 _endTime, 
        address _beneficiary, 
        address _devone, 
        address _devtwo, 
        address _devthree, 
        address _advisor,
        uint256 _shareDev,
        uint256 _shareAdvisor
    ) { 

        if (_centralAdmin != 0) {
          owner = _centralAdmin;
        } else {
          owner = msg.sender;
        }
        startTime = _startTime;
        endTime = _endTime;
        beneficiary = _beneficiary;
        devone = _devone;
        devtwo = _devtwo;
        devtree = _devthree;
        advisor = _advisor;
        shareDev = _shareDev;
        shareAdvisor = _shareAdvisor;
    }

    function setToken(address _token) validAddress(_token) onlyOwner returns (bool success) {
        token = Holdme(_token);
        return true;
    }

    function setStartTime(uint256 _newStartTime) onlyOwner returns (bool success) {
        startTime = _newStartTime;
        return true;
    }

    function setEndTime(uint256 _newEndTime) onlyOwner returns (bool success) {
        endTime = _newEndTime;
        return true;
    }

    function setTokenVault(address _tokenVault) validAddress(_tokenVault) onlyOwner {
        tokenVault = TokenVault(_tokenVault);
    }

    function setPricingScheme(address _pricingScheme) validAddress(_pricingScheme) onlyOwner {
        pricingScheme = PricingScheme(_pricingScheme);
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

    // ensures that the current time is between _startTime (inclusive) and _endTime (exclusive)
    modifier between() {
        assert((now >= startTimePreLaunch && now < endTimePreLaunch) || 
               (now >= startTime && now < endTime));
        _;
    }

    /**
        @dev computes the number of tokens that should be issued for a given contribution

        @param _contribution    contribution amount

        @return computed number of tokens
    */
    function computeReturn(uint256 _contribution) public constant returns (uint256) {
        return (_contribution.mul(TOKEN_PRICE_D)).div(TOKEN_PRICE_N);
    }

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
    function sendShares() internal onlyOwner{
        token.transfer(devone, shareDev);               
        token.transfer(devtwo, shareDev);               
        token.transfer(devtree, shareDev);             
        token.transfer(advisor, shareAdvisor);        
    }

    /**
        @dev ETH contribution
        can only be called during the crowdsale

        @return tokens issued in return
    */
    function contributeETH(address _contributer)
        public
        payable
        //between
        tokenMaxCapNotReached
        returns (uint256 amount)
    {
        require(_contributer != 0x0);
        require(msg.value!=0);
        //uint256 discount = 0;
        uint256 tokenAmount = computeReturn(msg.value);
        processContribution(_contributer, tokenAmount);
        return tokenAmount;
    }

    /**
        @dev Contribution through BTC
        can only be called by owner

        @return tokens issued in return
    */
    function contributeBTC(address _contributer, uint256 _btcToEthPrice)
        public
        payable
        onlyOwner
        tokenMaxCapNotReached
        returns (uint256 amount)
    {
        require(_contributer != 0x0);
        require(msg.value!=0);
        //uint256 discount = 0;
        uint256 tokenAmount = computeReturn(msg.value.mul(_btcToEthPrice));
        processContribution(_contributer, tokenAmount);
        return tokenAmount;
    }

    /**
        @dev handles contribution logic
        note that the Contribution event is triggered using the sender as the contributor, regardless of the actual contributor

        @return tokens issued in return
    */
    function processContribution(address _contributer, uint256 _tokenAmount) private
        onlyOwner
        tokenMaxCapNotReached()
        validGasPrice
    {
        assert(beneficiary.send(msg.value)); // transfer the ether to the beneficiary account
        totalEtherContributed = totalEtherContributed.add(msg.value);// update the total contribution amount

        tokenVault.setInvestor(_contributer, _tokenAmount);
        //token.transfer(_contributer, _tokenAmount); // issue new funds to the contributor in the smart token
        totalTokenIssued = totalTokenIssued.add(_tokenAmount);

        Contribution(msg.sender, msg.value, _tokenAmount);
    }

    // fallback when investor transfering Ether to the crowdsale contract without calling any functions
    function() payable {
        contributeETH(msg.sender);
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
}