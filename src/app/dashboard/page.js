'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
          headers: {
            Authorization: `${token}`,
          },
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

    fetchAccounts();
  }, [router]);

  return (
    <SidebarLayout>
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid gap-4">
        {accounts.length > 0 ? (
          accounts.map((acc) => (
            <div
              key={acc.id}
              className="border p-4 rounded shadow-sm bg-white flex justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{acc.name}</h2>
                <p className="text-sm text-gray-600 capitalize">{acc.type}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-700">₹{acc.balance}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No accounts found.</p>
        )}
      </div>
    </div>
    </SidebarLayout>
  );
}
