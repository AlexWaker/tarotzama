"use client";

import { useMemo, useState } from "react";
import { useFhevm } from "~~/lib/fhevm/react";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";
import { useTarotReading } from "~~/hooks/tarot/useTarotReading";
import { formatSpreadTitle, getTarotCard, spreadLabels } from "~~/utils/tarotCards";

type SpreadOption = {
  id: number;
  title: string;
  subtitle: string;
  gradient: string;
};

const SPREAD_OPTIONS: SpreadOption[] = [
  {
    id: 0,
    title: spreadLabels[0].title,
    subtitle: spreadLabels[0].subtitle,
    gradient: "from-[#f8d5ff]/50 via-[#b981f1]/70 to-[#35144a]/80",
  },
  {
    id: 1,
    title: spreadLabels[1].title,
    subtitle: spreadLabels[1].subtitle,
    gradient: "from-[#d4f5ff]/50 via-[#7bc6ff]/60 to-[#123966]/80",
  },
  {
    id: 2,
    title: spreadLabels[2].title,
    subtitle: spreadLabels[2].subtitle,
    gradient: "from-[#ffe0b3]/50 via-[#ff9b7b]/60 to-[#532222]/80",
  },
];

const shortenHex = (value?: string, size = 4) => {
  if (!value) return "Unknown";
  return `${value.slice(0, 2 + size)}…${value.slice(-size)}`;
};

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" ");

export const TarotOracle = () => {
  const { isConnected, chain } = useAccount();
  const chainId = chain?.id;

  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return (window as any).ethereum;
  }, []);

  const initialMockChains = { 31337: "http://localhost:8545" } as const;

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  const [spreadType, setSpreadType] = useState<number>(0);

  const tarot = useTarotReading({
    instance: fhevmInstance,
    initialMockChains,
  });

  const resolvedCards = useMemo(() => {
    if (!tarot.clearCardIds || !tarot.clearOrientations) return undefined;
    return tarot.clearCardIds.map((cardId, idx) => {
      const card = getTarotCard(cardId);
      return {
        ...card,
        reversed: Boolean(tarot.clearOrientations?.[idx]),
      };
    });
  }, [tarot.clearCardIds, tarot.clearOrientations]);

  const readingTimestamp = useMemo(() => {
    if (!tarot.reading?.timestamp) return undefined;
    return new Date(Number(tarot.reading.timestamp) * 1000).toLocaleString();
  }, [tarot.reading?.timestamp]);

  const statusChips = [
    { label: "FHEVM", value: fhevmStatus ?? "Initializing" },
    { label: "Network", value: chain?.name ?? "Not connected" },
    { label: "Contract", value: shortenHex(tarot.contractAddress) },
    { label: "Can request", value: tarot.canRequest ? "Yes" : "No" },
    { label: "Can decrypt", value: tarot.canDecrypt ? "Yes" : "No" },
  ];

  if (!isConnected) {
    return (
      <div className="tarot-shell">
        <section className="tarot-panel text-center space-y-6">
          <div className="text-4xl">🔮</div>
          <h1 className="text-3xl font-semibold tracking-wide text-white">ZAMA · Tarot Oracle Sanctum</h1>
          <p className="text-base text-slate-200 leading-relaxed">
            Connect your wallet and summon the crystal ball guarded by FHEVM—your reading will be yours alone.
          </p>
          <div className="flex justify-center">
            <RainbowKitCustomConnectButton />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="tarot-shell">
      <div className="tarot-stars" />
      <section className="tarot-panel space-y-10">
        <header className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-[#d7c1ff]">FHE-Backed Divination</p>
          <h1 className="text-4xl font-semibold text-white">Crystal Ball · Oracle🔮</h1>
          <p className="text-slate-200 max-w-2xl mx-auto">
            Pick a spread, then tap the crystal ball. Zama FHEVM generates a fully encrypted draw on-chain—
            only your wallet can decrypt it. Upright/reversed and the meaning appear instantly.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {SPREAD_OPTIONS.map(option => (
            <button
              key={option.id}
              className={cx(
                "tarot-spread-card",
                `bg-gradient-to-br ${option.gradient}`,
                spreadType === option.id ? "ring-2 ring-[#f8d5ff]/80" : "opacity-80 hover:opacity-100",
              )}
              onClick={() => setSpreadType(option.id)}
            >
              <div className="text-lg font-semibold text-white">{option.title}</div>
              <p className="text-sm text-slate-100/80">{option.subtitle}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-50/70">
                {spreadLabels[option.id]?.cards ?? 0} Cards
              </p>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="tarot-crystal-wrapper">
            <button
              className={cx("tarot-crystal", tarot.isRequesting && "animate-pulse")}
              disabled={!tarot.canRequest}
              onClick={() => tarot.requestReading(spreadType)}
            >
              <span className="text-3xl">✨</span>
            </button>
            <div className="text-center mt-4 text-slate-200 text-sm">
              {tarot.isRequesting ? "Sending your request..." : "Tap the crystal ball to draw now"}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {statusChips.map(chip => (
              <span key={chip.label} className="tarot-chip">
                <span className="text-xs text-slate-300">{chip.label}</span>
                <span className="font-semibold text-white">{chip.value}</span>
              </span>
            ))}
          </div>
          {fhevmError && <p className="text-sm text-rose-200">FHEVM error: {String(fhevmError)}</p>}
        </div>

        <section className="tarot-section space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#f3dbff]/70">
                {tarot.reading ? formatSpreadTitle(tarot.reading.spreadType) : "Waiting for a spread"}
              </p>
              <h2 className="text-2xl font-semibold text-white">
                {tarot.readingId !== undefined ? `Reading #${tarot.readingId.toString()}` : "No draw yet"}
              </h2>
              {readingTimestamp && <p className="text-sm text-slate-300">{readingTimestamp}</p>}
            </div>
            <div className="flex gap-3">
              <button className="tarot-btn-secondary" disabled={!tarot.canDecrypt} onClick={tarot.decryptReading}>
                {tarot.isDecrypting ? "Decrypting..." : "Decrypt cards"}
              </button>
              <button className="tarot-btn-ghost" onClick={tarot.resetReading}>
                Clear
              </button>
            </div>
          </div>
          <p className="text-slate-300 text-sm min-h-[2.5rem]">{tarot.message || "Your prompt will show up here."}</p>
        </section>

        <section className="tarot-section">
          {resolvedCards ? (
            <div className={cx("grid gap-6", resolvedCards.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
              {resolvedCards.map((card, idx) => (
                <article key={`${card.id}-${idx}`} className="tarot-card">
                  <header className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Card {idx + 1}</span>
                    <span
                      className={cx(
                        "text-xs px-3 py-1 rounded-full",
                        card.reversed ? "bg-rose-300/20 text-rose-200" : "bg-emerald-300/20 text-emerald-200",
                      )}
                    >
                      {card.reversed ? "Reversed" : "Upright"}
                    </span>
                  </header>
                  {card.url ? (
                    <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                      <img
                        src={card.url}
                        alt={card.name}
                        loading="lazy"
                        className="w-full aspect-[2/3] object-cover"
                      />
                    </div>
                  ) : null}
                  <h3 className="text-xl font-semibold text-white">{card.name}</h3>
                  <p className="text-sm text-slate-200/80">{card.description}</p>
                  <div className="text-xs text-slate-300">{card.suit}</div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-[0.3em]">Keywords</p>
                    <ul className="space-y-1 text-slate-100 text-sm list-disc list-inside">
                      {(card.keywords ?? []).map(keyword => (
                        <li key={keyword}>{keyword}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-slate-400 uppercase tracking-[0.3em]">Guidance</p>
                  <p className="text-sm text-slate-100">
                    {card.reversed
                      ? "Reversed: watch for blocked or inverted energy."
                      : "Upright: go with the flow and stay aware."}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-300">
              <p>Cards are still locked. Tap the crystal ball to draw, then decrypt.</p>
            </div>
          )}
        </section>
      </section>
    </div>
  );
};
