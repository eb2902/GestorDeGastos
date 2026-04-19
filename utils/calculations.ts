export interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

export interface Category {
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  categories?: Category | null;
}

export function calculateDashboardMetrics(transactions: Transaction[] | null) {
  if (!transactions) {
    return { totalIncome: 0, totalExpense: 0, balance: 0, chartData: [] };
  }

  const totalIncome = transactions
    .filter(tx => tx.amount > 0)
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const totalExpense = transactions
    .filter(tx => tx.amount < 0)
    .reduce((acc, tx) => acc + Math.abs(Number(tx.amount)), 0);

  const balance = totalIncome - totalExpense;

  const chartData: ChartDataItem[] = transactions
    .filter(tx => tx.amount < 0)
    .reduce((acc: ChartDataItem[], tx) => {
      const categoryName = tx.categories?.name || 'Otros';
      const amountValue = Math.abs(Number(tx.amount));
      const existing = acc.find((item) => item.name === categoryName);

      if (existing) {
        existing.value += amountValue;
      } else {
        acc.push({
          name: categoryName,
          value: amountValue,
          fill: tx.categories?.color || '#94a3b8'
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  return {
    totalIncome,
    totalExpense,
    balance,
    chartData
  };
}
