import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Email Verification Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {params?.error ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {params.error}
                  </p>
                  
                  <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-3 text-sm">
                    <p className="font-semibold mb-2">Possible solutions:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>The confirmation link may have expired (valid for 1 hour)</li>
                      <li>The link may have already been used</li>
                      <li>Try requesting a new confirmation email</li>
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  An unspecified error occurred during email verification.
                </p>
              )}
              
              <div className="flex flex-col gap-2 pt-4">
                <Link href="/auth/login">
                  <Button className="w-full">
                    Back to Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button variant="outline" className="w-full">
                    Create New Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
