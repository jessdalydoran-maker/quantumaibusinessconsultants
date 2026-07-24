import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Log In — Quantum CRM",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectedFrom?: string }>;
}) {
  const { redirectedFrom } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-text">
      <div className="w-full max-w-sm rounded-sm border border-border bg-bg-alt p-8">
        <h1 className="font-display text-2xl text-gold">Quantum CRM</h1>
        <p className="mt-2 text-sm text-text-muted">Log in to continue.</p>
        <LoginForm redirectTo={redirectedFrom && redirectedFrom !== "/app/login" ? redirectedFrom : "/app"} />
      </div>
    </div>
  );
}
