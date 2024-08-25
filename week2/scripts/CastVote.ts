import { createPublicClient, hexToString, http } from 'viem';
import { sepolia } from 'viem/chains';
import { abi } from "../artifacts/contracts/BallotContract.sol/Ballot.json";

const providerApiKey = process.env.ALCHEMY_API_KEY || "";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

const parameters = process.argv.slice(2);
if (!parameters || parameters.length < 2)
  throw new Error("Parameters not provided");
const contractAddress = parameters[0] as `0x${string}`;
if (!contractAddress) throw new Error("Contract address not provided");
if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
  throw new Error("Invalid contract address");
const proposalIndex = parameters[1];
if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");

console.log("Proposal selected: ");
// @ts-ignore
const proposal = async () => (await publicClient.readContract({
  address: contractAddress,
  abi,
  functionName: "proposals",
  args: [BigInt(proposalIndex)],
})) as any[];
// @ts-ignore
const name = hexToString(proposal[0], { size: 32 });
console.log("Voting to proposal", name);
console.log("Confirm? (Y/n)");

// @ts-ignore
const stdin = process.openStdin();
// @ts-ignore
stdin.addListener("data", async function (d) {
  console.log({d})
  if (d.toString().trim().toLowerCase() != "n") {
    const hash = await d.writeContract({
      address: contractAddress,
      abi,
      functionName: "vote",
      args: [BigInt(proposalIndex)],
    });
    console.log("Transaction hash:", hash);
    console.log("Waiting for confirmations...");
    // @ts-ignore
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Transaction confirmed");
  } else {
    console.log("Operation cancelled");
  }
  process.exit();
});
