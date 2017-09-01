pragma solidity ^0.4.15;

import "../StandardReceiver.sol";

/**
 * @title ExampleReceiver 
 *
 * created by IAM <DEV> (Elky Bachtiar) 
 * https://www.iamdeveloper.io
 */

contract ExampleReceiver is StandardReceiver {
    function foo(/*uint i*/) tokenPayable {
        LogTokenPayable(1, tkn.addr, tkn.sender, tkn.value);
    }

    function () tokenPayable {
        LogTokenPayable(0, tkn.addr, tkn.sender, tkn.value);
    }

    function supportsToken(address token) returns (bool) {
        return true;
    }

    event LogTokenPayable(uint i, address token, address sender, uint value);
}