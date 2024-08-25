import { viem } from 'hardhat';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parseEther } from 'viem';


const TEST_RATIO = 100n;
const TEST_PRICE = 10n;
const TEST_PURCHASE_SIZE = parseEther('1');
const TEST_RETURN_SIZE = parseEther('0.5');

async function deployTokenSaleContract(ratio: bigint, price: bigint) {
  const publicClient = await viem.getPublicClient();
  const [owner, otherAccount] = await viem.getWalletClients();
  const nftContract = await viem.deployContract("MyNFT");
  const myTokenContract = await viem.deployContract("MyToken");
  const tokenSaleContract =
    // @ts-ignore
    await viem.deployContract("TokenSale", [ratio, price, myTokenContract.address, nftContract.address]);
  const MINTER_ROLE = await myTokenContract.read.MINTER_ROLE();
  const giveMinterRoleTx = await myTokenContract.write.grantRole([MINTER_ROLE, tokenSaleContract.address]);
  return {
    tokenSaleContract,
    nftContract,
    myTokenContract,
    owner,
    otherAccount,
    publicClient,
  };
}
describe("NftShop", async () => {
  // it("Defines the ratio as provided in parameters", async () => {
  //   throw new Error('Not implemented');
  // });
  it("defines the ratio as provided in parameters", async () => {
    const {
      tokenSaleContract,
      owner,
      otherAccount,
      publicClient,
    } = await deployTokenSaleContract(TEST_RATIO, TEST_PRICE);
    console.log('Contract address', tokenSaleContract.address);
    // @ts-ignore
    const ratio = await tokenSaleContract.read.ratio();
    expect(ratio).to.equal(TEST_RATIO);
    // @ts-ignore
    const paymentTokenAddress = await tokenSaleContract.read.paymentToken();
    const paymentTokenContract =
      await viem.getContractAt('MyToken', paymentTokenAddress);
    const [totalSupply, name, symbol, decimals] =
      await Promise.all([
        paymentTokenContract.read.totalSupply(),
        paymentTokenContract.read.name(),
        paymentTokenContract.read.symbol(),
        paymentTokenContract.read.decimals(),]);
    //expect(totalSupply).to.equal(0n);
    expect(decimals).to.equal(18);
    expect(name).to.equal('MyToken');
    expect(symbol).to.equal('MTK');
  });
  it('allows to buy tokens', async () => {

  });
  it('gives the correct amount of tokens', async () => {
    const { tokenSaleContract, myTokenContract, otherAccount, publicClient } = await deployTokenSaleContract(TEST_RATIO, TEST_PRICE);
    const tokenBalanceBefore = await myTokenContract.read.balanceOf([otherAccount.account.address]);
    const buyTokensTx =
      await tokenSaleContract.write.buyTokens({ value: TEST_PURCHASE_SIZE, account: otherAccount.account });
    // @ts-ignore
    const receipt = await publicClient.getTransactionReceipt({ hash: buyTokensTx });
    if(receipt?.status !== 'success') {
      throw Error('Transaction failed');
    }
    const gasUsed = receipt.gasUsed;
    const gasPrice = receipt.effectiveGasPrice;
    const txCost = gasUsed * gasPrice;
    console.log({gasUsed, gasPrice, txCost});
    const tokenBalanceAfter = await myTokenContract.read.balanceOf([otherAccount.account.address]);
    // @ts-ignore
    const diff = tokenBalanceAfter - tokenBalanceBefore - txCost;
    console.log({tokenBalanceAfter, tokenBalanceBefore, diff});
    expect(diff).to.equal(TEST_PURCHASE_SIZE * TEST_RATIO);
  });
  it('burns correct amount of tokens', async () => {
    const { tokenSaleContract, myTokenContract, otherAccount, publicClient } = await deployTokenSaleContract(TEST_RATIO, TEST_PRICE);
    const tokenBalanceBefore = await myTokenContract.read.balanceOf([otherAccount.account.address]);
    const buyTokensTx =
      await tokenSaleContract.write.buyTokens({ value: TEST_PURCHASE_SIZE, account: otherAccount.account });
    // @ts-ignore
    const receipt = await publicClient.getTransactionReceipt({ hash: buyTokensTx });
    if(receipt?.status !== 'success') {
      throw Error('Transaction failed');
    }
    const gasUsed = receipt.gasUsed;
    const gasPrice = receipt.effectiveGasPrice;
    const txCost = gasUsed * gasPrice;
    const tokenBalanceAfter = await myTokenContract.read.balanceOf([otherAccount.account.address]);
    const returnTokensTx = await tokenSaleContract.write.returnTokens([TEST_RETURN_SIZE], { account: otherAccount.account });
    const returnReceipt = await publicClient.getTransactionReceipt({ hash: returnTokensTx });
    if(returnReceipt?.status !== 'success') {
      throw Error('Return failed');
    }
    const approveTx = await myTokenContract.write.approve([tokenSaleContract.address, TEST_RETURN_SIZE], { account: otherAccount.account });
    const approveReceipt = await publicClient.getTransactionReceipt({ hash: approveTx });
    if(approveReceipt?.status !== 'success') {
      throw Error('Approve failed');
    }
    const tokenBalanceAfterReturn = await myTokenContract.read.balanceOf([otherAccount.account.address]);
    const diff = tokenBalanceAfterReturn - tokenBalanceAfter;
    expect(diff).to.equal(TEST_RETURN_SIZE);
  })
})
