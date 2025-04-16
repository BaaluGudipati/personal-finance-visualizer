import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const MonthlyChart = ({ transactions }) => {
  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + Math.abs(t.amount);
    return acc;
  }, {});

  const data = Object.entries(monthlyData).map(([name, amount]) => ({ name, amount }));

  return (
    <motion.div
      id="charts"
      className="bg-white p-6 rounded-lg shadow-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="amount" fill="#2563eb" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default MonthlyChart;