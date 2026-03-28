import LoginForm from "@/components/local/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-zinc-50 to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      <LoginForm />
    </div>
  );
}
