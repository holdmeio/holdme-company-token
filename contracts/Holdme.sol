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

import '../installed_contracts/ERC23/contracts/UpgradeableStandard23Token.sol';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/math/SafeMath.sol';


contract Holdme is Ownable, UpgradeableStandard23Token {

    address public owner;
    bool public mintingFinished = false;


    function Holdme(address _centralAdmin, uint256 _initialBalance, bytes32 _name, bytes32 _symbol, uint256 _decimals) {
        if (_centralAdmin != 0) {
            owner = _centralAdmin;
        } else {
        owner = msg.sender;
        }
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        balances[owner] = _initialBalance; // balance of Token address will be 100% of the HME company shares when initialize the contract 
        totalSupply = _initialBalance;
    }

    event Mint(address indexed to, uint256 amount);
    event MintFinished();

    modifier canMint() {
        require(!mintingFinished);
        _;
    }

    /**
    * @dev Function to mint tokens
    * @param _to The address that will receive the minted tokens.
    * @param _amount The amount of tokens to mint.
    * @return A boolean that indicates if the operation was successful.
    */
    function mint(address _to, uint256 _amount) onlyOwner canMint returns (bool) {
        totalSupply = totalSupply.add(_amount);
        balances[_to] = balances[_to].add(_amount);
        Mint(_to, _amount);
        Transfer(0x0, _to, _amount);
        return true;
    }

    /**
    * @dev Function to stop minting new tokens.
    * @return True if the operation was successful.
    */
    function finishMinting() onlyOwner returns (bool) {
        mintingFinished = true;
        MintFinished();
        return true;
    }

}
