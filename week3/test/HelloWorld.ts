// import hre, { viem } from 'hardhat';
// import { expect } from 'chai';
// import { PublicClient } from '@nomicfoundation/hardhat-viem/src/types';
//
// describe('HelloWorld', () => {
//   it('Should return the right string', async  () => {
//     const publicClient: PublicClient = await viem.getPublicClient()
//     // @ts-ignore
//     const lastBlock = await publicClient.getBlock();
//     //console.log('lastBlock', lastBlock)
//     const walletClients = await viem.getWalletClients();
//     const helloWorldContract = await viem.deployContract('HelloWorld');
//     const helloWorldText = await helloWorldContract.read.helloWorld();
//     expect(helloWorldText).to.be.equal('Hello World');
//     // const HelloWorld = await hre.viem.deployContract('HelloWorld');
//     // expect(await HelloWorld.read.sayHello()).to.equal('Hello, World!');
//   });
// })
