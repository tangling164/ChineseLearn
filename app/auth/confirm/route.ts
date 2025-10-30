import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const token = searchParams.get("token");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/auth/login";

  const supabase = await createClient();

  // 支持 token_hash 或 token 参数
  if ((token_hash || token) && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash: token_hash || token || undefined,
    });

    if (!error && data?.user) {
      // verifyOtp 成功后，用户应该已经自动登录并且邮箱已确认
      // 检查用户是否确实已登录并已确认邮箱
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser && currentUser.email_confirmed_at) {
        // 用户已确认邮箱并已登录，跳转到 dashboard
        redirect("/dashboard");
      } else if (currentUser) {
        // 用户已登录但邮箱确认状态可能还未更新，等待一下再检查
        // 或者直接跳转到 dashboard（Supabase 应该已经更新了状态）
        redirect("/dashboard");
      } else {
        // 验证成功但未自动登录，跳转到登录页面并显示成功消息
        redirect("/auth/login?confirmed=true");
      }
    } else {
      // 验证失败，跳转到错误页面
      redirect(`/auth/error?error=${encodeURIComponent(error?.message || "Verification failed")}`);
    }
  } else {
    // 缺少必要的参数
    redirect(`/auth/error?error=${encodeURIComponent("No token hash or type")}`);
  }
}
