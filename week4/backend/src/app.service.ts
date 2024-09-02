import { Injectable } from '@nestjs/common';
import { Address, createPublicClient, createWalletClient, custom, formatEther, http } from 'viem';
import { sepolia } from 'viem/chains';
// @ts-ignore
import * as tokenJson from '../assets/MyToken.json';
import { privateKeyToAccount } from 'viem/accounts';
const CONTRACT_ADDRESS = '0x2f19f002a061cd182411503c4fffabbbda8bf407';

@Injectable()
export class AppService {
  publicClient;
  account;
  constructor() {
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(`https://ethereum-sepolia-rpc.publicnode.com`),
    });
    // tslint:disable-next-line:no-console
    this.account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
  }
  getHello(): string {
    return 'Hello World!';
  }

  getContractAddress(): Address {
    return CONTRACT_ADDRESS;
  }

  async getTokenName(): Promise<string> {
    // @ts-ignore
    const name = this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'name',
    });
    return name;
  }
  async getTotalSupply(): Promise<string> {
    // @ts-ignore
    const totalSupply = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'totalSupply',
    });
    return formatEther(totalSupply as bigint);
  }

  async checkMinterRole(address: Address): Promise<boolean> {
    const MINTER_ROLE = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6';
    const hasRole = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'hasRole',
      args: [MINTER_ROLE, address],
    });
    return hasRole;
  }
  async getTokenBalance(address: Address): Promise<string> {
    const balance = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'balanceOf',
      args: [address],
    });
    return formatEther(balance as bigint);
  }
  async getVotes(address: Address): Promise<string> {
    const votes = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'getVotes',
      args: [address],
    });
    return formatEther(votes as bigint);
  }
  // tslint:disable-next-line:adjacent-overload-signatures
  async mintTokens(address, amount) {
    const walletClient = createWalletClient({
      account: this.account,
      chain: sepolia,
      transport: custom(this.publicClient),
    });
    // @ts-ignore
    const mintTx = await walletClient.writeContract({
      // account: this.account,
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'mint',
      args: [address, amount],
    });
    // tslint:disable-next-line:no-console
    console.log({mintTx});
    return mintTx;
  }
  async delegate(address) {
    const walletClient = createWalletClient({
      account: this.account,
      chain: sepolia,
      transport: custom(this.publicClient),
    });
    // @ts-ignore
    const delegateTx = await walletClient.writeContract({
      // account: this.account,
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'delegate',
      args: [address],
    });
    // tslint:disable-next-line:no-console
    console.log({delegateTx});
    return delegateTx;
  }
}
