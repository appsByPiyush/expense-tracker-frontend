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
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold mb-0">Add New Category</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/categories')}
        >
          List All Categories
        </button>
      </div>

      {error && <div className="alert alert-danger mb-3">{error}</div>}
      {success && <div className="alert alert-success mb-3">{success}</div>}

      <form onSubmit={handleSubmit} className="card card-body shadow-sm mb-4">
        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Enter category name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Select type</option>
            <option value="credit">Income</option>
            <option value="debit">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Category
        </button>
      </form>
    </div>
    </SidebarLayout>
  );
}
