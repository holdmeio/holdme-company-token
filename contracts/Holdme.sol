pragma solidity ^0.4.15;


 /**
 * @title Holdme Token 
 *
 * Created by IaM <DEV> (Elky Bachtiar) 
 * https://www.iamdeveloper.io
 *
 * Derived from ERC23 token 
 * https://github.com/iam-dev/ERC23
 *
 * ERC23 token derived from ERC20 OpenZeppelin Solidity
 * https://github.com/OpenZeppelin/zeppelin-solidity
 *
 */

import '../installed_contracts/ERC23/contracts/Standard23Token.sol';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/math/SafeMath.sol';


contract Holdme is Ownable, Standard23Token {

  bytes32 public name = "Hold Me";
  bytes32 public symbol = "HME";
  uint256 public decimals = 18;

  address public owner;


  function Holdme(address _centralAdmin){
    if (_centralAdmin != 0){
      owner = _centralAdmin;
    } else {
      owner = msg.sender;
    }
    // 100% HME company shares = 300.000.000 HME Tokens
    totalSupply = 300000000 * 10**18;
    // Balance of Token address will be 100% of the HME company shares when initialize the contract 
    balances[this] = totalSupply;
  }

}
