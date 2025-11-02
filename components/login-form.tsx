"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 检查是否有确认成功参数或回调错误
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("confirmed") === "true") {
        setSuccess("Your email has been confirmed. Please log in.");
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
      if (params.get("error") === "auth_callback_error") {
        setError("Google login failed. Please try again.");
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const supabase = createClient();
    
    // 检查环境变量
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
      setError("Configuration error: Missing Supabase URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        
        // 处理邮箱未确认的错误
        if (error.message.includes("Email not confirmed") || error.message.includes("email_not_confirmed")) {
          setError("Please confirm your email before logging in. Check your inbox for the confirmation email.");
          return;
        }
        
        throw error;
      }
      
      if (data?.user) {
        // Update this route to redirect to an authenticated route. The user already has an active session.
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: unknown) {
      console.error("Login exception:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during login";
      
      // 再次检查是否是邮箱未确认错误
      if (errorMessage.includes("Email not confirmed") || errorMessage.includes("email_not_confirmed")) {
        setError("Please confirm your email before logging in. Check your inbox for the confirmation email.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      setIsGoogleLoading(true);
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      if (oauthError) {
        throw oauthError;
      }
      // Supabase 将会重定向到 Google 登录页面
    } catch (oauthErr) {
      console.error("Google OAuth error:", oauthErr);
      const message = oauthErr instanceof Error ? oauthErr.message : "Unable to sign in with Google.";
      setError(message);
      setIsGoogleLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setIsResendingConfirmation(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        throw error;
      }

      setSuccess("Confirmation email has been sent. Please check your inbox.");
    } catch (error: unknown) {
      console.error("Resend confirmation error:", error);
      setError(error instanceof Error ? error.message : "Failed to resend confirmation email");
    } finally {
      setIsResendingConfirmation(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {success && (
                <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3">
                  <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                </div>
              )}
              
              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  {(error.includes("confirm your email") || error.includes("Email not confirmed")) && (
                    <button
                      type="button"
                      onClick={handleResendConfirmation}
                      disabled={isResendingConfirmation || !email}
                      className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResendingConfirmation ? "Sending..." : "Resend confirmation email"}
                    </button>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isGoogleLoading ? "Redirecting to Google..." : "Sign in with Google"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
