import { viem } from "hardhat";

async function main() {
  console.log("Proposals: ");
  console.log("\nDeploying contract");
  const MyErc20Contract = await viem.deployContract("MyErc20",
  );
  console.log("Contract deployed to:", MyErc20Contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
