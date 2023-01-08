const { expect } = require("chai");
const { parse } = require("dotenv");
const { ethers } = require("hardhat");

describe("Platorm Merchent" ,function () {

   let merchent;
   let merchent_contract;
   let owner;
   let addr1;
   let addr2;
   let addrs;

   beforeEach(async function() {
       merchent = await ethers.getContractFactory("Merchent");
       const val = 2;
      [owner,addr1,addr2,...addrs]= await ethers.getSigners();
       merchent_contract = await merchent.deploy(val);
   });

    describe("deployment",function(){
     it("should go to the right owner", async function(){
        expect(await merchent_contract.admin()).to.equal(owner.address);
     });

        it("checking service fee ",async function(){
            const service = await merchent_contract.service_fee();
            expect(service).to.equal(2);
        });
    })
    
    describe("modification", function () {
        
        it("changing the fee structure", async function () {
            await merchent_contract.Fee_modifier(3);
            const service = await merchent_contract.service_fee();
            expect(service).to.equal(3);
        });
    })

    describe("Called by wrong owner", function () { 
        it("calling only owner functions", async function () { 
            await expect(merchent_contract.connect(addr1).item_listing(1, 2, 12, addr2.address)).to.be.revertedWith("");
        })
    })

    describe("buying the item and checking the owner", function () { 
        it("buy item", async function () { 
            await merchent_contract.item_listing(1, 2, 2, owner.address);
            let value = { value: ethers.utils.parseEther('0.000000000000000004') };
            await merchent_contract.connect(addr1).item_buy(1, 2, value);
            let owner_addr = await merchent_contract.owner1(1);
            expect( owner_addr).to.equal(addr1.address);
        })

        it("insufficient amount", async function () { 
            await merchent_contract.item_listing(2, 2, 2, owner.address);
            let value = { value: ethers.utils.parseEther("0.000000000000000003") };
            await expect(merchent_contract.connect(addr2).item_buy(2, 2,value )).to.be.revertedWith("The amount is insufficient ");
        })
    })

    describe("checking the listing ", function () { 
        it("listing with zero quantity", async function () { 
            await expect(merchent_contract.item_listing(1, 0, 2, owner.address)).to.be.revertedWith("Their must be atleast one item to list");
        })
        it("double listing", async function () {
            await merchent_contract.item_listing(1, 1, 2, owner.address);
            await expect(merchent_contract.item_listing(1, 3, 2, owner.address)).to.be.revertedWith("The item is listed already");  
        })
        it("bidding", async function () { 
            await expect(merchent_contract.bid_start(1,{value: ethers.utils.parseEther("2")})).to.be.revertedWith("Item does not exists");
        })

        it("listing price to zero", async function () { 
            await expect(merchent_contract.item_listing(1, 2, 0, owner.address)).to.be.revertedWith("Their must be a minimum price of the item");
        })
    })
    
    describe("checking bidding", function () { 
        it("bid-start with insufficient amount", async function () { 
            await merchent_contract.item_listing(1, 1, 6, owner.address);
            let value = { value: ethers.utils.parseEther('0.000000000000000002') };
            await expect(merchent_contract.connect(addr1).bid_start(1, value)).to.be.revertedWith("Amount insufficient");
        })
        it("winner declared", async function () { 
            await merchent_contract.item_listing(1, 1, 6, owner.address);
            let value = { value: ethers.utils.parseEther('0.000000000000000003') };
            await merchent_contract.connect(addr1).bid_start(1,value);
            await merchent_contract.connect(addr2).bid_start(1, value);
            //declaring the custom winner
            await merchent_contract.bid_winners(1, addr1.address);
            let winneraddr = await merchent_contract.owner1(1);
            expect(winneraddr).to.equal(addr1.address);
        }) 
    })
    describe("Checking the item", function () { 
        it("validate the item", async function () { 
            let value = { value: ethers.utils.parseEther('0.000000000000000003') };
            await expect(merchent_contract.connect(addr1).bid_start(1, value)).to.be.revertedWith("Item does not exists");          
        })
    })  
    describe("Checking the withdraw ", function () { 
        it("checking the balance reflected in contract", async function () { 
            let value = { value: ethers.utils.parseEther('0.000000000000000003') };
            await merchent_contract.item_listing(1, 1, 6, owner.address);
            await merchent_contract.connect(addr1).bid_start(1, value);
            const balance = await merchent_contract.contract_bal();
            expect(balance).to.equal(3);        
        })
        it("balance withdrawn", async function () { 
            let value = { value: ethers.utils.parseEther('0.000000000000000003') };
            await merchent_contract.item_listing(1, 1, 6, owner.address);
            await merchent_contract.connect(addr1).bid_start(1, value);
            await merchent_contract.withdraw_funds();
            const balance = await merchent_contract.contract_bal();
            expect(balance).to.equal(0);
        })

    })
       
    })

