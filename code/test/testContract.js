const { expect } = require("chai");

describe("Cursed Transistors contract", function () {
  let owner;
  let depositAddress;

  this.beforeAll(async () => {
    [owner, depositAddress, someFucker] = await ethers.getSigners();
  })

  it("base url should be in the constructor", async () => {
    const depositAddressInitialBalance = await depositAddress.getBalance()
    const Contract = await ethers.getContractFactory("CursedTransistor");
    const contract = await Contract.deploy("http://testbaseurl/");
    const receipt = await contract.claim({
      value: ethers.utils.parseEther("1.0"),
    }).catch(e => e.message)
    const url = await contract.tokenURI(1)

    expect(url).to.equal("http://testbaseurl/1")
  })

  it("should mint a token properly and transfer amount to deposit address", async function () {
    const depositAddressInitialBalance = await depositAddress.getBalance()
    const Contract = await ethers.getContractFactory("CursedTransistor");

    const contract = await Contract.deploy("http://test");

    await contract.setDepositAddress(await depositAddress.getAddress())

    const receipt = await contract.claim({
      value: ethers.utils.parseEther("1.0"),
    }).catch(e => e.message)

    const currentBalance = await depositAddress.getBalance();
    const balanceDelta = currentBalance.sub(depositAddressInitialBalance);
    const tokenBalance = await contract.balanceOf(await owner.getAddress());

    expect(receipt).to.not.equal(`Error: VM Exception while processing transaction: reverted with reason string 'Invalid amount'`)
    expect(balanceDelta.eq(ethers.utils.parseEther("1.0"))).equal(true);
    expect(tokenBalance.eq(1)).to.equal(true);
  });


  it("should not mint if user didn't send the right amount", async function () {
    const Contract = await ethers.getContractFactory("CursedTransistor");

    const contract = await Contract.deploy("http://test");

    await contract.setDepositAddress(await depositAddress.getAddress())

    const receipt = await contract.claim({
      value: ethers.utils.parseEther("2.0"),
    }).catch(e => e.message)

    expect(receipt).to.equal(`Error: VM Exception while processing transaction: reverted with reason string 'Invalid amount'`)
  });

  it("should mint a non-early token for the apropriate amount", async () => {
    const Contract = await ethers.getContractFactory("CursedTransistor");

    const contract = await Contract.deploy("http://test");

    await contract.setDepositAddress(await depositAddress.getAddress())

    const earlyClaims = []
    // claim all earlies
    for (let i = 0; i < 1024; i++) {
      const receipt = contract.claim({
        value: ethers.utils.parseEther("1.0"),
      }).catch(e => e.message)
      earlyClaims.push(receipt);
    }

    await Promise.all(earlyClaims);

    const depositAddressInitialBalance = await depositAddress.getBalance()
    const receipt = await contract.claim({
      value: ethers.utils.parseEther("1.6"),
    }).catch(e => e.message)
    expect(receipt).to.not.equal(`Error: VM Exception while processing transaction: reverted with reason string 'Invalid amount'`)


    const currentBalance = await depositAddress.getBalance();
    const balanceDelta = currentBalance.sub(depositAddressInitialBalance);
    const tokenBalance = await contract.balanceOf(await owner.getAddress());

    expect(balanceDelta.eq(ethers.utils.parseEther("1.6"))).equal(true);
    expect(tokenBalance.eq(1025)).to.equal(true);
  })

  it("only contract owner should change the deposit address", async function () {
    const Contract = await ethers.getContractFactory("CursedTransistor");

    const contract = await Contract.deploy("http://test");

    const contractFuckerSigner = contract.connect(someFucker)

    const receipt = await contractFuckerSigner.setDepositAddress(await someFucker.getAddress()).catch(e => e.message)

    expect(receipt).to.equal(`Error: VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'`)
  });

  it("special mint should have id > 1<<64", async() => {
    const Contract = await ethers.getContractFactory("CursedTransistor");
    const contract = await Contract.deploy("http://test");
    const addr = await someFucker.getAddress()
    const expectedId = ethers.utils.parseUnits("18446744073709551617", 0);

    const p = new Promise((resolve) => {
      contract.on('SpecialEmitted', (recipient, tokenId) => {
        expect(recipient).to.equal(addr);
        expect(tokenId.eq(expectedId)).to.equal(true)
        resolve();
      })
    })
    const tx = await contract.sendSpecial(addr);
    await p;
  })

  it("Expect ERC721 interfaces to be implemented", async() => {
    const Cursed = await ethers.getContractFactory("CursedTransistor");
    const hardhatCursed = await Cursed.deploy("http://test");
    let supported = await hardhatCursed.supportsInterface(0x5b5e139f);  // ERC721Metadata
    expect(supported).to.equal(true);
    supported = await hardhatCursed.supportsInterface(0xDEADBEEF); // No interface
    expect(supported).to.equal(false);
  })
});