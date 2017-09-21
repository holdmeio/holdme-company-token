pragma solidity ^0.4.15;

/**
 * @title TokenController 
 *
 * Created by IaM <DEV> (Elky Bachtiar) 
 * https://www.iamdeveloper.io
 *
 *
 */


import './Holdme.sol';
import '../installed_contracts/ERC23/contracts/Utils.sol';
import '../installed_contracts/ERC23/contracts/ownership/Whitelist.sol';


contract TokenController is Utils, Whitelist{
	Holdme public token;

	function TokenController (Holdme _token) validAddress(_token) {
		token = _token;
	}

    /**
    * @dev Function transferTokenOwnership, allows transferring the token ownership
    *  @param _newOwner    new token owner
    * @return A boolean that indicates if the operation was successful.
    */
    function transferTokenOwnership(address _newOwner) public onlyOwner returns (bool success) {
        token.transferOwnership(_newOwner);
        return true;
    }
}
