'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setTransactions(data);
        } else {
          setError(data.error || 'Failed to fetch transactions');
        }
      } catch (err) {
        setError('API connection error');
      }
  };

  const deleteTransaction = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
        return;
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `${token}`,
        },
        });

        if (res.ok) {
        await fetchTransactions(); // 🔁 Reload updated transaction list
        } else {
        setError('Failed to delete transaction');
        }
    } catch (err) {
        setError('Server error');
    }
  };
  useEffect(() => {
    

    fetchTransactions();
  }, [router]);

  return (
    <SidebarLayout>
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Transactions</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 border-b">Date</th>
                <th className="text-left p-2 border-b">Type</th>
                <th className="text-left p-2 border-b">Account</th>
                <th className="text-left p-2 border-b">Amount</th>
                <th className="text-left p-2 border-b">Description</th>
                <th className="text-left p-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{txn.txn_datetime}</td>
                  <td className="p-2 border-b capitalize">{txn.type}</td>
                  <td className="p-2 border-b">{txn.account_id}</td>
                  <td
                    className={`p-2 border-b ${
                      txn.type === 'credit' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    ₹{txn.amount}
                  </td>
                  <td className="p-2 border-b">{txn.description || '-'}</td>
                  <td><button onClick={() => {deleteTransaction(txn.id)}}> DELETE TXN </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
    </SidebarLayout>
  );
}
