"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// 1. Define the shape of your data
interface ExpenseData {
  name?: string; // Optional, but usually good for Tooltips
  value: number;
  fill: string;
}

// 2. Apply the interface to the props
export default function ExpenseChart({ data }: { data: ExpenseData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center border border-dashed border-slate-800 rounded-[2.5rem] opacity-30">
        <p className="text-sm font-bold">Sin datos de gastos</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}