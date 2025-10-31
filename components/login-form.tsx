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
import { useState, useEffect } from "react";

const GOOGLE_IDENTITY_SCRIPT = "https://accounts.google.com/gsi/client";

type GoogleCredentialResponse = {
  credential: string;
  select_by?: string;
};

type GoogleAccountsId = {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    cancel_on_tap_outside?: boolean;
    auto_select?: boolean;
    context?: "signin" | "signup" | "use";
    prompt_parent_id?: string;
    nonce?: string;
    use_fedcm_for_prompt?: boolean;
  }) => void;
  prompt: (momentListener?: (promptMomentNotification: unknown) => void) => void;
  cancel: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsId;
      };
    };
  }
}

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
  const [googleInfo, setGoogleInfo] = useState<string | null>(null);
  const [isGoogleRedirectLoading, setIsGoogleRedirectLoading] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const router = useRouter();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // 检查是否有确认成功的参数（使用 window.location 而非 useSearchParams 以避免 SSR 问题）
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("confirmed") === "true") {
        setSuccess("Your email has been confirmed. Please log in.");
        // 清理 URL 参数
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    let script: HTMLScriptElement | null = null;
    let isMounted = true;

    const initializeGoogleOneTap = () => {
      const googleAccounts = window.google?.accounts?.id;

      if (!googleAccounts || !isMounted) {
        return;
      }

      googleAccounts.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          if (!isMounted || !credential) {
            return;
          }

          setIsGoogleLoading(true);
          setError(null);
          setSuccess(null);

          try {
            const supabase = createClient();
            const { error: signInError } =
              await supabase.auth.signInWithIdToken({
                provider: "google",
                token: credential,
              });

            if (signInError) {
              throw signInError;
            }

            router.push("/dashboard");
            router.refresh();
          } catch (googleError) {
            console.error("Google sign-in error:", googleError);
            const message =
              googleError instanceof Error
                ? googleError.message
                : "Unable to sign in with Google. Please try again.";
            setError(message);
            window.google?.accounts?.id?.cancel();
          } finally {
            if (isMounted) {
              setIsGoogleLoading(false);
            }
          }
        },
        cancel_on_tap_outside: false,
        context: "signin",
        use_fedcm_for_prompt: true,
      });

      if (!isMounted) {
        return;
      }

      setIsGoogleReady(true);
      googleAccounts.prompt((notification: any) => {
        try {
          const notDisplayed = notification?.isNotDisplayed?.();
          if (notDisplayed) {
            const reason = notification?.getNotDisplayedReason?.();
            console.warn("One Tap not displayed:", reason);
            setGoogleInfo("无法显示 Google 一键登录，已提供按钮登录。");
          }

          const dismissed = notification?.isDismissed?.();
          if (dismissed) {
            const reason = notification?.getDismissedReason?.();
            console.warn("One Tap dismissed:", reason);
            // 用户主动关闭，不提示错误，只保留按钮降级
          }

          const displayed = notification?.isDisplayed?.();
          if (displayed) {
            setGoogleInfo(null);
          }
        } catch (e) {
          console.error("One Tap prompt listener error:", e);
        }
      });
    };

    if (window.google?.accounts?.id) {
      initializeGoogleOneTap();
    } else {
      script = document.createElement("script");
      script.src = GOOGLE_IDENTITY_SCRIPT;
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleOneTap;
      script.onerror = () => {
        if (!isMounted) {
          return;
        }

        console.error("Failed to load Google Identity Services script");
        setError(
          "Failed to load Google login. Please refresh the page or try again later.",
        );
      };

      document.head.appendChild(script);
    }

    return () => {
      isMounted = false;
      window.google?.accounts?.id?.cancel();
      if (script) {
        script.remove();
      }
    };
  }, [googleClientId, router]);

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

  const handleGoogleRedirectLogin = async () => {
    if (isGoogleRedirectLoading) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      setIsGoogleRedirectLoading(true);
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined,
          // 提示同意，获取刷新令牌（可选）
          queryParams: { prompt: "consent", access_type: "offline" },
        },
      });
      if (oauthError) {
        throw oauthError;
      }
      // Supabase 将会重定向，无需后续处理
    } catch (oauthErr) {
      console.error("Google OAuth redirect error:", oauthErr);
      const message = oauthErr instanceof Error ? oauthErr.message : "Unable to sign in with Google.";
      setError(message);
    } finally {
      setIsGoogleRedirectLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (isGoogleLoading) {
      return;
    }

    setError(null);
    setSuccess(null);
    window.google?.accounts?.id?.prompt();
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
              {googleInfo && (
                <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-3">
                  <p className="text-sm text-amber-800 dark:text-amber-200">{googleInfo}</p>
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
              <>
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
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={googleClientId && isGoogleReady ? handleGoogleLogin : handleGoogleRedirectLogin}
                    disabled={(googleClientId && isGoogleReady ? isGoogleLoading : isGoogleRedirectLoading)}
                  >
                    {(googleClientId && isGoogleReady)
                      ? (isGoogleLoading ? "Connecting..." : "Google One Tap")
                      : (isGoogleRedirectLoading ? "Redirecting..." : "Google")}
                  </Button>
                </div>
              </>
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
