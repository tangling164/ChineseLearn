import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const token = searchParams.get("token");
  const type = searchParams.get("type") as EmailOtpType | null;

  console.log("Email confirmation request:", {
    hasTokenHash: !!token_hash,
    hasToken: !!token,
    type,
    url: request.url,
  });

  const supabase = await createClient();

  // 支持 token_hash 或 token 参数
  const actualToken = token_hash || token;
  
  if (actualToken && type) {
    console.log("Attempting to verify OTP...");
    
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash: actualToken,
    });

    if (error) {
      console.error("OTP verification failed:", error);
      redirect(`/auth/error?error=${encodeURIComponent(error.message || "Verification failed")}`);
    }

    if (data?.user) {
      console.log("OTP verification successful:", {
        userId: data.user.id,
        email: data.user.email,
        emailConfirmed: data.user.email_confirmed_at,
      });

      // verifyOtp 成功会自动创建会话，直接跳转到 dashboard
      redirect("/dashboard");
    } else {
      console.error("OTP verified but no user data returned");
      redirect("/auth/login?confirmed=true");
    }
  } else {
    // 如果没有 token 或 type，多数情况是 Supabase 已在其域完成验证并重定向到我们站点
    // 在这种情况下，引导用户到登录页并显示确认成功提示
    console.log("No token/type provided; assuming upstream verification redirect. Sending user to login with success flag.");
    redirect("/auth/login?confirmed=true");
  }
}
