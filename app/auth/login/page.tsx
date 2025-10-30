import dynamic from "next/dynamic";

const LoginForm = dynamic(async () => {
  const loginModule = await import("@/components/login-form");
  return { default: loginModule.LoginForm };
}, { ssr: false });

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
