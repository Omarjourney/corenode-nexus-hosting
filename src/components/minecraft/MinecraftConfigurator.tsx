"use client";

import { useState } from "react";
import { formatPrice, getPlanPrice } from "@/utils/pricing";

const RAM_STOPS = [2, 4, 6, 8, 10, 12, 16, 24];

export function MinecraftConfigurator() {
  const [ram, setRam] = useState<number>(4);
  const [cpu, setCpu] = useState<number>(3);
  const [storage, setStorage] = useState<number>(40);
  const [slots, setSlots] = useState<number>(10);

  const corePrice = getPlanPrice("core", ram);
  const elitePrice = getPlanPrice("elite", ram);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
      {/* Left: configurator */}
      <div className="rounded-2xl bg-slate-900/60 p-6 shadow-lg border border-slate-700/60">
        <h2 className="mb-4 text-xl font-semibold text-cyan-300">Configure Your Java Server</h2>

        {/* RAM slider */}
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-sm">
            <span>RAM: {ram}GB</span>
            <span className="text-xs text-slate-400">Pricing is based on RAM tier.</span>
          </div>
          <input
            type="range"
            min={0}
            max={RAM_STOPS.length - 1}
            step={1}
            value={RAM_STOPS.indexOf(ram)}
            onChange={(e) => setRam(RAM_STOPS[Number(e.target.value)])}
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            {RAM_STOPS.map((v) => (
              <span key={v}>{v}GB</span>
            ))}
          </div>
        </div>

        {/* CPU, Storage, Slots – informational only */}
        <div className="mb-4 grid gap-4 md:grid-cols-3">
          <div>
            <div className="mb-1 text-sm">CPU Cores: {cpu}</div>
            <input
              type="range"
              min={2}
              max={12}
              value={cpu}
              onChange={(e) => setCpu(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <div className="mb-1 text-sm">Storage: {storage}GB NVMe</div>
            <input
              type="range"
              min={20}
              max={200}
              step={10}
              value={storage}
              onChange={(e) => setStorage(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <div className="mb-1 text-sm">Player Slots: {slots}</div>
            <input
              type="range"
              min={4}
              max={100}
              step={4}
              value={slots}
              onChange={(e) => setSlots(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <p className="text-xs text-slate-400">
          CPU, storage, and slots are recommendations only. Final billing is determined by RAM tier and selected panel.
        </p>
      </div>

      {/* Right: pricing cards */}
      <div className="grid gap-4 md:grid-cols-1">
        <div className="rounded-2xl bg-slate-900/70 p-5 border border-slate-700/60">
          <div className="mb-1 text-xs uppercase tracking-wide text-slate-400">CORE</div>
          <div className="mb-2 text-3xl font-semibold text-cyan-300">{formatPrice(corePrice)}</div>
          <ul className="mb-4 text-sm text-slate-200 space-y-1">
            <li>CorePanel Lite™ control panel</li>
            <li>NVMe storage &amp; DDoS shield</li>
            <li>Daily backups (optional add-on)</li>
            <li>Multi-game profiles available</li>
          </ul>
          <button className="w-full rounded-xl bg-cyan-500 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-400">
            Launch CORE Server
          </button>
        </div>

        <div className="rounded-2xl bg-violet-900/60 p-5 border border-violet-500/70 relative">
          <span className="absolute right-4 top-3 rounded-full bg-violet-500 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-900">
            Most Popular
          </span>
          <div className="mb-1 text-xs uppercase tracking-wide text-slate-200">ELITE – CNX CommandCenter™</div>
          <div className="mb-2 text-3xl font-semibold text-violet-100">{formatPrice(elitePrice)}</div>
          <ul className="mb-4 text-sm text-slate-100 space-y-1">
            <li>CNX CommandCenter™ automation</li>
            <li>AI HealthGuard &amp; CrashGuard</li>
            <li>Priority support SLA</li>
            <li>Multi-game profiles &amp; blueprints</li>
          </ul>
          <button className="w-full rounded-xl bg-violet-400 py-2 text-sm font-semibold text-slate-900 hover:bg-violet-300">
            Launch ELITE Server
          </button>
        </div>
      </div>
    </div>
  );
}
