/**
 * This smart contract code is Copyright 2017 TokenMarket Ltd. For more information see https://tokenmarket.net
 *
 * Licensed under the Apache License, version 2.0: https://github.com/TokenMarketNet/ico/blob/master/LICENSE.txt
 */

pragma solidity ^0.4.6;

import '../installed_contracts/ERC23/contracts/Utils.sol/';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol';
import '../installed_contracts/ERC23/installed_contracts/zeppelin-solidity/contracts/math/SafeMath.sol';
import './SafeMathLib.sol';

/// @dev Time milestone based pricing with special support for pre-ico deals.
contract PricingScheme is Ownable {

  using SafeMathLib for uint;

  uint public constant MAX_MILESTONE = 10;

  /**
  * Define pricing schedule using milestones.
  */
  struct Milestone {

      // UNIX timestamp when this milestone kicks in
      uint time;

      // How many tokens per satoshi you will get after this milestone has been passed
      uint price;
  }

  // Store milestones in a fixed array, so that it can be seen in a blockchain explorer
  // Milestone 0 is always (0, 0)
  // (TODO: change this when we confirm dynamic arrays are explorable)
  Milestone[10] public milestones;

  // How many active milestones we have
  uint public milestoneCount;

  /// @dev Contruction, creating a list of milestones
  /// @param _milestones uint[] milestones Pairs of (time, price)
  function PricingScheme(uint[] _milestones) {
    // Need to have tuples, length check
    assert(!(_milestones.length % 2 == 1 || _milestones.length >= MAX_MILESTONE*2));

    milestoneCount = _milestones.length / 2;

    uint lastTimestamp = 0;

    for(uint i=0; i<_milestones.length/2; i++) {
      milestones[i].time = _milestones[i*2];
      milestones[i].price = _milestones[i*2+1];

      // No invalid steps
      assert(!((lastTimestamp != 0) && (milestones[i].time <= lastTimestamp)));

      lastTimestamp = milestones[i].time;
    }

    // Last milestone price must be zero, terminating the crowdale
    assert(!(milestones[milestoneCount-1].price != 0));
  }

  /// @dev Iterate through milestones. You reach end of milestones when price = 0
  /// @return tuple (time, price)
  function getMilestone(uint n) public constant returns (uint, uint) {
    return (milestones[n].time, milestones[n].price);
  }

  function getFirstMilestone() private constant returns (Milestone) {
    return milestones[0];
  }

  function getLastMilestone() private constant returns (Milestone) {
    return milestones[milestoneCount-1];
  }

  function getPricingStartsAt() public constant returns (uint) {
    return getFirstMilestone().time;
  }

  function getPricingEndsAt() public constant returns (uint) {
    return getLastMilestone().time;
  }

  /// @dev Get the current milestone or bail out if we are not in the milestone periods.
  /// @return {[type]} [description]
  function getCurrentMilestone() private constant returns (Milestone) {
    uint i;

    for(i=0; i<milestones.length; i++) {
      if(now < milestones[i].time) {
        return milestones[i-1];
      }
    }
  }

  /// @dev Get the current price.
  /// @return The current price or 0 if we are outside milestone period
  function getCurrentPrice() public constant returns (uint result) {
    return getCurrentMilestone().price;
  }

  /// @dev Calculate the current price for buy in amount.
  function calculatePrice(uint value, uint decimals) public constant returns (uint) {

    uint multiplier = 10 ** decimals;

    uint price = getCurrentPrice();
    return value.times(multiplier) / price;
  }

  function() payable {
    revert(); // No money on this contract
  }

}
