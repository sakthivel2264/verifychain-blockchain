require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_build_directory: "./src/contracts/",
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider({
        privateKeys: [process.env.PRIVATE_KEY],
        providerOrUrl: `https://eth-sepolia.g.alchemy.com/v2/c4IFdbdPxmAm3dNjpkNwdp0bTp1ohNoS`,
        pollingInterval: 15000 // Increase the polling interval to 15 seconds
      }),
      network_id: 11155111,
      gas: 35000000, // Maximum block limit
      gasPrice: 10000000000, // 20 Gwei (in wei)
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  mocha: {
    timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  }
};