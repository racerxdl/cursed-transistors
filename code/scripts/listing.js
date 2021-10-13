require('dotenv').config();

async function main() {
   const CursedTransistors = await ethers.getContractFactory("CursedTransistor");
   const cursed = await CursedTransistors.attach(process.env.CURSED_CONTRACT)
   const totalSupply = await cursed.totalSupply();
   const earlyAdopters = await cursed.earlyAdopterSupply();
   const common = await cursed.commonSupply()
   const specials = await cursed.specialSupply()
   console.log(`There are ${totalSupply} cursed transistors out there`);
   console.log(`  Early Tokens: ${earlyAdopters}`)
   console.log(`  Special Tokens: ${specials}`)
   console.log(`  Common Tokens: ${common}`)

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
