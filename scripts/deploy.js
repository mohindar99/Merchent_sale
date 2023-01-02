const hre = require("hardhat");

async function main() {

  const Merchent = await hre.ethers.getContractFactory("Merchent");
  const val = 2;
  const merchent = await Merchent.deploy(val);

  await merchent.deployed();

  console.log(`The merchent contract had been deployed in the address of ${merchent.address}`);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
