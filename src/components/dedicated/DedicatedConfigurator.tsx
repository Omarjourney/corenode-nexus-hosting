"use client";

import { useServersList } from "@/lib/hooks/useReliableSiteInventory";

function formatPrice(recurring: number | null, hourly: boolean = false) {
  if (recurring == null) return null;
  return hourly ? `$${recurring.toFixed(2)}/hr` : `$${recurring.toFixed(2)}/mo`;
}

export default function DedicatedConfigurator() {
  const { data, loading, error } = useServersList();

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-white/70">
        Loading live dedicated inventory…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-100">
        {error}
      </div>
    );
  }

  const inStock = (data ?? []).filter((server) => (server.stock ?? 0) > 0);

  if (!inStock.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-white/70">
        No dedicated servers currently available.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {inStock.map((server) => {
        const priceMonthly = formatPrice(server.recurring.month_1);
        const priceHourly = formatPrice(server.recurring.hourly, true);
        const priceLabel = priceMonthly ?? priceHourly ?? "Contact for pricing";

        return (
          <div
            key={server.productId ?? `${server.dataCenter}-${server.description}-${server.detail}`}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/60 p-4 shadow-lg transition hover:-translate-y-0.5 hover:border-white/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  {server.dataCenter || "Data Center"}
                </div>
                <div className="text-lg font-semibold text-white">
                  {server.description || "Dedicated Server"}
                </div>
                {server.detail ? (
                  <div className="text-sm text-white/70">{server.detail}</div>
                ) : null}
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-white/50">From</div>
                <div className="text-2xl font-bold text-emerald-300">{priceLabel}</div>
                <div className="text-xs text-white/60">Stock: {server.stock ?? 0}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

