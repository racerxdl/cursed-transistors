require('dotenv').config();

async function main() {
  const walletAddress = process.env.ROYALITY_RECEIVER;
  const CursedTransistors = await ethers.getContractFactory("CursedTransistor");
  const cursed = await CursedTransistors.attach(process.env.CURSED_CONTRACT)
  const currentRoyality = await cursed.royaltiesReceiver()
  console.log(`Changing royality receiver from ${currentRoyality} to ${walletAddress}`);
  const tx = await cursed.setRoyaltiesReceiver(walletAddress);
  await tx.wait();
  const updatedRoyalit = await cursed.royaltiesReceiver()
  console.log(`Royality receiver is now ${updatedRoyalit}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
