// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// Define a function that will return the ethers balance of a given address
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Define a function to log the ether balance for a list of addresses
async function printBalances(addresses){
  // Define a variable for storing index
  let idx = 0;
  // Define a loop for logging balances
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    // Increment
    idx++;
  }
}

// Define a function for logging the memos on chain from coffee purchases
async function printMemos(memos){
  // Define a loop for logging memos
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} ${tipperAddress} said: "${message}"`);
  }
}

async function main() {
  // Get example accounts
  const[owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
  // Get the contract to deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();

  // Log
  console.log("BuyMeACoffee deployed to", buyMeACoffee.address);
  // Deploy
  // Check Bals
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("== Start ==");
  await printBalances(addresses);


  // Buy owner a few coffees
  // Set a tip value for purchasing coffees
  const tip = {value: hre.ethers.utils.parseEther("1")};
  // Simulate purchasing coffees
  await buyMeACoffee.connect(tipper).buyCoffee("Ron", "I'd buy a coffee, but it knows too much", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Tommy H", "Nice. Heres a cup of Tommy", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Anne Perkins", "Enjoy :)", tip);

  console.log("== Bought Coffee ==");
  await printBalances(addresses);

  // Withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();
  console.log("== Withdraw Tips ==");
  await printBalances(addresses);

  // Read all the memos left for the owner
  console.log("== Memos ==");
  // Invoking memo function
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
