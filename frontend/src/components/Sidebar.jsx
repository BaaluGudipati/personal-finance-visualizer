import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 w-64 h-full bg-gray-800 shadow-lg z-50 lg:hidden "
    >
      <div className="flex items-center justify-between p-4 border-b  ">
        <h2 className="text-lg font-bold  text-white ">Finance</h2>
        <button onClick={() => setIsOpen(false)}>
          <FaTimes className="text-gray-600 text-xl  text-white" />
        </button>
      </div>

      <nav className="p-4 space-y-4">
        <button onClick={() => setIsOpen(false)} className="block w-full text-left text-white">
          Add Transaction
        </button>
        <button onClick={() => setIsOpen(false)} className="block w-full text-left  text-white">
          Transactions
        </button>
        <button onClick={() => setIsOpen(false)} className="block w-full text-left  text-white">
          Insights
        </button>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
