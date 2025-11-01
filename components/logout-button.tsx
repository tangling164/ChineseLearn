"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    try {
      // 抑制 One Tap 在登出后立刻再次弹出，并清除自动选择
      if (typeof window !== "undefined") {
        // 设置会话标记，禁止 One Tap 自动弹出
        window.sessionStorage.setItem("skipOneTap", "1");
        // 关闭可能存在的 One Tap 弹窗
        window.google?.accounts?.id?.cancel?.();
        // 禁用自动选择，避免按钮或弹窗携带上次用户信息
        window.google?.accounts?.id?.disableAutoSelect?.();
      }
    } catch {
      // ignore
    }
    await supabase.auth.signOut();
    router.push("/?logout=true");
  };

  return <Button onClick={logout}>Logout</Button>;
}
