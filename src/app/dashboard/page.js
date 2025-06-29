'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';

export default function Dashboard() {
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
  useEffect(() => {
    fetchAccounts();
  }, [router]);

  return (
    <SidebarLayout>
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid gap-4">
        <h2 className="h4 fw-bold mt-4"> Your Accounts</h2>
        {accounts.length > 0 ? (
        <div className="row g-4">
          {accounts.map((account) => (
            <div className="col-12 col-sm-6" key={account.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title mb-1">{account.name}</h5>
                    <p className="card-subtitle text-muted text-capitalize">{account.type}</p>
                  </div>
                  <div className="text-end">
                    <p className="fw-bold text-success mb-1">₹{account.balance}</p>
                    <button
                      onClick={() => deleteAccount(account.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted mt-3">No accounts found.</p>
      )}
      </div>
      {/* <div className="grid gap-4">
        <h2 className="h4 fw-bold mt-4"> Your Categories</h2>
        {accounts.length > 0 ? (
        <div className="row g-4">
          {accounts.map((account) => (
            <div className="col-12 col-sm-6" key={account.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title mb-1">{account.name}</h5>
                    <p className="card-subtitle text-muted text-capitalize">{account.type}</p>
                  </div>
                  <div className="text-end">
                    <p className="fw-bold text-success mb-1">₹{account.balance}</p>
                    <button
                      onClick={() => deleteAccount(account.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted mt-3">No accounts found.</p>
      )}
      </div> */}
      
    </div>
    </SidebarLayout>
  );
}
