import { sepolia } from "viem/chains";
import { http, createWalletClient, formatEther, toHex, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
import { abi, bytecode } from "../artifacts/contracts/BallotContract.sol/Ballot.json";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  console.log('Arguments:', process.argv);
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  console.log("Deployer address:", deployer.account.address);
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  // @ts-ignore
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);
  // @ts-ignore
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol,
  );
  const proposals = process.argv.slice(2);
  if (!proposals || proposals.length < 1)
    throw new Error("Proposals not provided");
  console.log("Proposals:");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  console.log("\nDeploying Ballot contract");
  // @ts-ignore
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [proposals.map((prop) => toHex(prop, { size: 32 }))],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  // @ts-ignore
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Ballot contract deployed to:", receipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
