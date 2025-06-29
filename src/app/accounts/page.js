'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchAccounts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
          headers: { Authorization: `${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setAccounts(data);
        } else {
          setError(data.error || 'Failed to fetch accounts');
        }
      } catch (err) {
        setError('API connection error');
      }
  };
  const deleteAccount = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
        return;
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `${token}`,
        },
        });

        if (res.ok) {
          await fetchAccounts(); // 🔁 Reload updated transaction list
        } else {
          setError('Failed to delete category');
        }
    } catch (err) {
      setError('Server error');
    }
  };
  useEffect(() => {
    fetchAccounts();
  }, [router]);

  return (
    <SidebarLayout>
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Accounts</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="p-4 border rounded-lg shadow bg-white flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{account.name}</h2>
                <p className="text-sm text-gray-600 capitalize">{account.type}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-700">₹{account.balance}</p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => deleteAccount(account.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No accounts found.</p>
      )}
    </div>
    </SidebarLayout>
  );
}
