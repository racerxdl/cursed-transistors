require('dotenv').config();

async function main() {
   const FantomKittens = await ethers.getContractFactory("FantomKittens");
   const kitten = await FantomKittens.attach(process.env.KITTEN_CONTRACT)

   const kittenOwners =[];
   const totalSupply = await kitten.totalSupply();
   console.log(`Total supply of ${totalSupply} kittens`);

   for (let i = 0; i < totalSupply; i++) {
     const tkn = await kitten.tokenByIndex(i);
     const owner = await kitten.ownerOf(tkn);
     if (!owner) {
       break;
     }
     kittenOwners.push(owner);
   }

   console.log(`There are ${kittenOwners.length} kitten owners`);
   console.log(kittenOwners);


   const CursedTransistors = await ethers.getContractFactory("CursedTransistor");
   const cursed = await CursedTransistors.attach(process.env.CURSED_CONTRACT)
   const tx = await cursed.airdrop(kittenOwners);
   await tx.wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
