'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SidebarLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100 flex-nowrap">
        {/* Sidebar (Left) */}
        <aside className="col-12 col-md-3 col-lg-2 bg-white border-end shadow-sm p-4">
          <h2 className="h5 fw-bold text-dark mb-4">Expense Tracker</h2>
          <nav className="nav flex-column gap-2">
            <a href="/dashboard" className="nav-link text-dark">Dashboard</a>
            <a href="/accounts" className="nav-link text-dark">Accounts</a>
            <a href="/transactions" className="nav-link text-dark">Transactions</a>
            <a href="/categories" className="nav-link text-dark">Categories</a>
          </nav>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger mt-4 w-100 text-start"
          >
            Logout
          </button>
        </aside>

        {/* Content (Right) */}
        <main className="col px-4 py-4 bg-light">
          {children}
        </main>

      </div>
    </div>
  );
}
