import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { FaChartPie } from 'react-icons/fa';

// Rich, vibrant but professional color palette
const COLORS = [
  '#2563eb', // Primary blue
  '#6366f1', // Indigo
  '#10b981', // Emerald green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#84cc16'  // Lime
];

const CategoryChart = ({ transactions }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [totalSpending, setTotalSpending] = useState(0);

  // Calculate the category data and total spending
  const categoryData = transactions.reduce((acc, t) => {
    const amount = Math.abs(t.amount);
    acc.categories[t.category] = (acc.categories[t.category] || 0) + amount;
    acc.total += amount;
    return acc;
  }, { categories: {}, total: 0 });

  useEffect(() => {
    setTotalSpending(categoryData.total);
  }, [categoryData.total]);

  // Convert to array format for Recharts and sort by value (highest first)
  const data = Object.entries(categoryData.categories)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Calculate percentages for display
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: ((item.value / totalSpending) * 100).toFixed(1)
  }));

  const handlePieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (percent < 0.05) return null; // Don't show labels for tiny slices

    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-primary font-medium">${data.value.toFixed(2)}</p>
          <p className="text-gray-600 text-sm">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaChartPie className="text-primary mr-3 text-xl" />
          <h2 className="text-xl font-semibold text-gray-800">Spending by Category</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Spending</p>
          <p className="text-lg font-bold text-primary">${totalSpending.toFixed(2)}</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No transaction data available</p>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-7 gap-4">
            <div className="lg:col-span-4">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={dataWithPercentage}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    label={renderCustomizedLabel}
                    labelLine={false}
                    onMouseEnter={handlePieEnter}
                  >
                    {dataWithPercentage.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke={activeIndex === index ? "#fff" : "none"}
                        strokeWidth={activeIndex === index ? 2 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-3">
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Top Categories</h3>
                <div className="space-y-3 max-h-48 overflow-auto pr-2">
                  {dataWithPercentage.slice(0, 5).map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-gray-700">{entry.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        <span className="font-medium">${entry.value.toFixed(2)}</span>
                        <span className="text-gray-900 text-sm">({entry.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {dataWithPercentage.length > 5 && (
            <div className="mt-4 text-right">
              <p className="text-sm text-gray-500">
                {dataWithPercentage.length - 5} more categories not shown
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default CategoryChart;