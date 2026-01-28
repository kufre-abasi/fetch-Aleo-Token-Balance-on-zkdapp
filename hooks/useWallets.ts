'use client';
import { useState, useEffect, useCallback } from 'react';
import { ConnectedWallet } from '@/types';
 import { useWallet as useAleoWallet } from '@provablehq/aleo-wallet-adaptor-react';
 import {
    AleoNetworkClient

 } from '@provablehq/sdk';

/**
 * Custom hook to manage wallet connections and retrieve balances.
 * This hook centralizes wallet logic, including connecting, disconnecting,
 * and fetching the balance for the connected Aleo wallet.
 */
export const useWallets = () => {
    // Access all aleo wallets state and methods from the Aleo wallet adapter.
    const {
      connected: aleoConnected, // boolean - whether wallet is connected
      address: aleoAddress, // string | null - connected wallet address
       wallet: aleoWallet, // Wallet | null - connected wallet adapter
      disconnect: aleoDisconnect ,// () => Promise<void> - function to disconnect
    } =  useAleoWallet();
  
  // State to store the fetched Aleo balance.
  const [aleoBalance, setAleoBalance] = useState<string | null>(null);

  // Effect to fetch the Aleo balance whenever the wallet address changes.
  useEffect(() => {
    const fetchAleoBalance = async () => {
      // Only fetch balance if an address is available.
      if (aleoAddress) {
        try {
            // Initialize the Aleo network client.
            const networkClient = new AleoNetworkClient(
            'https://api.provable.com/v2'
          );

          // Get the public balance from the 'credits.aleo' program's 'account' mapping.
          const publicBalanceString =
            (
              await networkClient.getProgramMappingValue(
                'credits.aleo',
                'account',
                aleoAddress
              )
            // Clean the raw balance string by removing type suffixes (e.g., 'u64.public').
            )?.replace(/u\d+(?:\.public)?/g, '') ?? '0';

          // Convert the cleaned string to a BigInt.
          const publicBalance = BigInt(publicBalanceString);

           // Convert microcredits to Aleo credits (6 decimal places) and format it.
          const balanceInAleo = (Number(publicBalance) / 1_000_000).toFixed(6);
          setAleoBalance(balanceInAleo);
        } catch (error) {
          console.error('Failed to fetch Aleo balance:', error);
          setAleoBalance(null); // Reset balance on error.
        }
      } else {
        // If no address, ensure balance is null.
        setAleoBalance(null);
      }
    }
    fetchAleoBalance()
  },[aleoAddress])

  // Array to hold information about all connected wallets.
  const connectedWallets: ConnectedWallet[] = [];

// If an Aleo wallet is connected, format and add its details to the array.
if (aleoConnected && aleoAddress) {
    connectedWallets.push({
      address: aleoAddress,
      type: 'aleo',
      chainId: 'aleo', // Static chainId for Aleo
      balance: aleoBalance ? `${aleoBalance} ALEO` : undefined,
      name: aleoWallet?.adapter.name || 'Aleo',
      icon: aleoWallet?.adapter?.icon
    });
}
 
  // Boolean flag indicating if any wallet is currently connected.
  const isAnyWalletConnected =  aleoConnected;

  // Callback function to disconnect the currently connected Aleo wallet.
  const disconnectWallet = useCallback(
    (address: string) => {
        // For simplicity, this currently only handles Aleo.
        // It could be extended to handle multiple wallet types based on address or type.
        aleoDisconnect();
    },
    [aleoDisconnect,aleoAddress]
  );

  // Return the consolidated wallet state and actions.
  return {
    connectedWallets,
    isAnyWalletConnected,
    aleoConnected,
    disconnectWallet,
   };
};
