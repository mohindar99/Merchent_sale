//SPDX-License-Identifier:MIT
pragma solidity ^0.8.6;

interface IMerchent {
    /*
      Emitted when owner of the NFT had been changed
    */
      event item_logs(uint item_no,uint quantity,uint price,address item_owner);

     /*
       * Require Item should be exists
       * Require Quantity of the Item to be greater then Zero
       * Require Price of the item must be greater then zero
       * Item is listed to the smart contract
       * Emits {item_logs} event

     */
      function item_listing(uint _item_no,uint _quantity,uint _price, address payable owner) external ;
       /*
       * Buyer address can not be zero address
       * TotalAmount of the items must be greater or equal to the price of the item
       * Emits {item_logs} event  
       */
      function item_buy(uint _item_no , uint _quantity ) payable external ;
      /*
      * Amount received must be greater than price of the item to claim
      * Emits {item_logs} event
      */
      function bid_winners(uint _item_no , address payable winner) external ;
     /*
     * Address sender cannot be the zero address
     * Value sent must be greater than the price of the item
     * Used for the participants to start the game by contributing the half of the price of item
     */
      function bid_start(uint _item_no ) payable external ;
    /*
    * Only admin should withdraw the funds
    * Admin can withdraw the funds from the contract which is 2% in each bidding transaction
    */
      function withdraw_funds() external ;

}
