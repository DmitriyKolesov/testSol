import { viem } from 'hardhat';

const MINT_VALUE = 100n;
async function main() {
  const publicClient = await viem.getPublicClient();
  const [deployer, acc1, acc2] = await viem.getWalletClients();
  console.log('Deployer:', deployer.account.address);
  // @ts-ignore
  const contract = await viem.deployContract("MyToken");
  console.log('Contract deployed at:', contract.address);
  // @ts-ignore
  const mintTx = await contract.write.mint([acc1.account.address, MINT_VALUE]);
  // @ts-ignore
  await publicClient.waitForTransactionReceipt({ hash: mintTx });
  console.log('Minted', MINT_VALUE, 'tokens to', acc1.account.address);
  // @ts-ignore
  const balanceBN = await contract.read.balanceOf([acc1.account.address]);
  // @ts-ignore
  console.log('Balance of', acc1.account.address, 'is', balanceBN.toString());
  // @ts-ignore
  const votes = await contract.read.getVotes([acc1.account.address]);
  console.log(
    `Account ${
      acc1.account.address
    } has ${votes.toString()} units of voting power before self delegating\n`
  );
  // @ts-ignore
  const delegateTx = await contract.write.delegate([acc1.account.address], {
    account: acc1.account,
  });
  // @ts-ignore
  await publicClient.waitForTransactionReceipt({ hash: delegateTx });
  // @ts-ignore
  const votesAfter = await contract.read.getVotes([acc1.account.address]);
  console.log(
    `Account ${
      acc1.account.address
    } has ${votesAfter.toString()} units of voting power after self delegating\n`
  );
  // @ts-ignore

  const transferTx = await contract.write.transfer(
    [acc2.account.address, MINT_VALUE / 2n],
    {
      account: acc1.account,
    }
  );
  // @ts-ignore
  await publicClient.waitForTransactionReceipt({ hash: transferTx });
  // @ts-ignore
  const votes1AfterTransfer = await contract.read.getVotes([
    acc1.account.address,
  ]);
  console.log(
    `Account ${
      acc1.account.address
    } has ${votes1AfterTransfer.toString()} units of voting power after transferring\n`
  );
  // @ts-ignore
  const votes2AfterTransfer = await contract.read.getVotes([
    acc2.account.address,
  ]);
  console.log(
    `Account ${
      acc2.account.address
    } has ${votes2AfterTransfer.toString()} units of voting power after receiving a transfer\n`
  );

  // @ts-ignore
  const delegate2Tx = await contract.write.delegate([acc2.account.address], {
    account: acc2.account,
  });
  // @ts-ignore
  await publicClient.waitForTransactionReceipt({ hash: delegate2Tx });

  // @ts-ignore
  const votes2AfterDelegation = await contract.read.getVotes([
    acc2.account.address,
  ]);
  console.log(
    `Account ${
      acc2.account.address
    } has ${votes2AfterDelegation.toString()} units of voting power after delegation\n`
  );

  console.log('----------------------------------------------')
  // @ts-ignore
  const lastBlockNumber = await publicClient.getBlockNumber();
  for (let index = lastBlockNumber - 1n; index > 0n; index--) {
    // @ts-ignore
    const pastVotes = await contract.read.getPastVotes([
      acc1.account.address,
      index,
    ]);
    console.log(
      `Account ${
        acc1.account.address
      } had ${pastVotes.toString()} units of voting power at block ${index}\n`
    );
  }

}

main().catch(console.error)
