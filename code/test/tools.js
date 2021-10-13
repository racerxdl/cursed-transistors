const crypto = require('crypto');

const generateRandomWallet = () => {
  const id = crypto.randomBytes(32).toString('hex');
  const privateKey = "0x"+id;
  const wallet = new ethers.Wallet(privateKey);
  return {
    wallet,
    privateKey,
  }
}

module.exports = {
  generateRandomWallet,
}