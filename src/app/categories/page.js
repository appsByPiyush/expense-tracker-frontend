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
    in: 'Income',
    ex: 'Expense',
    tr: 'Transfer',
  };

  return (
    <SidebarLayout>
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Categories</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {['in', 'ex', 'tr'].map((type) => (
        <div key={type} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{typeLabels[type]}</h2>
          {grouped[type].length > 0 ? (
            <ul className="border rounded divide-y">
              {grouped[type].map((cat) => (
                <li key={cat.id} className="p-3 flex justify-between items-center bg-white hover:bg-gray-50">
                  <span>{cat.name}</span>
                  <span className="text-xs text-gray-500">{new Date(cat.created_at).toLocaleDateString()}</span>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No {typeLabels[type]} categories found.</p>
          )}
        </div>
      ))}
    </div>
    </SidebarLayout>
  );
}
