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
        setTimeout(() => setSuccess(''), 5000);
        setForm({ name: '', type: '', balance: '' });
        // optionally: router.push('/accounts');
      } else {
        setError(data.error || 'Failed to create account');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err) {
      setError('Server error');
      setTimeout(() => setError(''), 10000);
    }
  };

  return (
    <SidebarLayout>
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold mb-0">Create New Account</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/accounts')}
        >
          List All Accounts
        </button>
      </div>
        <div className="col-md-8">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">

            {/* Account Name */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Account Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="e.g. HDFC, Cash, Wallet"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Account Type */}
            <div className="mb-3">
              <label htmlFor="type" className="form-label">Account Type</label>
              <select
                className="form-select"
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="">Select type</option>
                <option value="bank">Bank</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit Card</option>
              </select>
            </div>

            {/* Balance */}
            <div className="mb-4">
              <label htmlFor="balance" className="form-label">Opening Balance (₹)</label>
              <input
                type="number"
                className="form-control"
                id="balance"
                name="balance"
                placeholder="e.g. 1000"
                value={form.balance}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Create Account
            </button>
          </form>

        </div>
      </div>
    </div>

    </SidebarLayout>
  );
}
