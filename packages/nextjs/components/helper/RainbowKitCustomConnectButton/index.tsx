"use client";

// @refresh reset
import { Balance } from "../Balance";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet2 } from "lucide-react";
import { Address } from "viem";
import { useTargetNetwork } from "~~/hooks/helper/useTargetNetwork";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = ({ compact = false }: { compact?: boolean } = {}) => {
  const { targetNetwork } = useTargetNetwork();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <>
            {(() => {
              if (!connected) {
                if (compact) {
                  return (
                    <button
                      className="inline-flex h-12 w-12 items-center justify-center text-white"
                      onClick={openConnectModal}
                      type="button"
                      aria-label="Connect wallet"
                    >
                      <Wallet2 className="h-6 w-6" />
                    </button>
                  );
                }
                return (
                  <button
                    className="btn btn-md rounded-full border border-white/20 bg-transparent px-5 py-2 text-white font-semibold cursor-pointer"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />;
              }

              return (
                <button
                  type="button"
                  onClick={openAccountModal}
                  className={
                    compact
                      ? "inline-flex h-12 w-12 items-center justify-center text-white"
                      : "inline-flex items-center gap-3 rounded-full border border-white/20 bg-transparent text-white px-4 py-2"
                  }
                  aria-label="View wallet options"
                >
                  {compact ? (
                    <Wallet2 className="h-6 w-6" />
                  ) : (
                    <>
                      <Balance address={account.address as Address} className="min-h-0 h-auto text-sm" />
                      <span>{account.displayName}</span>
                    </>
                  )}
                </button>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
