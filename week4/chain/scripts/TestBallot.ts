import { viem } from 'hardhat';
import { toHex, hexToString } from 'viem';

const MINT_VALUE = 100n;
async function main() {
  const publicClient = await viem.getPublicClient();
  const [deployer, acc1, acc2, acc3] = await viem.getWalletClients();
  console.log('Deployer:', deployer.account.address);
  // @ts-ignore
  const tokenContract = await viem.deployContract("MyToken");
  console.log('MyToken contract deployed at:', tokenContract.address);
  // @ts-ignore
  let tx = await tokenContract.write.mint([acc1.account.address, MINT_VALUE]);
  // @ts-ignore
  await publicClient.waitForTransactionReceipt({ hash: tx });
  console.log('Minted', MINT_VALUE, 'tokens to', acc1.account.address);
  // @ts-ignore
  let balanceBN = await tokenContract.read.balanceOf([acc1.account.address]);
  console.log('Balance of', acc1.account.address, 'is', balanceBN.toString());

  // @ts-ignore
  tx = await tokenContract.write.delegate([acc1.account.address], {
    account: acc1.account,
  });
  // @ts-ignore
  await publicClient.waitForTransactionReceipt({ hash: tx });
  // @ts-ignore
  tx = await tokenContract.write.transfer(
    [acc2.account.address, MINT_VALUE / 2n],
    {
      account: acc1.account,
    }
  );
  // @ts-ignore
  await publicClient.waitForTransactionReceipt({ hash: tx });

  // @ts-ignore
  tx = await tokenContract.write.delegate([acc2.account.address], {
    account: acc2.account,
  });
  // @ts-ignore
  await publicClient.waitForTransactionReceipt({ hash: tx });

  // @ts-ignore
  tx = await tokenContract.write.transfer(
    [acc3.account.address, MINT_VALUE / 4n],
    {
      account: acc2.account,
    }
  );
  // @ts-ignore
  await publicClient.waitForTransactionReceipt({ hash: tx })
  // @ts-ignore
  tx = await tokenContract.write.delegate([acc3.account.address], {
    account: acc3.account,
  });
  // @ts-ignore
  await publicClient.waitForTransactionReceipt({ hash: tx })
  // @ts-ignore
  const lastBlockNumber = await publicClient.getBlockNumber();
  const proposals = ['Chocolate', 'Vanilla', 'Strawberry', 'Mint-Chocolate']
    .map((prop) => toHex(prop, { size: 32 }));
  // @ts-ignore
  const ballotContract = await viem.deployContract("TokenizedBallot", [
    proposals,
    tokenContract.address,
    lastBlockNumber,
  ]);
  try {
    // @ts-ignore
    await ballotContract.write.vote([0, 50], { account: deployer.account });
  } catch (error) {
    console.log(error.details)
  }

  // @ts-ignore
  await ballotContract.write.vote([0, 25], { account: acc1.account });
  // @ts-ignore
  await ballotContract.write.vote([1, 25], { account: acc1.account });
  // @ts-ignore
  await ballotContract.write.vote([1, 25], { account: acc2.account });
  // @ts-ignore
  await ballotContract.write.vote([2, 25], { account: acc3.account });

  // @ts-ignore
  const winnerName = await ballotContract.read.winnerName();
  console.log('Winner:', hexToString(winnerName));
}

main().catch(console.error)
