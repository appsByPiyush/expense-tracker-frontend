'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
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

  const deleteCategory = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
        return;
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `${token}`,
        },
        });

        if (res.ok) {
        await fetchCategories(); // 🔁 Reload updated transaction list
        } else {
        setError('Failed to delete category');
        }
    } catch (err) {
        setError('Server error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [router]);

  const grouped = {
    in: categories.filter((cat) => cat.type === 'credit'),
    ex: categories.filter((cat) => cat.type === 'debit'),
    tr: categories.filter((cat) => cat.type === 'transfer'),
  };

  const typeLabels = {
    in: 'Credit Categories',
    ex: 'Debit Categories',
    tr: 'Transfer Categories',
  };

  return (
    <SidebarLayout>
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold mb-0">Your Categories</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/categories/add')}
        >
          Add New Category
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {['in', 'ex', 'tr'].map((type) => (
        <div key={type} className="mb-4">
          <h2 className="h6 fw-semibold mb-3">{typeLabels[type]}</h2>

          {grouped[type].length > 0 ? (
            <ul className="list-group">
              {grouped[type].map((cat) => (
                <li
                  key={cat.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{cat.name}</span>
                  <small className="text-muted">{new Date(cat.created_at).toLocaleDateString()}</small>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No {typeLabels[type]} categories found.</p>
          )}
        </div>
      ))}
    </div>

    </SidebarLayout>
  );
}
