require("@matterlabs/hardhat-zksync-solc");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // ✅ Ensure .env is loaded

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sepolia", // ✅ Moved to the root level
  zksolc: {
    version: "1.3.9",
    compilerSource: "binary",
    settings: {
      optimizer: { enabled: true },
    },
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://rpc.ankr.com/eth_sepolia",
      accounts: [`0x${process.env.PRIVATE_KEY}`], // ✅ Ensure .env has PRIVATE_KEY
    },
    zksync_testnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli",
      chainId: 280,
      zksync: true,
    },
    zksync_mainnet: {
      url: "https://zksync2-mainnet.zksync.io/",
      ethNetwork: "mainnet",
      chainId: 324,
      zksync: true,
    },
  },
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
};
