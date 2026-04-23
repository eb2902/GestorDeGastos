"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// 1. Define a clear interface for your data structure
interface ExpenseData {
  name: string; // Usually needed for tooltips/legends
  value: number;
  fill: string;
}

// 2. Apply the interface to the props
interface ExpenseChartProps {
  data: ExpenseData[];
}

import { useEffect, useState } from "react";

export default function ExpenseChart({ data }: ExpenseChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return <div className="h-[250px] w-full flex items-center justify-center opacity-20"><p className="text-sm font-bold italic">Cargando gráfico...</p></div>;
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full opacity-20 py-10">
        <p className="text-sm font-bold italic">Sin gastos registrados</p>
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={90}
            paddingAngle={8}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill} 
                stroke="transparent" 
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ 
              backgroundColor: "#0f172a", 
              border: "1px solid #1e293b", 
              borderRadius: "16px",
              fontSize: "12px",
              fontWeight: "bold"
            }}
            itemStyle={{ color: "#fff" }}
            cursor={{ fill: "transparent" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}