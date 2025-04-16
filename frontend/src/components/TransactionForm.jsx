import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';


const TransactionForm = ({
  setTransactions,
  initialCategories = [],
  setCategories,
  transactionToEdit = null,
  setTransactionToEdit,
  closeModal // For modal closing
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();

  const [newCategory, setNewCategory] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categories, setLocalCategories] = useState(initialCategories);

  // Memoized fetch function to prevent infinite re-renders
  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setLocalCategories(res.data);
      if (typeof setCategories === 'function') {
        setCategories(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  }, [setCategories]);

  // Fetch categories on component mount
  useEffect(() => {
    if (initialCategories.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, initialCategories.length]);

  // Pre-fill form values if editing an existing transaction
  useEffect(() => {
    if (transactionToEdit) {
      try {
        setValue('amount', transactionToEdit.amount);
        setValue('date', new Date(transactionToEdit.date).toISOString().split('T')[0]);
        setValue('description', transactionToEdit.description);
        setValue('category', transactionToEdit.category);
      } catch (error) {
        console.error('Error setting form values:', error);
        toast.error('Error loading transaction data');
      }
    } else {
      reset();
    }
  }, [transactionToEdit, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      // Validate date
      if (isNaN(new Date(data.date).getTime())) {
        throw new Error('Invalid date');
      }

      const transaction = { 
        ...data, 
        date: new Date(data.date),
        amount: Number(data.amount)
      };

      if (transactionToEdit) {
        // Update existing transaction
        const res = await axios.put(
          `http://localhost:5000/api/transactions/${transactionToEdit._id}`,
          transaction
        );
        setTransactions((prev) =>
          prev.map((tx) => (tx._id === transactionToEdit._id ? res.data : tx))
        );
        toast.success('Transaction updated');
        if (setTransactionToEdit) setTransactionToEdit(null); // Reset edit state after submitting
        if (closeModal) closeModal(); // Close modal after submitting
      } else {
        // Create a new transaction
        const res = await axios.post('http://localhost:5000/api/transactions', transaction);
        setTransactions((prev) => [res.data, ...prev]);
        toast.success('Transaction added');
      }
      
      reset(); // Reset the form after submitting
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Category cannot be empty');
      return;
    }
    if (categories.includes(newCategory)) {
      toast.error('Category already exists');
      return;
    }
    
    try {
      const res = await axios.post('http://localhost:5000/api/categories', { 
        category: newCategory.trim() 
      });
      setLocalCategories([...categories, newCategory.trim()]);
      if (typeof setCategories === 'function') {
        setCategories([...categories, newCategory.trim()]);
      }
      setNewCategory('');
      toast.success('Category added');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add category');
    }
  };

  const cancelEdit = () => {
    reset();
    if (setTransactionToEdit) setTransactionToEdit(null);
    if (closeModal) closeModal(); // Close the modal when canceling
  };

  // Don't show the form header and cancel button in the modal (only for standalone form)
  const isInModal = !!transactionToEdit;

  return (
    <motion.div
      id="form"
      className={`${isInModal ? '' : 'bg-white p-6 rounded-lg shadow-card'}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {!isInModal && (
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Add Transaction
          </h2>
        </div>
      )}

      {isLoadingCategories ? (
        <div className="text-center text-gray-500">Loading categories...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be positive' },
                valueAsNumber: true
              })}
              className="mt-1 w-full p-3 border rounded-md"
            />
            {errors.amount && <p className="text-danger text-sm">{errors.amount.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="date"
              type="date"
              {...register('date', { 
                required: 'Date is required',
                validate: (value) => {
                  const date = new Date(value);
                  return !isNaN(date.getTime()) || 'Invalid date';
                }
              })}
              className="mt-1 w-full p-3 border rounded-md"
            />
            {errors.date && <p className="text-danger text-sm">{errors.date.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              id="description"
              type="text"
              {...register('description', { 
                required: 'Description is required',
                maxLength: {
                  value: 100,
                  message: 'Description cannot exceed 100 characters'
                }
              })}
              className="mt-1 w-full p-3 border rounded-md"
            />
            {errors.description && <p className="text-danger text-sm">{errors.description.message}</p>}
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              {...register('category', { required: 'Category is required' })}
              className="mt-1 w-full p-3 border rounded-md"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-danger text-sm">{errors.category.message}</p>}
          </div>

          {/* Add new category (only if not editing) */}
          {!transactionToEdit && (
            <div>
              <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700">
                New Category
              </label>
              <div className="flex space-x-2">
                <input
                  id="newCategory"
                  type="text"
                  placeholder="Enter new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1 w-full p-3 border rounded-md"
                  maxLength={50}
                />
                <button
                  type="button"
                  onClick={addCategory}
                  className="mt-1 p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  disabled={!newCategory.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-2">
            {isInModal && (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-1/2 p-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isInModal ? 'w-1/2' : 'w-full'} p-3 bg-primary text-white rounded-md bg-blue-700 disabled:bg-gray-400`}
            >
              {transactionToEdit ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default TransactionForm;