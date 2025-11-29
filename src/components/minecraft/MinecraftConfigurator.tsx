"use client";

import { useEffect, useMemo, useState } from "react";
import config from "@/data/minecraft-config.json";
import { formatPrice } from "@/utils/pricing";
import type { TierId } from "@/types/hosting";

const editionKeys = Object.keys(config.editions) as (keyof typeof config.editions)[];
const tierKeys = Object.keys(config.tiers) as TierId[];

function calculateTierPrice(base: number, tier: TierId, editionKey: keyof typeof config.editions, ram: number) {
  const officialPrice = config.editions[editionKey]?.officialPrices?.[tier]?.[String(ram)];
  if (typeof officialPrice === "number") return officialPrice;

  const multiplier = config.tiers[tier].multiplier;
  return parseFloat((base * multiplier).toFixed(2));
}

export function MinecraftConfigurator() {
  const [edition, setEdition] = useState<(typeof editionKeys)[number]>("java");
  const [tier, setTier] = useState<TierId>("core");
  const [stepIndex, setStepIndex] = useState<number>(1);
  const [cpu, setCpu] = useState<number>(2);
  const [storage, setStorage] = useState<number>(40);
  const [slots, setSlots] = useState<number>(20);

  const steps = config.editions[edition].sliderSteps;
  const step = steps[stepIndex] ?? steps[0];

  useEffect(() => {
    const editionSteps = config.editions[edition].sliderSteps;
    const recommendedIndex = Math.max(
      0,
      editionSteps.findIndex((s) => s.ram === config.editions[edition].recommended)
    );
    setStepIndex(recommendedIndex === -1 ? 0 : recommendedIndex);
  }, [edition]);

  useEffect(() => {
    setCpu(step.cpu);
    setStorage(step.storage);
    setSlots(step.slots);
  }, [step]);

  const cpuUpgradeCost = useMemo(
    () => Math.max(0, cpu - step.cpu) * config.billing.cpuUpgradePerCore,
    [cpu, step]
  );

  const storageUpgradeCost = useMemo(() => {
    const extra = Math.max(0, storage - step.storage);
    if (extra === 0) return 0;

    const packs = [...config.billing.storageUpgradePacks].sort((a, b) => b.size - a.size);
    let remaining = extra;
    let cost = 0;

    for (const pack of packs) {
      if (remaining >= pack.size) {
        const count = Math.floor(remaining / pack.size);
        cost += count * pack.price;
        remaining -= count * pack.size;
      }
    }

    if (remaining > 0) {
      const smallest = packs[packs.length - 1];
      cost += smallest.price;
    }

    return parseFloat(cost.toFixed(2));
  }, [storage, step]);

  const slotUpgradeCost = useMemo(() => {
    if (slots <= step.slots) return 0;
    const packs = Math.ceil((slots - step.slots) / config.billing.slotPackSize);
    return packs * config.billing.slotPackPrice;
  }, [slots, step]);

  const tierBasePrice = calculateTierPrice(step.price, tier, edition, step.ram);
  const totalPrice = useMemo(() => {
    if (!Number.isFinite(tierBasePrice)) return null;
    const sum = tierBasePrice + cpuUpgradeCost + storageUpgradeCost + slotUpgradeCost;
    if (sum <= 0) return null;
    return parseFloat(sum.toFixed(2));
  }, [tierBasePrice, cpuUpgradeCost, storageUpgradeCost, slotUpgradeCost]);

  const ramMarkers = steps.map((s) => `${s.ram}GB`);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
      <div className="rounded-2xl bg-slate-900/60 p-6 shadow-lg border border-slate-700/60 space-y-6">
        <div className="flex flex-wrap gap-2">
          {editionKeys.map((key) => (
            <button
              key={key}
              onClick={() => setEdition(key)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
                edition === key
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-100"
                  : "border-slate-700 bg-slate-800/60 text-slate-200"
              }`}
            >
              {config.editions[key].name}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2 configurator-slider">
          <div className="slider-label-row text-sm">
            <span className="font-semibold slider-value">RAM: {step.ram}GB</span>
            <span className="text-xs text-slate-400">Base price: {formatPrice(step.price)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            step={1}
            value={stepIndex}
            onChange={(e) => setStepIndex(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-1 grid grid-cols-4 gap-1 text-[11px] text-slate-400">
            {ramMarkers.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2 configurator-slider">
            <div className="slider-label-row text-sm">
              <span className="font-semibold slider-value">CPU Cores: {cpu}</span>
              <span className="text-xs text-slate-400">Upgrade: {formatPrice(cpuUpgradeCost)}</span>
            </div>
            <input
              type="range"
              min={step.cpu}
              max={step.cpu + 6}
              step={1}
              value={cpu}
              onChange={(e) => setCpu(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-slate-500">Base cores included. Costs apply only above {step.cpu} vCPU.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2 configurator-slider">
            <div className="slider-label-row text-sm">
              <span className="font-semibold slider-value">Storage: {storage}GB NVMe</span>
              <span className="text-xs text-slate-400">Upgrade: {formatPrice(storageUpgradeCost)}</span>
            </div>
            <input
              type="range"
              min={step.storage}
              max={step.storage + 300}
              step={50}
              value={storage}
              onChange={(e) => setStorage(Number(e.target.value) || step.storage)}
              className="w-full"
            />
            <p className="text-xs text-slate-500">
              Storage upgrades bill in {config.billing.storageUpgradePacks.map((pack) => `${pack.size}GB`).join(", ")} packs
              above included {step.storage}GB.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2 configurator-slider">
          <div className="slider-label-row text-sm">
            <span className="font-semibold slider-value">Player Slots: {slots}</span>
            <span className="text-xs text-slate-400">Premium packs: {formatPrice(slotUpgradeCost)}</span>
          </div>
          <input
            type="range"
            min={step.slots}
            max={step.slots + 200}
            step={4}
            value={slots}
            onChange={(e) => setSlots(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-slate-500">Slots are bundled in {config.billing.slotPackSize}-slot packs when you exceed included {step.slots}.</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-2xl bg-slate-900/70 p-5 border border-slate-700/60 space-y-4">
          <div className="flex flex-wrap gap-2">
            {tierKeys.map((key) => (
              <button
                key={key}
                onClick={() => setTier(key)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold border ${
                  tier === key
                    ? "border-violet-400 bg-violet-500/20 text-violet-100"
                    : "border-slate-700 bg-slate-800/60 text-slate-200"
                }`}
              >
                {config.tiers[key].name}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-1 text-sm text-slate-200">
            <div className="flex justify-between"><span>Base ({step.ram}GB {config.tiers[tier].name})</span><span>{formatPrice(tierBasePrice)}</span></div>
            <div className="flex justify-between text-slate-400"><span>CPU upgrades</span><span>{formatPrice(cpuUpgradeCost)}</span></div>
            <div className="flex justify-between text-slate-400"><span>Storage upgrades</span><span>{formatPrice(storageUpgradeCost)}</span></div>
            <div className="flex justify-between text-slate-400"><span>Premium slots</span><span>{formatPrice(slotUpgradeCost)}</span></div>
            <div className="flex justify-between font-semibold text-cyan-300 pt-2 border-t border-slate-800">
              <span>Estimated Monthly</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200 space-y-1">
            <div className="flex justify-between"><span>Edition</span><span>{config.editions[edition].name}</span></div>
            <div className="flex justify-between"><span>Panel</span><span>{config.tiers[tier].panel}</span></div>
            <div className="flex justify-between"><span>Plan ID</span><span className="font-mono text-xs">{config.editions[edition].planIds[tier]}</span></div>
          </div>

          <button
            className="w-full rounded-xl bg-violet-400 py-3 text-sm font-semibold text-slate-900 hover:bg-violet-300 disabled:bg-slate-600 disabled:text-slate-200"
            disabled={!totalPrice}
            aria-disabled={!totalPrice}
          >
            Launch {config.editions[edition].name} ({config.tiers[tier].name})
          </button>
        </div>

        <div className="rounded-2xl bg-slate-900/40 p-4 border border-slate-800 text-sm text-slate-300 space-y-2">
          <div className="font-semibold text-slate-100">What this covers</div>
          <ul className="list-disc list-inside space-y-1">
            <li>RAM slider drives base pricing by tier</li>
            <li>CPU upgrades only bill above the included cores</li>
            <li>Storage billed in 50GB and 100GB NVMe packs from $2.99/mo</li>
            <li>Slots stay free until premium packs are added</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
