interface ComparisonRow {
  label: string;
  values: string[];
}

interface ComparisonTableProps {
  title: string;
  columns: string[];
  rows: ComparisonRow[];
}

export function ComparisonTable({ title, columns, rows }: ComparisonTableProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-orbitron tracking-[0.2em] text-primary">COMPARISON</p>
        <h2 className="text-3xl font-orbitron font-bold text-foreground">{title}</h2>
      </div>
      <div className="glass-card p-6 rounded-2xl border border-glass-border overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-glass-border/70">
              <th className="py-3 text-sm font-orbitron uppercase tracking-[0.12em] text-muted-foreground">Feature</th>
              {columns.map((column) => (
                <th
                  key={column}
                  className="py-3 text-center text-sm font-orbitron uppercase tracking-[0.12em] text-primary"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-inter text-sm">
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-glass-border/50 last:border-0">
                <td className="py-3 text-foreground">{row.label}</td>
                {row.values.map((value, index) => (
                  <td key={`${row.label}-${index}`} className="py-3 text-center text-muted-foreground">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
