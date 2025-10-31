"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          cancel?: () => void;
          disableAutoSelect?: () => void;
        };
      };
    };
  }
}

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    try {
      // 抑制 One Tap 在登出后立刻再次弹出，并清除自动选择
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "suppress_onetap_until",
          String(Date.now() + 60_000),
        );
        // 关闭可能存在的 One Tap 弹窗
        // 关闭自动选择，避免按钮或弹窗携带上次用户信息
        window.google?.accounts?.id?.cancel?.();
        window.google?.accounts?.id?.disableAutoSelect?.();
      }
    } catch {
      // ignore
    }
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
