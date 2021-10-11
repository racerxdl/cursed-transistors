require('dotenv').config();

async function main() {
   const CursedTransistors = await ethers.getContractFactory("CursedTransistor");
   const cursed = await CursedTransistors.attach(process.env.CURSED_CONTRACT)
   const totalSupply = await cursed.totalSupply();
   console.log(`There are ${totalSupply} cursed transistors out there`);

   for (let i = 0; i < totalSupply; i++) {
     const tkn = await cursed.tokenByIndex(i);
     const uri = await cursed.tokenURI(tkn);
     console.log(tkn, uri);
   }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
