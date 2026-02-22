# Firebase Configuration for Vercel Deployment

## Problem Summary
After deploying to Vercel, the following issues occurred:
1. Google login failing
2. Like counter not updating
3. Culture discussions not updating

## Root Causes & Fixes Applied

### 1. ✅ Real-time Updates (FIXED)
**Problem**: Components were using one-time `getDocs()` queries instead of listening for real-time changes.

**Solution Applied**: Converted to use `onSnapshot()` listeners in:
- `LikeCommentSection.jsx` - Likes now update in real-time when users like/unlike
- `DiscussionPanel.jsx` - Culture discussions now update instantly across all users

**Files Modified**:
- `src/components/LikeCommentSection.jsx`
- `src/components/DiscussionPanel.jsx`

---

### 2. ⚠️ Google Login Domain Whitelist (REQUIRES MANUAL SETUP)

**Problem**: Firebase Authentication restricts sign-in by domain. Your Vercel domain needs to be whitelisted.

**How to Fix**:

1. **Get Your Vercel Domain**:
   - Go to your Vercel project dashboard
   - Find your deployment URL (e.g., `https://your-app-name.vercel.app`)

2. **Add to Firebase**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `bharat-legacy-explorer`
   - Navigate to **Authentication** → **Settings** → **Authorized domains**
   - Click **Add domain**
   - Add your Vercel URL (without https://)
   - Example: `your-app-name.vercel.app`

3. **Also Add These Domains**:
   - `localhost` (for local development)
   - Any custom domain if you have one

---

### 3. ✅ Better Error Handling (FIXED)
Added detailed error messages for Google login to help diagnose issues:
- If you see "Google sign-in is not enabled" → Check Firebase Console authentication settings
- If you see "Popup was blocked" → Allow popups in your browser
- If you see "Sign-in cancelled" → User closed the popup

---

## Deployment Checklist

Before deploying to Vercel, ensure:

- [ ] Your Vercel domain is added to Firebase Authorized Domains
- [ ] Firebase rules allow read/write for authenticated users
- [ ] API Keys in `firebaseConfig.js` are correct (they are public keys, so hardcoding is fine)
- [ ] Browser allows popups (for Google authentication)

---

## Firebase Firestore Rules (Recommended)

For security, update your Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow authenticated users to add likes and comments
    match /likes/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                       request.resource.data.userEmail == request.auth.token.email;
      allow delete: if request.auth != null && 
                       resource.data.userEmail == request.auth.token.email;
    }
    
    match /itemComments/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                       request.resource.data.userEmail == request.auth.token.email;
      allow delete: if request.auth != null && 
                       resource.data.userEmail == request.auth.token.email;
    }
    
    match /culturalComments/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
                       resource.data.userEmail == request.auth.token.email;
    }
  }
}
```

---

## Testing After Deployment

1. **Test Google Login**: Click Google login button - should open popup
2. **Test Like Button**: Like an item, refresh page - count should persist
3. **Test Comments**: Add a comment in Cultural Discussion, open in another tab - should appear instantly
4. **Cross-User Test**: Open app in 2 different browsers, like/comment in one, should update in the other

---

## If Issues Persist

1. **Check Browser Console** (F12 → Console): Look for Firebase error messages
2. **Check Vercel Logs**: Dashboard → Deployments → Select deployment → View logs
3. **Verify Firebase Project**: Make sure you're in the correct project in Firebase Console
4. **Clear Cache**: Ctrl+Shift+Delete or Cmd+Shift+Delete and clear browser cache

---

## Quick Reference: Your Firebase Config
```javascript
Project ID: bharat-legacy-explorer
Auth Domain: bharat-legacy-explorer.firebaseapp.com
API Key: AIzaSyByTlIwaV-tGgy6Kz9D61CUj2mYnr3QZFo
```
