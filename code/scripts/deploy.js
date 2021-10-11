async function main() {
   // Grab the contract factory
   // const MyNFT = await ethers.getContractFactory("MyNFT");

   // // Start deployment, returning a promise that resolves to a contract object
   // const myNFT = await MyNFT.deploy(); // Instance of the contract
   // console.log("Contract deployed to address:", myNFT.address);


   // // Grab the contract factory
   // const FantomKittens = await ethers.getContractFactory("FantomKittens");

   // // Start deployment, returning a promise that resolves to a contract object
   // const ftmNFT = await FantomKittens.deploy(); // Instance of the contract
   // console.log("Contract deployed to address:", ftmNFT.address);


   const CursedTransistors = await ethers.getContractFactory("CursedTransistor");
   const cursed = await CursedTransistors.deploy(); // Instance of the contract
   console.log("Contract deployed to address:", cursed.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });