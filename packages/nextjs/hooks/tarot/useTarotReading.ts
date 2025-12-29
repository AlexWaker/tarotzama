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
      enabled: Boolean(readingId !== null && hasContract && ethersReadonlyProvider),
      refetchOnWindowFocus: false,
    },
  });

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
      setMessage(`获取占卜失败: ${error.message}`);
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
        setMessage("钱包或合约不可用，请检查连接与网络。");
        return;
      }
      const contract = getContract();
      if (!contract) {
        setMessage("未能实例化塔罗合约。");
        return;
      }
      setIsRequesting(true);
      setMessage("正在呼唤神谕，耐心等待链上回应...");
      try {
        // Some RPCs / wallet providers fail to estimate gas for FHEVM-related calls (missing revert data).
        // Providing a manual gasLimit bypasses estimateGas.
        const tx = await contract.requestReading(spreadType, { gasLimit: 3_000_000n });
        setMessage("占卜已提交，等待链上确认...");
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
        setMessage("读取成功，点击“解密”解锁你的塔罗牌阵。");
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
    const orientationHandles = reading.encryptedIsReversed.map((handle, index) => ({
      key: `orientation-${index}`,
      handle,
    }));
    const merged = [...cardHandles, ...orientationHandles].filter(entry => entry.handle && entry.handle !== ethers.ZeroHash);
    if (!merged.length) return undefined;
    return merged;
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
    if (!reading) return undefined;
    if (!reading.encryptedIsReversed.length) return [];
    const values = reading.encryptedIsReversed.map(handle => {
      const raw = results?.[handle];
      if (typeof raw === "undefined") return undefined;
      return raw === 1n;
    });
    return values.every(value => typeof value === "boolean") ? (values as boolean[]) : undefined;
  }, [reading, results]);

  const isDecrypted =
    Boolean(clearCardIds && clearOrientations) &&
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

