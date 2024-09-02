import { sepolia } from "viem/chains";
import { http, createWalletClient, formatEther, toHex, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
import { abi as tokenAbi, bytecode as tokenRawBytecode } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import { abi, bytecode as rawBytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { Hex } from "viem";

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
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol,
  );
  // Deploy Token Contract
  const tokenBytecode: Hex = tokenRawBytecode.startsWith("0x") ? tokenRawBytecode as Hex : `0x${tokenRawBytecode}` as Hex;
  console.log("Deploying Token contract");
  // @ts-ignore
  const tokenHash = await deployer.deployContract({
    abi: tokenAbi,
    bytecode: tokenBytecode,
    args: [],
  });
  console.log("Token contract transaction hash:", tokenHash);

  // Wait for Token contract deployment to be mined
  // @ts-ignore
  const tokenReceipt = await publicClient.waitForTransactionReceipt({ hash: tokenHash });
  const tokenContractAddress = tokenReceipt.contractAddress;
  console.log("Token contract deployed to:", tokenContractAddress);
  const proposals = process.argv.slice(2);
  if (!proposals || proposals.length < 1)
    throw new Error("Proposals not provided");
  console.log("Proposals:");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const bytecode: Hex = rawBytecode.startsWith("0x") ? rawBytecode as Hex : `0x${rawBytecode}` as Hex;
  const proposalHexArray: Hex[] = proposals.map((prop) => toHex(prop, { size: 32 })) as Hex[];
  // @ts-ignore
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);
  console.log("\nDeploying Ballot contract");
  // @ts-ignore
  const hash = await deployer.deployContract({
    abi,
    bytecode,
    args: [ proposalHexArray, tokenContractAddress ] as unknown as readonly (readonly (readonly any[])[])[],
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
