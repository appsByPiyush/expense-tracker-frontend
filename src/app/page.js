import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to Expense Tracker</h1>
      <Link href="/login" className="text-blue-600 underline">Go to Login</Link>
    </div>
  );
}
