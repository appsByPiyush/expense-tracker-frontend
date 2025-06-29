'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';
export default function RecordTransactionPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    type: 'debit',
    account_id: '',
    category_id: '',
    amount: '',
    txn_date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    txn_time: new Date().toTimeString().slice(0, 5), // HH:mm
    description: '',
    to_account_id: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [accountsRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
            headers: { Authorization: `${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
            headers: { Authorization: `${token}` },
          }),
        ]);

        const accData = await accountsRes.json();
        const catData = await categoriesRes.json();

        if (accountsRes.ok && categoriesRes.ok) {
          setAccounts(accData);
          setCategories(catData);
        } else {
          setError('Failed to fetch data');
        }
      } catch {
        setError('Server error');
      }
    };

    fetchData();
  }, [router, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const txn_datetime = `${form.txn_date} ${form.txn_time}:00`;
    const payload = {
        ...form,
        txn_datetime: txn_datetime, // overwrite txn_date with full datetime
    };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Transaction recorded successfully!');
        setForm({ ...form, amount: '', description: '' });
      } else {
        setError(data.error || 'Failed to add transaction');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <SidebarLayout>
    <div className="container py-4" style={{ maxWidth: '720px' }}>
      <div className="row justify-content-center">
        <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold mb-0">Add Your Transactions</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/transactions')}
        >
          List All Transaction
        </button>
      </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm border">

        {/* Transaction Type */}
        <div className="mb-3">
          <label className="form-label">Transaction Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="form-select"
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        {/* From Account */}
        <div className="mb-3">
          <label className="form-label">
            From Account {form.type === 'transfer' ? '(Transfer From)' : ''}
          </label>
          <select
            name="account_id"
            value={form.account_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select account</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.type}) - ₹{a.balance}
              </option>
            ))}
          </select>
        </div>

        {/* To Account (if transfer) */}
        {form.type === 'transfer' && (
          <div className="mb-3">
            <label className="form-label">To Account (Transfer To)</label>
            <select
              name="to_account_id"
              value={form.to_account_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select account</option>
              {accounts
                .filter((a) => a.id.toString() !== form.account_id)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.type}) - ₹{a.balance}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category (optional)</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">None</option>
            {categories
              .filter((cat) => cat.type.startsWith(form.type.charAt(0)))
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        {/* Amount */}
        <div className="mb-3">
          <label className="form-label">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Date & Time */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Transaction Date</label>
            <input
              type="date"
              name="txn_date"
              value={form.txn_date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Transaction Time</label>
            <input
              type="time"
              name="txn_time"
              value={form.txn_time}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="form-label">Description (optional)</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-100">
          Save Transaction
        </button>
      </form>
    </div>

    </SidebarLayout>
  );
}
