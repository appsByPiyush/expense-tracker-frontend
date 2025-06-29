import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="display-4 fw-bold mb-4">Welcome to Expense Tracker</h1>
      <button className="btn btn-primary mb-4">
        <Link href="/login" className="text-white text-decoration-none">Go to Login</Link>
      </button>
    </div>
  );
}
