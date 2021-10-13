require('dotenv').config();

async function main() {
  const walletAddress = process.env.ROYALITY_RECEIVER;
  const CursedTransistors = await ethers.getContractFactory("CursedTransistor");
  const cursed = await CursedTransistors.attach(process.env.CURSED_CONTRACT);
  console.log(`Changing deposity address to ${walletAddress}`);
  const tx = await cursed.setDepositAddress(walletAddress);
  await tx.wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
