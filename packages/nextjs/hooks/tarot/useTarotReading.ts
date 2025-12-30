"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFHEDecrypt, useInMemoryStorage } from "~~/lib/fhevm/react";
import type { FhevmInstance } from "~~/lib/fhevm";
import { ethers } from "ethers";
import { useReadContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/helper";
import { useWagmiEthers } from "~~/hooks/wagmi/useWagmiEthers";
import type { Contract } from "~~/utils/helper/contract";
import type { AllowedChainIds } from "~~/utils/helper/networks";

export type TarotReadingOnChain = {
  id: bigint;
  timestamp: number;
  spreadType: number;
  encryptedCardIds: string[];
  encryptedIsReversed: string[];
};

type UseTarotReadingParams = {
  instance: FhevmInstance | undefined;
  initialMockChains?: Readonly<Record<number, string>>;
};

export type UseTarotReadingResult = {
  contractAddress?: `0x${string}`;
  chainId?: number;
  reading?: TarotReadingOnChain;
  readingId?: bigint;
  clearCardIds?: number[];
  clearOrientations?: boolean[];
  isDecrypting: boolean;
  isDecrypted: boolean;
  canDecrypt: boolean;
  canRequest: boolean;
  isRequesting: boolean;
  message: string;
  requestReading: (spreadType: number) => Promise<void>;
  decryptReading: () => Promise<void>;
  refreshReading: () => Promise<void>;
  resetReading: () => void;
};

type ContractInfo = Contract<"Tarot">;

export const useTarotReading = ({ instance, initialMockChains }: UseTarotReadingParams): UseTarotReadingResult => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const { chainId, ethersReadonlyProvider, ethersSigner } = useWagmiEthers(initialMockChains);
  const allowedChainId = typeof chainId === "number" ? (chainId as AllowedChainIds) : undefined;
  const { data: tarotContract } = useDeployedContractInfo({ contractName: "Tarot", chainId: allowedChainId });

  const [readingId, setReadingId] = useState<bigint | null>(null);
  const [reading, setReading] = useState<TarotReadingOnChain | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  const hasContract = Boolean(tarotContract?.address && tarotContract?.abi);
  const hasSigner = Boolean(ethersSigner);
  const contractAddress = tarotContract?.address as `0x${string}` | undefined;

  useEffect(() => {
    if (!hasContract) {
      setReading(undefined);
      setReadingId(null);
    }
  }, [hasContract]);

  const readResult = useReadContract({
    address: contractAddress,
    abi: hasContract ? ((tarotContract as ContractInfo).abi as any) : undefined,
    functionName: "getReading" as const,
    args: readingId !== null ? [readingId] : undefined,
    query: {
      // Use wagmi's public client for reads; don't block on ethersReadonlyProvider which may be unset due to RPC issues.
      enabled: Boolean(readingId !== null && hasContract && ethersReadonlyProvider ),
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (readingId === null) return;
    if (!hasContract) return;
    if (!readResult.refetch) return;
    void readResult.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readingId, hasContract]);

  useEffect(() => {
    if (!readResult.data) return;
    const [id, timestamp, spreadType, encryptedCardIds, encryptedIsReversed] = readResult.data as [
      bigint,
      bigint,
      number,
      string[],
      string[],
    ];
    setReading({
      id,
      timestamp: Number(timestamp),
      spreadType: Number(spreadType),
      encryptedCardIds: [...(encryptedCardIds ?? [])],
      encryptedIsReversed: [...(encryptedIsReversed ?? [])],
    });
  }, [readResult.data]);

  useEffect(() => {
    if (readResult.error) {
      const error = readResult.error as Error;
      setMessage(`Failed to fetch reading: ${error.message}`);
    }
  }, [readResult.error]);

  const getContract = useCallback(() => {
    if (!hasContract || !ethersSigner) return undefined;
    return new ethers.Contract(tarotContract!.address, (tarotContract as ContractInfo).abi as any, ethersSigner);
  }, [ethersSigner, hasContract, tarotContract]);

  const canRequest = Boolean(hasContract && hasSigner && !isRequesting);

  const requestReading = useCallback(
    async (spreadType: number) => {
      if (!canRequest) {
        setMessage("Wallet or contract is unavailable. Please check your connection and network.");
        return;
      }
      const contract = getContract();
      if (!contract) {
        setMessage("Could not initialize the Tarot contract.");
        return;
      }
      setIsRequesting(true);
      setMessage("Calling the oracle—please wait for the on-chain response...");
      try {
        // Some RPCs / wallet providers fail to estimate gas for FHEVM-related calls (missing revert data).
        // Providing a manual gasLimit bypasses estimateGas.
        const tx = await contract.requestReading(spreadType, { gasLimit: 3_000_000n });
        setMessage("Reading submitted. Waiting for on-chain confirmation...");
        const receipt = await tx.wait();

        let newReadingId: bigint | null = null;
        for (const log of receipt.logs ?? []) {
          try {
            const parsed = contract.interface.parseLog({
              topics: log.topics,
              data: log.data,
            });
            if (parsed && parsed.name === "ReadingRequested") {
              const id = parsed.args?.readingId;
              if (typeof id !== "undefined") {
                newReadingId = BigInt(id.toString());
                break;
              }
            }
          } catch {
            continue;
          }
        }

        if (newReadingId === null) {
          const rawNext = await contract.nextReadingId();
          newReadingId = BigInt(rawNext) - 1n;
        }

        setReading(undefined);
        setReadingId(newReadingId);
        setMessage('Reading ready. Click "Decrypt" to reveal your spread.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : String(error));
      } finally {
        setIsRequesting(false);
      }
    },
    [canRequest, getContract],
  );

  const combinedHandles = useMemo(() => {
    if (!reading || !contractAddress) return undefined;
    const cardHandles = reading.encryptedCardIds.map((handle, index) => ({
      key: `card-${index}`,
      handle,
    }));
    const filtered = cardHandles.filter(entry => entry.handle && entry.handle !== ethers.ZeroHash);
    if (!filtered.length) return undefined;
    return filtered;
  }, [contractAddress, reading]);

  const {
    decrypt,
    canDecrypt,
    isDecrypting,
    results,
    message: decryptMessage,
  } = useFHEDecrypt({
    instance,
    ethersSigner: ethersSigner as any,
    fhevmDecryptionSignatureStorage,
    chainId,
    requests: combinedHandles?.map(entry => ({
      handle: entry.handle,
      contractAddress: contractAddress!,
    })),
  });

  useEffect(() => {
    if (decryptMessage) {
      setMessage(decryptMessage);
    }
  }, [decryptMessage]);

  const clearCardIds = useMemo(() => {
    if (!reading) return undefined;
    if (!reading.encryptedCardIds.length) return [];
    const values = reading.encryptedCardIds.map(handle => {
      const raw = results?.[handle];
      if (typeof raw === "undefined") return undefined;
      return Number(raw);
    });
    return values.every(value => typeof value === "number") ? (values as number[]) : undefined;
  }, [reading, results]);

  const clearOrientations = useMemo(() => {
    // Frontend-side pseudo-random orientation (chain env may return biased results).
    // Stable for the same readingId + cardId + index, but does not rely on on-chain encrypted orientation.
    if (!reading) return undefined;
    if (!clearCardIds) return undefined;
    const rid = reading.id;
    return clearCardIds.map((cardId, index) => {
      const h = ethers.keccak256(ethers.toUtf8Bytes(`${rid.toString()}-${cardId}-${index}-${contractAddress ?? ""}`));
      return (BigInt(h) & 1n) === 1n;
    });
  }, [clearCardIds, contractAddress, reading]);

  const isDecrypted =
    Boolean(clearCardIds) &&
    Number(clearCardIds?.length ?? 0) === Number(reading?.encryptedCardIds.length ?? 0);

  const decryptReading = useCallback(async () => {
    await decrypt();
  }, [decrypt]);

  const refreshReading = useCallback(async () => {
    if (!readResult.refetch) return;
    await readResult.refetch();
  }, [readResult]);

  const resetReading = useCallback(() => {
    setReading(undefined);
    setReadingId(null);
    setMessage("");
  }, []);

  return {
    contractAddress,
    chainId,
    reading,
    readingId: reading?.id ?? readingId ?? undefined,
    clearCardIds,
    clearOrientations,
    isDecrypting,
    isDecrypted,
    canDecrypt: Boolean(canDecrypt && combinedHandles?.length),
    canRequest,
    isRequesting,
    message,
    requestReading,
    decryptReading,
    refreshReading,
    resetReading,
  };
};

