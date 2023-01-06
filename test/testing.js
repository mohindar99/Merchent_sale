const { expect } = require("chai");
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
// //      it("should go to the right owner", async function(){
// //         expect(await merchent_contract.admin()).to.equal(admin.address);
// //      });

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

})

