'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // default items per page
  const router = useRouter();
  const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions?page=${page}&limit=${limit}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setTransactions(data.transactions || []);
          setTotalPages(Math.ceil(data.total / limit));
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
  }, [router, page, limit]);

  return (
    <SidebarLayout>
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold mb-0">Your Transactions</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/transactions/add')}
        >
          Add New Transaction
        </button>
      </div>
      </div>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {transactions.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Type</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="text-capitalize">{txn.type}</td>
                  <td>{txn.account_name}</td>
                  <td className={txn.type === 'credit' ? 'text-success' : 'text-danger'}>
                    ₹{txn.amount}
                  </td>
                  <td>{txn.description || '-'}</td>
                  <td>{txn.txn_datetime}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteTransaction(txn.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3">
          {/* Limit selector */}
          <div>
            <label className="me-2">Items per page:</label>
            <select
              className="form-select d-inline-block w-auto"
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          {/* Page selector */}
          <nav>
            <ul className="pagination mb-0">
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${page === i + 1 ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        </div>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>

    </SidebarLayout>
  );
}
