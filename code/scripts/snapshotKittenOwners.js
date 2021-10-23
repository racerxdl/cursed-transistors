require('dotenv').config();
const fs = require('fs');

async function getKittenOwner(kitten, id) {
  try {
     const tkn = await kitten.tokenByIndex(id);
     const owner = await kitten.ownerOf(tkn);
     // console.log(id, owner)
     return {
       id,
       owner,
       isContract: await ethers.getDefaultProvider('https://rpc.ftm.tools').getCode(owner) !== '0x',
     };

  } catch (e) {
    console.log('error: ', e);
  }
  return null;
}

async function main() {
   const FantomKittens = await ethers.getContractFactory("FantomKittens");
   const kitten = await FantomKittens.attach(`0xfd211f3b016a75bc8d73550ac5adc2f1cae780c0`)
   const totalSupply = await kitten.totalSupply();
   console.log(`Total supply of ${totalSupply} kittens`);

   const kittenOwners = await Promise.all([...Array(totalSupply.toNumber()).keys()].map((id) => getKittenOwner(kitten, id)));
   const contractOwners = kittenOwners.filter((o) => o.isContract);
   console.log(`There are ${kittenOwners.length} kitten owners`);
   console.log(`There are ${contractOwners.length} kitten owned by contracts`);
   const printedContracts = [];
   const count = {};
   const contractOwned = {};
   for (let i = 0; i < contractOwners.length; i++) {
     const owner = contractOwners[i];
     if (printedContracts.indexOf(owner.owner) === -1) {
       console.log(`Contract: ${owner.owner}`);
       printedContracts.push(owner.owner);
     }
     count[owner.owner] = (count[owner.owner]||0)+1;
     contractOwned[owner.owner] = contractOwned[owner.owner] || [];
     contractOwned[owner.owner].push(owner.id);
   }
   console.log(count);
   fs.writeFileSync(`airdrop-${Date.now()}.json`, JSON.stringify(kittenOwners, null, 2));
   fs.writeFileSync(`airdrop-${Date.now()}-contract.json`, JSON.stringify(contractOwned, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
