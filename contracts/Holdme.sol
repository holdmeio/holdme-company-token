pragma solidity ^0.4.15;

import '../installed_contracts/ERC23/contracts/Standard23Token.sol';
import '../installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol';
import '../installed_contracts/zeppelin-solidity/contracts/math/SafeMath.sol';


contract Holdme is Ownable, Standard23Token {

  bytes32 public name = "Home me";
  bytes32 public symbol = "HME";
  uint256 public decimals = 18;

  //1 ether = 1 HME
  uint256 public constant PRICE = 1 ether;

  address public owner;


  function XPOSE(address _centralAdmin){
    if (_centralAdmin != 0){
      owner = _centralAdmin;
    } else {
      owner = msg.sender;
    }
    totalSupply = 10000000 * 10**18;
    balances[msg.sender] = totalSupply;

  }
  
}
