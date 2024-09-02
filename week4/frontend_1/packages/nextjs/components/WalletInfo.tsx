import { useAccount } from 'wagmi';
import { WalletAction } from '~~/components/WalletAction';
import { WalletBalance } from '~~/components/WalletBalance';

export const WalletInfo = () => {
  const { address, isConnecting, isDisconnected, chain } = useAccount();
  console.log({account: useAccount()})
  if (address)

    return (
      <div>
        <p>Your account address is {address}</p>
        <p>Connected to the network {chain?.name}</p>
        <WalletAction></WalletAction>
        <WalletBalance address={address}></WalletBalance>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}
