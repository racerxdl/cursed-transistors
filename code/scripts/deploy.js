require('dotenv').config();

async function main() {
   // // Grab the contract factory
   // const FantomKittens = await ethers.getContractFactory("FantomKittens");

   // // Start deployment, returning a promise that resolves to a contract object
   // const ftmNFT = await FantomKittens.deploy(); // Instance of the contract
   // console.log("Contract deployed to address:", ftmNFT.address);

   console.log(`Deploying with URL: ${process.env.BASE_URL}`)
   const CursedTransistors = await ethers.getContractFactory("CursedTransistor");
   const cursed = await CursedTransistors.deploy(process.env.BASE_URL); // Instance of the contract
   console.log("Contract deployed to address:", cursed.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });