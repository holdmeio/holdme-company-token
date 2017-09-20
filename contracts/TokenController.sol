pragma solidity ^0.4.15;


import './Holdme.sol';
import '../installed_contracts/ERC23/contracts/Utils.sol';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol';


contract TokenController is Utils, Ownable{
	Holdme public token;

	function TokenController (Holdme _token) validAddress(_token) {
		token = _token;
	}

	/**
        @dev allows transferring the token ownership
        the new owner still need to accept the transfer
        can only be called by the contract owner

        @param _newOwner    new token owner
    */
    function transferTokenOwnership(address _newOwner) public onlyOwner {
        token.transferOwnership(_newOwner);
    }

    /**
        @dev used by a new owner to accept a token ownership transfer
        can only be called by the contract owner
    */
   // function acceptTokenOwnership() public onlyOwner {
        //token.acceptOwnership();
    //}

    /**
        @dev disables/enables token transfers
        can only be called by the contract owner

        @param _disable    true to disable transfers, false to enable them
    */
    //function disableTokenTransfers(bool _disable) public onlyOwner {
        //token.disableTransfers(_disable);
    //}


}
