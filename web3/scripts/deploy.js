const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const { ethers } = require("ethers");
require("dotenv").config(); // Load environment variables

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

if (!PRIVATE_KEY || !RPC_URL) {
  console.error("❌ Error: PRIVATE_KEY or RPC_URL is missing in .env file!");
  process.exit(1);
}

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const sdk = ThirdwebSDK.fromSigner(wallet);

async function deployContract() {
  try {
    console.log("🚀 Deploying contract...");

    const contract = await sdk.deployer.deployBuiltInContract({
      contractType: "custom",
      contractMetadata: {
        name: "Crowdfunding",
        description: "A decentralized crowdfunding platform",
        abi: require("../artifacts-zk/contracts/Crowdfunding.sol/Crowdfunding.json").abi,
        bytecode: require("../artifacts-zk/contracts/Crowdfunding.sol/Crowdfunding.json").bytecode,
      },
    });

    console.log("✅ Contract deployed at:", contract.address);
  } catch (error) {
    console.error("❌ Error deploying contract:", error);
  }
}

deployContract();
