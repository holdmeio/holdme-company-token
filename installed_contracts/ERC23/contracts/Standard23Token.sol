
pragma solidity ^0.4.13;

import './ERC23.sol';
import './Basic23Token.sol';
import './validation/Valid.sol';
import './ERC23Receiver.sol';
import '../installed_contracts/zeppelin-solidity/contracts/token/StandardToken.sol';

/**
 * @title Standard ERC23 token
 * @dev Implementation of the basic standard token ERC23.
*
 * created by IAM <DEV> (Elky Bachtiar) 
 * https://iamdeveloper.io
 * Changes made base on ERC20 Token Stadard and Solidity version 0.4.13
 * https://theethereum.wiki/w/index.php/ERC20_Token_Standard
 */
contract Standard23Token is Valid, ERC23, Basic23Token, StandardToken {

  /**
   * @dev Transfer tokens from one address to another
   * @dev Full compliance to ERC-20 and predictable behavior
   * https://docs.google.com/presentation/d/1sOuulAU1QirYtwHJxEbCsM_5LvuQs0YTbtLau8rRxpk/edit#slide=id.p24
   * 
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amout of tokens to be transfered
   * @param _data is arbitrary data sent with the token transferFrom. Simulates ether tx.data
   * @return bool successful or not
   */
  function transferFrom(address _from, address _to, uint256 _value, bytes _data) 
    validAddresses(_from, _to) 
    validInputUint256(_value)
    validInputBytes(_data)
    returns (bool success)
  {
    // Ensure _from has enough balance to send amount 
    // and ensure the send _value is greater than 0
    // and ensure allowed[_from][msg.sender] is greate or equal to send amount to send
    // and Detect balance overflow
    require(
            balances[_from] >= _value 
            && _value > 0
            && allowed[_from][msg.sender] >= _value
            && balances[_to].add(_value) > balances[_to]
    );

    if (_value > 0 && _from != _to) {
      require(super.transferFrom(_from, _to, _value)); // do a normal token transfer
      if (isContract(_to)) {
        return contractFallback(_from, _to, _value, _data);
      }
    }
    return true;
  }


  /**
   * @dev Transfer tokens from one address to another
   * @dev Full compliance to ERC-20 and predictable behavior
   * https://docs.google.com/presentation/d/1sOuulAU1QirYtwHJxEbCsM_5LvuQs0YTbtLau8rRxpk/edit#slide=id.p24
   * 
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amout of tokens to be transfered
   * @return bool successful or not
   */
  function transferFrom(address _from, address _to, uint256 _value) 
    validAddresses(_from, _to) 
    validInputUint256(_value)
    returns (bool success)
  {

     // Ensure _from has enough balance to send amount 
    // and ensure the send _value is greater than 0
    // and ensure allowed[_from][msg.sender] is greate or equal to send amount to send
    // and Detect balance overflow
    require(
            balances[_from] >= _value 
            && _value > 0
            && allowed[_from][msg.sender] >= _value
            && balances[_to].add(_value) > balances[_to]
    );

    if (_value > 0 && _from != _to) {
      require(super.transferFrom(_from, _to, _value)); // do a normal token transfer
      if (isContract(_to)) {
        bytes memory empty;
        return contractFallback(_from, _to, _value, empty);
      }
    }
    return true;
  }


  /**
   * @dev Aprove the passed address to spend the specified amount of tokens on behalf of msg.sender.
   * @param _spender The address which will spend the funds.
   * @param _value The amount of tokens to be spent.
   * @return bool successful or not
   */
  function approve(address _spender, uint _value) 
    validAddress(_spender)
    validInputUint256(_value)
    returns (bool success)
  {

    // To change the approve amount you first have to reduce the addresses`
    //  allowance to zero by calling `approve(_spender, 0)` if it is not
    //  already 0 to mitigate the race condition described here:
    //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    // if the allowance isn't 0, it can only be updated to 0 to prevent an allowance change immediately after withdrawal
    require(_value == 0 || allowed[msg.sender][_spender] == 0);

    // ensure the _value is greater than 0
    require(_value > 0);

    allowed[msg.sender][_spender] = _value;
    super.approve(_spender, _value); // do a normal token transfer
    return true;
  }

  function allowance(address _owner, address _spender) 
    validAddresses(_owner, _spender)
    constant returns (uint256 remaining)
  {
    return super.allowance(_owner, _spender);
  }

  // A vulernability of the approve method in the ERC20 standard was identified by
  // Mikhail Vladimirov and Dmitry Khovratovich here:
  // https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM
  // It's better to use this method which is not susceptible to over-withdrawing by the approvee.
  /// @param _spender The address to approve
  /// @param _currentValue The previous value approved, which can be retrieved with allowance(msg.sender, _spender)
  /// @param _newValue The new value to approve, this will replace the _currentValue
  /// @return bool Whether the approval was a success (see ERC20's `approve`)
  function compareAndApprove(address _spender, uint256 _currentValue, uint256 _newValue) 
    validAddress(_spender)
    validInputUint256(_newValue)
    public returns(bool)
  {
    require(allowed[msg.sender][_spender] == _currentValue);
    return approve(_spender, _newValue);
  }
}