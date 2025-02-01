require("dotenv").config();
const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const ethers = require("ethers");

// Get your private key from the .env file
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

// Connect to Sepolia network (you can also use other networks)
const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia");
const signer = wallet.connect(provider);

// Initialize the Thirdweb SDK
const sdk = new ThirdwebSDK(signer);

async function deployContract() {
  try {
    // Deploy the contract
    const contract = await sdk.deployer.deployContract(
      "./artifacts/contracts/Crowdfunding.sol/Crowdfunding.json"
    );
    console.log(`Contract deployed at: ${contract.address}`);
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
}

deployContract();
