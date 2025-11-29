import { plans } from "@/data/plans";

const metalPlans = plans.nodexMetal;

export function NodeXMetalGrid() {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metalPlans.map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col rounded-2xl bg-slate-900/80 p-5 border border-slate-700/70 hover:border-cyan-400 transition"
          >
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-cyan-300">{plan.name}</h3>
            <div className="mb-3 text-3xl font-semibold text-slate-100">${plan.price}/mo</div>
            <ul className="mb-4 text-sm text-slate-200 space-y-1">
              <li>CNX CommandCenter™ included</li>
              <li>10Gbps uplink</li>
              <li>Full root access</li>
              <li>Free migration service</li>
            </ul>
            <button
              className="mt-auto rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#00AFFF] to-[#8B5CF6] hover:brightness-110 hover:scale-[1.03] transition transform"
            >
              Deploy Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
