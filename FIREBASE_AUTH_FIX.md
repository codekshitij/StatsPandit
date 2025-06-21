# Firebase Authentication Deployment Issues Fix

## Problem
You're getting `auth/network-request-failed` errors when trying to use Google Sign-In on your deployed Netlify site.

## Root Causes
1. **Domain Authorization**: Your Netlify domain isn't authorized in Firebase Console
2. **CSP Headers**: Content Security Policy blocking Firebase requests
3. **CORS Issues**: Cross-origin request restrictions

## Step-by-Step Fix

### 1. Add Your Domain to Firebase Auth
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your "stats-pandit" project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add your Netlify domains:
   - `statspandit.netlify.app`
   - `your-custom-domain.com` (if you have one)

### 2. Update OAuth Settings (Google Cloud Console)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Add authorized origins:
   - `https://statspandit.netlify.app`
   - `https://your-custom-domain.com`
6. Add authorized redirect URIs:
   - `https://statspandit.netlify.app/__/auth/handler`
   - `https://your-custom-domain.com/__/auth/handler`

### 3. Redeploy with Updated CSP
The CSP in netlify.toml has been updated to include all necessary Firebase domains.

### 4. Test Authentication
After making these changes:
1. Wait 5-10 minutes for changes to propagate
2. Test Google Sign-In on your deployed site
3. Check browser console for any remaining errors

## Alternative: Use Redirect Instead of Popup
If popup continues to fail, the code already has a fallback to redirect method, which is more reliable on mobile and with strict CSP policies.

## Expected Result
- ✅ Google Sign-In popup should work
- ✅ If popup fails, redirect method will be used automatically
- ✅ No more network-request-failed errors
- ✅ Anonymous sign-in should continue working

## Debugging
If issues persist, check:
1. Browser Network tab for failed requests
2. Firebase Console logs
3. Netlify deploy logs

The most critical step is adding your domain to Firebase Auth authorized domains!
