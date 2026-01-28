'use client';
import { IconButton } from '@/components/ui/IconButton';
import { WalletAddress } from '@/components/ui/WalletAddress';
import { ChainIcon } from '@/components/ui/ChainIcon';
import { ExternalLink, Copy, Power, Wallet } from 'lucide-react';
import { useWallets } from '@/hooks/useWallets';
import { toast } from 'sonner';
import { WalletMultiButton } from '@provablehq/aleo-wallet-adaptor-react-ui';
import { useWallet as useAleoWallet } from '@provablehq/aleo-wallet-adaptor-react';

export default function Home() {
  const { connectedWallets, disconnectWallet } = useWallets();

  const {
    connected: aleoConnected // boolean - whether wallet is connected
  } = useAleoWallet();

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  const openExplorer = (
    address: string,
    type: 'evm' | 'solana' | 'aleo',
    chainId?: number | string
  ) => {
    const url = `https://explorer.provable.com/address/${address}`;
    window.open(url, '_blank');
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Connect Buttons */}
      <div className="space-y-2">
        <div className="mt-2 w-full grid grid-cols-1">
          <WalletMultiButton className="!w-full mx-auto py-3 px-4 !rounded-xl !text-primary !bg-secondary hover:!bg-secondary/80 transition-colors font-medium flex items-center justify-center gap-2">
            <Wallet className="w-4 h-4" />
            {aleoConnected ? 'Aleo Wallet Connected' : 'Connect Aleo Wallet'}
          </WalletMultiButton>
        </div>
      </div>

      {/* Connected Wallets */}
      {connectedWallets.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Connected Wallets</p>

          {connectedWallets.map((wallet) => (
            <div key={wallet.address} className="p-4 rounded-xl bg-secondary">
              <div className="flex items-center gap-3 mb-3">
                <ChainIcon chainId={wallet.chainId || 1} size="lg" />
                <div className="flex-1">
                  <p className="font-medium">{wallet.name}</p>
                  <WalletAddress address={wallet.address} />
                </div>
              </div>

              {wallet.balance && (
                <p className="text-sm text-muted-foreground mb-3">
                  Balance: {wallet.balance}
                </p>
              )}

              <div className="flex items-center gap-2">
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    openExplorer(wallet.address, wallet.type, wallet.chainId)
                  }
                  title="View on Explorer"
                >
                  <ExternalLink className="w-4 h-4" />
                </IconButton>
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={() => copyAddress(wallet.address)}
                  title="Copy Address"
                >
                  <Copy className="w-4 h-4" />
                </IconButton>
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={() => disconnectWallet(wallet.address)}
                  title="Disconnect"
                  className="text-destructive hover:text-destructive"
                >
                  <Power className="w-4 h-4" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {connectedWallets.length === 0 && (
        <div className="text-center py-8">
          <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            Connect a wallet to get started
          </p>
        </div>
      )}
    </div>
  );
};

 