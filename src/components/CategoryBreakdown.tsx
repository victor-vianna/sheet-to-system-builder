import { formatCurrency } from '@/lib/format';
import { CategoryStore, getIconForPath } from '@/lib/categories';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CategoryBreakdownProps {
  categoryData: { category: string; total: number; percentage: number }[];
  categories: CategoryStore;
}

const COLORS = [
  'hsl(160, 84%, 39%)', 'hsl(200, 80%, 50%)', 'hsl(38, 92%, 50%)',
  'hsl(280, 65%, 55%)', 'hsl(0, 72%, 51%)', 'hsl(330, 70%, 50%)',
  'hsl(180, 60%, 45%)', 'hsl(45, 85%, 55%)', 'hsl(220, 70%, 55%)',
  'hsl(120, 50%, 45%)',
];

export function CategoryBreakdown({ categoryData, categories }: CategoryBreakdownProps) {
  const chartData = categoryData.map(d => ({ name: d.category, value: d.total }));

  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: '320ms' }}>
      <h3 className="text-lg font-semibold font-display mb-4">📂 Gastos por Categoria</h3>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 h-[200px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'hsl(222, 47%, 9%)', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {categoryData.map((item, i) => {
            const icon = getIconForPath(categories.expense, [item.category]);
            return (
              <div key={item.category} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-sm flex-shrink-0">{icon}</span>
                <span className="text-sm flex-1 truncate">{item.category}</span>
                <span className="text-sm font-medium text-muted-foreground">{item.percentage.toFixed(1)}%</span>
                <span className="text-sm font-semibold w-28 text-right">{formatCurrency(item.total)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
