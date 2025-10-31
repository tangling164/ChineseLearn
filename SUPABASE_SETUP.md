# Supabase Email Confirmation Setup Guide

## Current Issue
Users are getting "Email not confirmed" error when trying to log in after clicking the confirmation link.

## Required Supabase Configuration

### 1. Add Redirect URLs
Go to your Supabase Dashboard → Authentication → URL Configuration and add:

**For Local Development:**
```
http://localhost:3000/auth/confirm
```

**For Production (Vercel):**
```
https://yourdomain.com/auth/confirm
https://*.vercel.app/auth/confirm
```

### 2. Email Templates Configuration
Go to Supabase Dashboard → Authentication → Email Templates → Confirm signup

Make sure the template uses the correct confirmation URL. The default template should look like:

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

**Important:** The `{{ .ConfirmationURL }}` variable will automatically include the `emailRedirectTo` parameter we set in the sign-up code.

### 3. Verify Email Settings
Go to Supabase Dashboard → Authentication → Email Settings:

- ✅ Enable email confirmations: **ON**
- ✅ Secure email change: **ON** (recommended)
- ✅ Double confirm email changes: **ON** (optional)

### 4. Check Site URL
Go to Supabase Dashboard → Settings → General:

- Set **Site URL** to your production domain (e.g., `https://yourdomain.com`)

## Testing the Flow

1. **Register a new account** at `/auth/sign-up`
2. **Check your email** for the confirmation link
3. **Click the confirmation link** - it should redirect to `/auth/confirm?token_hash=xxx&type=signup`
4. **Check server logs** (Vercel logs or local terminal) for:
   ```
   Email confirmation request: { hasTokenHash: true, type: 'signup', ... }
   Attempting to verify OTP...
   OTP verification successful: { userId: '...', email: '...', emailConfirmed: '...' }
   ```
5. **Redirected to dashboard** - you should be automatically logged in

## Debugging Steps

### If confirmation link redirects to error page:

1. **Check Vercel/Server logs** for the error message from `/auth/confirm`
2. **Verify the token_hash** parameter is present in the URL
3. **Check if the link expired** (links are valid for 1 hour by default)

### If you get "Email not confirmed" when logging in:

1. **Check Supabase Dashboard** → Authentication → Users
2. Find your user and check if **Email Confirmed At** has a value
3. If it's empty, the confirmation didn't work - try resending

### To resend confirmation email:

1. Go to login page
2. Enter your email and try to log in
3. When you see the "Email not confirmed" error
4. Click **"Resend confirmation email"** button

## Common Issues

### Issue: Link redirects to Supabase hosted UI
**Solution:** Check that `emailRedirectTo` is set correctly in `components/sign-up-form.tsx` (line 62)

### Issue: "Invalid redirect URL"
**Solution:** Add your domain to the Redirect URLs list in Supabase Dashboard

### Issue: "Token has expired"
**Solution:** Confirmation links expire after 1 hour. Request a new one using the "Resend confirmation email" button.

### Issue: Database error when verifying
**Solution:** Check Supabase logs in Dashboard → Logs → Auth for detailed error messages

