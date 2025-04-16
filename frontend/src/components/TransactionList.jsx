import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaEdit } from 'react-icons/fa';

const TransactionList = ({ transactions, setTransactions, setTransactionToEdit, openModal }) => {
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions')
      .then((res) => setTransactions(res.data))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load transactions');
      });
  }, [setTransactions]);

  const deleteTransaction = async (id) => {
    setIsDeleting(id);
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      toast.success('Transaction deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete transaction');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (transaction) => {
    setTransactionToEdit(transaction);
    openModal();
  };

  return (
    <motion.div
      id="list"
      className="bg-white p-6 rounded-lg shadow-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Transactions</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {transactions.map((transaction) => (
              <motion.div
                key={transaction._id}
                className="p-4 bg-neutral rounded-md shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()} | {transaction.category}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className={transaction.amount < 0 ? 'text-danger' : 'text-success'}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="p-2 text-primary hover:bg-blue-100 rounded-md transition-colors"
                    aria-label={`Edit transaction ${transaction.description}`}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this transaction?')) {
                        deleteTransaction(transaction._id);
                      }
                    }}
                    disabled={isDeleting === transaction._id}
                    className="p-2 text-danger hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
                    aria-label={`Delete transaction ${transaction.description}`}
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionList;