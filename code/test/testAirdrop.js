const { expect } = require("chai"); 
const { generateRandomWallet } = require('./tools');

describe("Airdrop", () => {
  it("should create one transistor per described wallet", async () => {
    const Cursed = await ethers.getContractFactory("CursedTransistor");
    const hardhatCursed = await Cursed.deploy("http://test");
    const wallets = [];

    for (let i = 0; i < 16; i++) {
      const { wallet: testWallet } = generateRandomWallet();
      wallets.push(testWallet.address);
    }

    const tx = await hardhatCursed.airdrop(wallets);
    await tx.wait();
    const count = (await Promise.all(wallets.map((addr) => hardhatCursed.balanceOf(addr)))).map((c) => c.toNumber());
    expect(count.filter((c) => c === 0).length).to.equal(0);
    expect(count.filter((c) => c > 1).length).to.equal(0);
    expect(count.filter((c) => c === 1).length).to.equal(wallets.length);
  })

  it("should create N if listed N times", async() => {
    const Cursed = await ethers.getContractFactory("CursedTransistor");
    const hardhatCursed = await Cursed.deploy("http://test");
    const { wallet: testWallet } = generateRandomWallet();
    const wallets = [testWallet.address, testWallet.address, testWallet.address];
    const tx = await hardhatCursed.airdrop(wallets);
    await tx.wait();
    const count = await hardhatCursed.balanceOf(testWallet.address);
    expect(count.toNumber()).to.equal(wallets.length);
  })
})
