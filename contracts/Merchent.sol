 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./IMerchent.sol";
 
 contract Merchent is IMerchent {

   // admin address
   address payable immutable public admin;
  // service fee charged for bidding
   uint public service_fee ;

 struct item{
             uint item_no;
             uint quantity;
             address payable item_owner;
             uint price;
             bool exists;
             uint received_amount;
        }

        // mapping of the unique item_no to the item details
         mapping (uint => item ) public items;

      constructor(uint service_charge){
        admin = payable(msg.sender);
        service_fee=service_charge;
        
      }

      // restricted to use for only admin
      modifier onlyowner{
        require(msg.sender==admin);
        _;
      }
      
      // Validation for the item that exists or not 
      modifier item_exists(uint _item_no,uint _quantity){
        require(items[_item_no].exists == true , "Item does not exists");
        require(items[_item_no].quantity>=_quantity,"Their is not enough quantity");
        _;
      }
      //returns the owner of the item
      function owner1(uint no) public view returns(address){
        return items[no].item_owner;
        }

      // Used to change the admin platform fee which can be only set by admin
      function Fee_modifier(uint fee) external onlyowner{
         service_fee=fee;
      }

      // Listing the item to the smart contract
      function item_listing(uint _item_no,uint _quantity,uint _price, address payable owner) external override onlyowner{
        
        require(items[_item_no].exists== false,"The item is listed already");
        require(_quantity>0,"Their must be atleast one item to list");
        require(_price>0,"Their must be a minimum price of the item");

        items[_item_no].exists=true;
        items[_item_no]= item(_item_no, _quantity,owner,_price,items[_item_no].exists,0);

        emit item_logs(_item_no,_quantity,_price,owner);  
       }

      // Buying the item from the smart contract 
      function item_buy(uint _item_no , uint _quantity ) payable external override item_exists(_item_no,_quantity){
         
        uint total_amount = items[_item_no].price * _quantity ;

        require(msg.sender!= address(0),"The address of buyer is invalid");
        require(msg.value >= total_amount,"The amount is insufficient ");

        items[_item_no].item_owner.transfer(msg.value);
        items[_item_no].item_owner = payable(msg.sender);
        items[_item_no].quantity -= _quantity;

        emit item_logs(_item_no, _quantity,total_amount , msg.sender);   

         if(items[_item_no].quantity==0){
            items[_item_no].exists=false;
        }
       } 
      
      // Claiming the item after the gamble had been done 
      function bid_winners(uint _item_no , address payable winner) external override{

        require(items[_item_no].received_amount>=items[_item_no].price,"Enough contribution was not made");

         items[_item_no].item_owner.transfer(items[_item_no].price);
         
         emit item_logs(_item_no,1,items[_item_no].price,winner);
           items[_item_no].item_owner=payable(winner);
           if(items[_item_no].quantity==0){
            items[_item_no].exists=false;
        }
       }
      
      // Contributing the money to the contract for starting the game 
      function bid_start(uint _item_no ) payable external override item_exists(_item_no,1){
        uint avg_service_fee = service_fee/2;
        uint req = (items[_item_no].price*(50+avg_service_fee))/100;
        
        require(msg.sender!=address(0),"user doesn't exists");
        require(msg.value>=req,"Amount insufficient");
        items[_item_no].received_amount += msg.value;
       
       //Used if item is only 1 item and 2 pairs are trying to start the game at the same time .  
        if(items[_item_no].received_amount>=items[_item_no].price){
            items[_item_no].quantity -= 1;
        }
       } 
      
      // Used to withdraw the required money
      function withdraw_funds() external override onlyowner{
          admin.transfer(address(this).balance);
       }
       function contract_bal() external view onlyowner returns(uint){
           return address(this).balance;
       }
}
