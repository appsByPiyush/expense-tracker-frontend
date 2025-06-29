'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';

export default function NewAccountPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    type: '',
    balance: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Account created successfully!');
        setForm({ name: '', type: '', balance: '' });
        // optionally: router.push('/accounts');
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <SidebarLayout>
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Account</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">

        <div>
          <label className="block mb-1 font-medium">Account Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="e.g. HDFC, Cash, Wallet"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Account Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select type</option>
            <option value="bank">Bank</option>
            <option value="cash">Cash</option>
            <option value="credit">Credit Card</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Opening Balance (₹)</label>
          <input
            type="number"
            name="balance"
            value={form.balance}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="e.g. 1000"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Account
        </button>
      </form>
    </div>
    </SidebarLayout>
  );
}
