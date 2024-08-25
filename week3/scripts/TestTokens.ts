import { viem } from 'hardhat';
import { parseEther } from 'viem';

async function main() {
  const publicClient = viem.getPublicClient();
  // @ts-ignore
  const [deployer, account1, account2] = await publicClient.getAccounts();
  const tokenContract = await viem.deployContract("MyToken");
  console.log(`Deployer: ${deployer}`);

  const mintTx = await tokenContract.write.mint(
    [deployer.account.address, parseEther("10")],
    { account: account2.account }
  );
  // @ts-ignore
  await publicClient.waitForTransactionReceipt({ hash: mintTx });
}
