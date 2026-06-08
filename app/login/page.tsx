import { redirect } from "next/navigation";
import { createSessionFromPassword } from "@/lib/auth";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

async function loginAction(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const authenticated = await createSessionFromPassword(password);

  if (!authenticated) redirect("/login?error=invalid");
  redirect("/dashboard");
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {};

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <p className="page-kicker">Private access</p>
        <h1 id="login-title">Diemar Equities</h1>
        <p className="lead">Enter your portal password to view investment materials.</p>

        <form action={loginAction}>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          {params.error ? <p className="error-text">Incorrect password.</p> : null}
          <button className="button" type="submit">
            Access portal
          </button>
        </form>
      </section>
    </main>
  );
}
