import { ResetPasswordForm } from "./ResetPasswordForm";
import { IconSparkle } from "@/components/crm/ui/icons";

export const metadata = {
  title: "Reset Password — Quantum CRM",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg px-4 text-text">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50rem 26rem at 50% 0%, rgba(213,176,84,0.1), transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-bg-alt/80 p-8 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.65)] backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
            <IconSparkle width={18} height={18} />
          </span>
          <h1 className="font-display text-2xl text-text">
            Quantum <span className="text-gold">CRM</span>
          </h1>
        </div>
        <p className="mt-3 text-sm text-text-muted">Choose a new password for your account.</p>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
