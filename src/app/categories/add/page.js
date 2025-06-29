'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    type: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    //fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        headers: { Authorization: `${token}` },
      });
      const data = await res.json();
      if (res.ok) setCategories(data);
      else setError('Failed to fetch categories');
    } catch {
      setError('Server error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Category added successfully');
        setForm({ name: '', type: '' });
        //fetchCategories();
      } else {
        setError(data.error || 'Failed to add category');
      }
    } catch {
      setError('Error submitting category');
    }
  };

  const filteredCategories = categories.filter((cat) =>
    filter ? cat.type === filter : true
  );

  return (
    <SidebarLayout>
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow mb-6">
        <div>
          <label className="block font-medium mb-1">Category Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select type</option>
            <option value="credit">Income</option>
            <option value="debit">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Category
        </button>
      </form>

      <div className="mb-4">
        <label className="block font-medium mb-1">Filter by Type</label>
        <select
          className="w-full border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="in">Income</option>
          <option value="ex">Expense</option>
          <option value="tr">Transfer</option>
        </select>
      </div>

      {/* <div className="bg-white shadow rounded">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="p-3">{cat.name}</td>
                <td className="p-3 capitalize">
                  {cat.type === 'in' ? 'Income' : cat.type === 'ex' ? 'Expense' : 'Transfer'}
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {new Date(cat.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td className="p-3" colSpan={3}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}
    </div>
    </SidebarLayout>
  );
}
