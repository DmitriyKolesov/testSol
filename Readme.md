Weekend Project 1
Interact with “HelloWorld.sol” within your group to change message strings and change owners
Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
Try running some of the following tasks:

success Deployed HelloWorldNew.sol contract on Sepolia testnet
Txn Hash:
0xa1ba5152d6a666ef52cb4fa998ec18370e03dd91597e805941d1437619a98ede

Contract Address:
0x8D3d1c6332f878008c311f820827618b60D3ECc0


Call setText Function
Success When we called this function by owner.

Txn Hash:
0x4b842143a0372804c7920d940fa25602b7f923913d743886ee62e5ebd5748a67

Storage:
Before: Hello World
After: 	new

Fail When we called function with modifier "notOwner".

Txn Hash:
0x30e95110be3c8a834eb1e6b0d882fbd318b734d6f42eaa18e1c41f16f60fe9db

Fail with error 'Caller is the owner'
We set onlyOwner modifier in setText function, So only owner can call this function.

Called function "setTextOpen" without modifier "onlyOwner"

Storage:
Before: new
After: hi


Call transferOwnership Function
Success When we called this function by owner.

Txn Hash:
0x909c5f91239c2d24a562914b150663b6e15e12679da939bf1c67c4e5b294beeb


New owner: 	0xB6fd9A64B09b869F76e0318885678E34cC74eD56 

Fail When we called setText function by previous owner.

Txn Hash:
0xea61f3f7ed1d1ce4494adb0e36e3dd209d27e5b29a87c0555214d402413ff7b5

Fail with error 'Caller is not the owner'
We set onlyOwner modifier in transferOwnership function, So only owner can call this function.
