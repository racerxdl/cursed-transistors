require('dotenv').config();

async function main() {
  const CursedTransistors = await ethers.getContractFactory("CursedTransistor");
  const cursed = await CursedTransistors.attach(process.env.CURSED_CONTRACT)

  cursed.on('SpecialEmitted', (recipient, tokenId) => console.log(`User ${recipient} received ${tokenId}`))
  const newToken = await cursed.sendSpecial(process.env.TEST_WALLET);
  const res = await newToken.wait();
  console.log(newToken.hash, res)
  console.log(`Sent new token (${newToken}) to ${process.env.TEST_WALLET}`)
}

main()
