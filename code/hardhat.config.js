/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
module.exports = {
   solidity: "0.8.4",
   defaultNetwork: "localhost",
   networks: {
      hardhat: {},
      mainnet: {
         url: 'https://rpc.ftm.tools',
      },
   },
   mocha: {
      timeout: 120000
   }
}
