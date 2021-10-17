const { expect } = require("chai"); 
const crypto = require('crypto');


describe("Royalities", function () {
  let owner, testWallet;

  this.beforeAll(async () => {
    [owner, testWallet] = await ethers.getSigners();
  })

  it("Royality should be 5%", async () => {
    const Cursed = await ethers.getContractFactory("CursedTransistor");

    const hardhatCursed = await Cursed.deploy("http://test");

    // Test two values to be sure
    let royal = await hardhatCursed.royaltyInfo(0, 100);
    expect(royal.royaltyAmount.toNumber()).to.equal(5);
    
    royal = await hardhatCursed.royaltyInfo(0, 60);
    expect(royal.royaltyAmount.toNumber()).to.equal(3);
  });

  it("Royality receiver can be set by owner", async () => {
    const Cursed = await ethers.getContractFactory("CursedTransistor");

    const hardhatCursed = await Cursed.deploy("http://test");
    await hardhatCursed.setRoyaltiesReceiver(testWallet.address);

    const royal = await hardhatCursed.royaltyInfo(0, 100);
    expect(royal.receiver).to.equal(testWallet.address);

    const addr = await hardhatCursed.royaltiesReceiver();
    expect(addr).to.equal(testWallet.address);
  });

  it("Expect IERC2981 interface as supported", async() => {
    const Cursed = await ethers.getContractFactory("CursedTransistor");
    const hardhatCursed = await Cursed.deploy("http://test");
    let supported = await hardhatCursed.supportsInterface(0x2a55205a); // IERC2981
    expect(supported).to.equal(true);
  })

});