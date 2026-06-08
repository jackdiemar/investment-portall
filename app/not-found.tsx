import Link from "next/link";

export default function NotFound() {
  return (
    <main className="login-page">
      <section className="login-card">
        <p className="page-kicker">Not found</p>
        <h1>Page unavailable</h1>
        <p className="lead">The page or investment record could not be found.</p>
        <Link className="button" href="/dashboard">
          Return to dashboard
        </Link>
      </section>
    </main>
  );
}
