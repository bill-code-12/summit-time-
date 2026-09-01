# Netlify Build Settings Configuration Guide

## 🎯 Complete Step-by-Step Guide for Summit Time

---

## 📋 Build Settings Configuration

### **1️⃣ Branch to Deploy**
```
Field: Branch to deploy
Value: main
✓ This deploys from your main branch
✓ Changes to main automatically trigger deploy
```

---

### **2️⃣ Base Directory**
```
Field: Base directory
Value: frontend
Why: Your React app is in the frontend/ folder
✓ Netlify will cd into frontend/ before building
✓ Dependencies installed there
✓ Build command runs from there
```

---

### **3️⃣ Build Command**
```
Field: Build command
Value: npm install && npm run build

What it does:
  1. npm install → Installs all dependencies
  2. npm run build → Creates optimized production build
  3. Output goes to frontend/dist/

Timing: ~2-3 minutes per deploy
```

---

### **4️⃣ Publish Directory**
```
Field: Publish directory
Value: frontend/dist

Why: This is where Vite outputs the built files
  ✓ dist/ contains all optimized frontend code
  ✓ Netlify serves these files to users
  ✓ HTML, JS, CSS, assets are here
```

---

### **5️⃣ Functions Directory** (Optional)
```
Field: Functions directory
Value: netlify/functions

Status: NOT NEEDED for Summit Time
✗ We're using Render for backend
✗ This would be for serverless functions only
✓ Leave as default or empty
```

---

## 🔑 Environment Variables Configuration

### **CRITICAL: Add These Environment Variables**

Go to: **Site settings → Build & deploy → Environment**

Click: **Add environment variables**

---

### **Variable 1: Firebase API Key**
```
Key:   VITE_FIREBASE_API_KEY
Value: AIzaSyCU7taFwuScsDZQm4Q02P5PH0eymOVqrFM
```

---

### **Variable 2: Firebase Auth Domain**
```
Key:   VITE_FIREBASE_AUTH_DOMAIN
Value: summit-time-com.firebaseapp.com
```

---

### **Variable 3: Firebase Project ID**
```
Key:   VITE_FIREBASE_PROJECT_ID
Value: summit-time-com
```

---

### **Variable 4: Firebase Storage Bucket**
```
Key:   VITE_FIREBASE_STORAGE_BUCKET
Value: summit-time-com.firebasestorage.app
```

---

### **Variable 5: Firebase Messaging Sender ID**
```
Key:   VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 1023065261577
```

---

### **Variable 6: Firebase App ID**
```
Key:   VITE_FIREBASE_APP_ID
Value: 1:1023065261577:web:e3261a73b3f757dcbadad8
```

---

### **Variable 7: Firebase Measurement ID**
```
Key:   VITE_FIREBASE_MEASUREMENT_ID
Value: G-B4EEM1PCMM
```

---

### **Variable 8: API URL (MOST IMPORTANT)**
```
Key:   VITE_API_URL
Value: https://summit-time-backend.onrender.com/api

⚠️ REPLACE WITH YOUR ACTUAL RENDER BACKEND URL

How to get it:
  1. Deploy backend to Render first
  2. Render gives you a URL like:
     https://summit-time-backend-xxx.onrender.com
  3. Add /api at the end
  4. Paste it here
```

---

### **Variable 9: WebSocket URL**
```
Key:   VITE_WS_URL
Value: wss://summit-time-backend.onrender.com

⚠️ REPLACE WITH YOUR ACTUAL RENDER BACKEND URL

How to get it:
  1. Take your Render URL: https://summit-time-backend-xxx.onrender.com
  2. Replace https:// with wss://
  3. Remove /api (no path for WebSocket)
  4. Result: wss://summit-time-backend-xxx.onrender.com
```

---

### **Variable 10: App Name**
```
Key:   VITE_APP_NAME
Value: Summit Time
```

---

## ✅ Complete Configuration Summary

### **Build Settings Tab**
```
┌─────────────────────────────────────────┐
│ Branch to deploy:        main            │
│ Base directory:          frontend        │
│ Build command:           npm install &&  │
│                          npm run build   │
│ Publish directory:       frontend/dist   │
│ Functions directory:     netlify/        │
│                          functions       │
└─────────────────────────────────────────┘
```

### **Environment Variables Tab**
```
┌─────────────────────────────────────────┐
│ VITE_FIREBASE_API_KEY                   │
│ VITE_FIREBASE_AUTH_DOMAIN               │
│ VITE_FIREBASE_PROJECT_ID                │
│ VITE_FIREBASE_STORAGE_BUCKET            │
│ VITE_FIREBASE_MESSAGING_SENDER_ID       │
│ VITE_FIREBASE_APP_ID                    │
│ VITE_FIREBASE_MEASUREMENT_ID            │
│ VITE_API_URL                            │
│ VITE_WS_URL                             │
│ VITE_APP_NAME                           │
└─────────────────────────────────────────┘
```

---

## 🚀 Step-by-Step Screenshots Guide

### **Step 1: Go to Site Settings**
```
Netlify Dashboard
  → Select your site
    → Site settings
      → Build & deploy
        → Build settings
```

### **Step 2: Edit Build Settings**
```
Click "Edit settings" button

Fill in:
  Base directory: frontend
  Build command: npm install && npm run build
  Publish directory: frontend/dist

Click "Save"
```

### **Step 3: Add Environment Variables**
```
Go to: Build & deploy → Environment
Click: "Add environment variables"

For each variable above:
  1. Click "Edit"
  2. Paste Key
  3. Paste Value
  4. Click "Save"
  5. Repeat for all 10 variables
```

### **Step 4: Deploy**
```
Go to: Deploys
Click: "Trigger deploy"
Wait: 2-3 minutes
Success: Green checkmark ✓
```

---

## 🔗 Important URLs to Know

```
Your Netlify Domain:
  https://summit-time-xxx.netlify.app
  (or your custom domain)

Your Render Backend:
  https://summit-time-backend-xxx.onrender.com
  (deploy this first, then use the URL above)

API calls go to:
  https://summit-time-backend-xxx.onrender.com/api

WebSocket connects to:
  wss://summit-time-backend-xxx.onrender.com
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ WRONG: Base directory is empty
```
✗ Wrong: This will look in root for package.json
✓ Correct: Set to "frontend"
```

### ❌ WRONG: Build command is just "npm run build"
```
✗ Wrong: Forgets to install dependencies
✓ Correct: "npm install && npm run build"
```

### ❌ WRONG: Publish directory is "frontend"
```
✗ Wrong: Publishes source code, not built files
✓ Correct: "frontend/dist"
```

### ❌ WRONG: VITE_API_URL missing or wrong
```
✗ Wrong: Frontend won't reach backend
✓ Correct: https://summit-time-backend-xxx.onrender.com/api
```

### ❌ WRONG: Deploy before backend is ready
```
✗ Wrong: Frontend crashes looking for backend
✓ Correct: Deploy backend to Render first
           Then deploy frontend to Netlify
           Then connect them
```

---

## 🧪 Testing Your Configuration

### **After deployment, check:**

#### Test 1: Frontend loads
```
1. Open https://your-netlify-domain.netlify.app
2. Should see Summit Time landing page
3. Should NOT see errors in console
```

#### Test 2: Firebase works
```
1. Click "Sign up"
2. Create account
3. Should redirect to dashboard
4. Check Firebase Console to see new user
```

#### Test 3: Backend connects
```
1. Dashboard should load meetings list
2. Check browser DevTools → Network
3. Should see API calls to Render backend
4. Responses should be 200 OK
```

#### Test 4: WebSocket connects
```
1. Create a new meeting
2. Join meeting room
3. DevTools → Network → WS filter
4. Should see WebSocket connection established
```

#### Test 5: Video works
```
1. In meeting room
2. Allow camera/mic permissions
3. Should see local video
4. Check for errors in console
```

---

## 🆘 Troubleshooting

### **Problem: Build fails with "module not found"**
```
Solution:
  1. Check Base directory is "frontend"
  2. Check Build command is "npm install && npm run build"
  3. Netlify logs will show which module failed
  4. Rebuild dependencies locally, push to GitHub
```

### **Problem: Deploy succeeds but page is blank**
```
Solution:
  1. Check Publish directory is "frontend/dist"
  2. Open DevTools → Console
  3. Look for JavaScript errors
  4. Check environment variables are set
  5. Trigger rebuild from Netlify
```

### **Problem: Frontend loads but can't reach backend**
```
Solution:
  1. Check VITE_API_URL environment variable
  2. Test with curl:
     curl https://summit-time-backend.onrender.com/health
  3. Check Render backend is deployed and running
  4. Check ALLOWED_ORIGINS on Render backend
  5. Check browser DevTools → Network → API calls
```

### **Problem: Login works but can't create meetings**
```
Solution:
  1. Check backend is running on Render
  2. Check database connection on Render
  3. Check Render logs for errors
  4. Check backend environment variables
  5. Test backend directly:
     curl -H "Authorization: Bearer TOKEN" \
       https://summit-time-backend.onrender.com/api/meetings
```

---

## 📊 Build Process Flow

```
You push to GitHub
  ↓
Netlify detects push to main branch
  ↓
Netlify clones repository
  ↓
Netlify cd's into: frontend/
  ↓
Netlify runs: npm install
  ↓
Netlify loads: Environment variables (10 VITE_ vars)
  ↓
Netlify runs: npm run build
  ↓
Vite compiles React + TypeScript → frontend/dist/
  ↓
Netlify deploys files from frontend/dist/ to CDN
  ↓
Your site goes live! 🚀
  ↓
Users access it at: https://your-domain.netlify.app
  ↓
Frontend makes API calls to Render backend
```

---

## ✅ Final Checklist

Before clicking "Deploy":

- [ ] Branch to deploy: `main`
- [ ] Base directory: `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `frontend/dist`
- [ ] VITE_FIREBASE_API_KEY: ✓ Set
- [ ] VITE_FIREBASE_AUTH_DOMAIN: ✓ Set
- [ ] VITE_FIREBASE_PROJECT_ID: ✓ Set
- [ ] VITE_FIREBASE_STORAGE_BUCKET: ✓ Set
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID: ✓ Set
- [ ] VITE_FIREBASE_APP_ID: ✓ Set
- [ ] VITE_FIREBASE_MEASUREMENT_ID: ✓ Set
- [ ] VITE_API_URL: ✓ Set (with your Render URL)
- [ ] VITE_WS_URL: ✓ Set (with your Render URL)
- [ ] VITE_APP_NAME: ✓ Set
- [ ] Render backend deployed first: ✓ Yes
- [ ] Backend URL is correct: ✓ Tested

---

## 🎯 Next Steps

1. **Fill in Build Settings** (5 min)
   - Base: frontend
   - Build: npm install && npm run build
   - Publish: frontend/dist

2. **Add 10 Environment Variables** (5 min)
   - Copy-paste all VITE_ variables
   - Use your Render backend URL

3. **Deploy** (2-3 min)
   - Netlify automatically builds and deploys
   - Watch the build log
   - Check for green checkmark ✓

4. **Test** (5 min)
   - Visit your Netlify URL
   - Test signup
   - Create meeting
   - Test video

---

## 🎊 You're Almost There!

Once these are configured, your frontend will:
- ✅ Deploy automatically on GitHub push
- ✅ Connect to your Render backend
- ✅ Run on Netlify CDN (fast worldwide)
- ✅ Have free HTTPS/SSL
- ✅ Support custom domain
- ✅ Cost $0/month forever

---

**Questions?** Check the troubleshooting section or create a GitHub issue.

**Happy deploying!** 🚀✨
