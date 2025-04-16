import { FiMenu } from 'react-icons/fi';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import MonthlyChart from './components/MonthlyChart';
import CategoryChart from './components/CategoryChart';
import ToastContainer from './components/ToastContainer';
import Modal from './components/Modal';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // setTransactionToEdit(null); // optional
  };

  return (
    <div className="relative">
      {/* Sidebar only visible on small screens */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="p-4 sm:p-6 lg:p-8 overflow-auto min-h-screen bg-gray-700">
        <div className="max-w-7xl mx-auto">
          {/* Hamburger menu only on small screens */}
          <button
            className="lg:hidden mb-6 p-3 bg-primary text-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu className="text-xl" />
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-dark text-center text-white">
            Personal Finance Dashboard
          </h1>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <TransactionForm
                setTransactions={setTransactions}
                categories={categories}
                setCategories={setCategories}
              />
              <TransactionList
                transactions={transactions}
                setTransactions={setTransactions}
                setTransactionToEdit={setTransactionToEdit}
                openModal={openModal}
              />
            </div>

            <div className="space-y-6">
              <MonthlyChart transactions={transactions} />
              <CategoryChart transactions={transactions} />
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title="Edit Transaction"
      >
        <TransactionForm
          setTransactions={setTransactions}
          categories={categories}
          setCategories={setCategories}
          transactionToEdit={transactionToEdit}
          setTransactionToEdit={setTransactionToEdit}
          closeModal={closeModal}
        />
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default App;
