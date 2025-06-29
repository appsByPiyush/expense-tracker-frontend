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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md p-5 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Tracker</h2>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-200">Dashboard - </Link>
          <Link href="/accounts" className="block p-2 rounded hover:bg-gray-200">Accounts - </Link>
          <Link href="/accounts/add" className="block p-2 rounded hover:bg-gray-200">Accounts Add - </Link>
          <Link href="/transactions" className="block p-2 rounded hover:bg-gray-200">Transactions - </Link>
          <Link href="/transactions/add" className="block p-2 rounded hover:bg-gray-200">Transactions Add - </Link>
          <Link href="/categories" className="block p-2 rounded hover:bg-gray-200">Categories - </Link>
          <Link href="/categories/add" className="block p-2 rounded hover:bg-gray-200">Categories Add - </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="w-full text-left text-red-600 hover:bg-red-100 p-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
