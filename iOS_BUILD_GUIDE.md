# iOS Build and Testing Guide - ChandaCollection

This guide walks you through building and running the ChandaCollection app on iOS using Xcode.

## Prerequisites

✅ **Already Installed:**
- Xcode (version 14.0+)
- CocoaPods (for dependency management)
- Node.js and npm (for React Native)
- React Native CLI

**Current Status:**
- Backend: Running on `localhost:5001` (or Railway)
- Frontend: React Native project with iOS native files
- Dependencies: Installed with CocoaPods

---

## Step 1: Verify iOS Project Structure

Your iOS project has been initialized with the following structure:

```
frontend/
├── ios/
│   ├── HelloWorld/              # iOS app folder
│   ├── HelloWorld.xcodeproj/    # Xcode project
│   ├── HelloWorldTests/         # Tests folder
│   ├── Podfile                  # CocoaPods configuration
│   └── Pods/                    # Pod dependencies (after install)
├── android/                     # Android project (optional)
├── App.jsx                      # Main app component
├── index.js                     # React Native entry point
├── app.json                     # App configuration
├── package.json                 # NPM dependencies
└── src/
    ├── screens/                 # App screens (Login, Signup, Home)
    ├── services/                # API client and services
    ├── config/                  # Configuration files
    └── navigation/              # Navigation setup
```

---

## Step 2: Install iOS Dependencies (CocoaPods)

### Option A: Using Terminal (Recommended)

```bash
cd frontend/ios
pod install
```

**If you encounter boost checksum errors:**

This is a known issue in React Native 0.72.3. The fix has been applied automatically:

```bash
# The boost checksum has been updated to the correct value
# If you still get errors, run:
cd frontend
./fix_boost.sh  # This updates the checksum automatically
cd ios
pod install
```

### Option B: Using Xcode (Easier)

1. **Open Xcode Project:**
   ```bash
   cd frontend/ios
   open HelloWorld.xcodeproj
   ```

2. **In Xcode:**
   - Go to **File** → **Packages** → **Reset Package Caches**
   - Try building (⌘B) - Xcode will auto-install pods

---

## Step 3: Configure Backend URL

The app is configured to use different backends based on the environment:

**For Local Development (iOS Simulator):**
```
API_BASE_URL = http://localhost:5001/api
```

**For Railway Production:**
```
Edit: frontend/src/config/api.js
Change: railwayProduction.baseURL to your Railway backend URL
```

**How to find your Railway URL:**
1. Go to: https://railway.app
2. Select your project
3. Click on the backend service
4. Look for "Public URL" or "Service URL"
5. It will look like: `https://chandacollectionapp-production.up.railway.app`

---

## Step 4: Start React Native Metro Server

Open a new terminal and run:

```bash
cd frontend
npm start
```

You should see:
```
                                                           
                                                           
                                                           
  ║╔════╗                                                 
  ║║╔══╗║ React Native                                    
  ║╚╝══╚╝ Metro Bundler                                   
  ║                                                       
  ╚════════════════════════════════════════════════════╝
                                                           
Starting Metro Bundler...
LOG  Metro has started
│
│  To reload the app press r
│  To open developer menu press d
│  For more commands type h
```

---

## Step 5: Build and Run on iOS Simulator

### Option A: Using Xcode

1. **Open Xcode (if not already open):**
   ```bash
   cd frontend/ios
   open HelloWorld.xcodeproj
   ```

2. **Select Target Device:**
   - Click on "HelloWorld" in the top-left
   - Select a simulator (e.g., "iPhone 15")

3. **Build & Run:**
   - Press ⌘R (or Product → Run)
   - Wait for build to complete (2-5 minutes first time)

4. **Watch the simulator boot up and app launch!**

### Option B: Using Command Line

```bash
cd frontend
npx react-native run-ios --simulator="iPhone 15"
```

---

## Step 6: Test Login and Signup

Once the app launches on the simulator:

### Create Account
1. **On Login Screen**, tap **"Create Account"**
2. **Enter Details:**
   - Email: `test@example.com`
   - Password: `Test123!`
   - First Name: `Test`
   - Last Name: `User`
3. **Tap "Sign Up"**
4. **Wait for success message** (should see JWT token)

### Login
1. **On Login Screen**, enter:
   - Email: `test@example.com`
   - Password: `Test123!`
2. **Tap "Login"**
3. **If successful**, you'll see user profile data

### Expected Responses

**Signup Success:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  }
}
```

**Login Success:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  }
}
```

---

## Step 7: Troubleshooting

### App Won't Start

**Problem:** Metro server not running
```bash
# Solution: Start Metro in a new terminal
cd frontend
npm start
```

**Problem:** Build fails in Xcode
```bash
# Clean build:
⌘Shift+K (Product → Clean Build Folder)
# Then rebuild: ⌘B
```

**Problem:** "HelloWorld" is not found
```bash
# Pods not installed
cd frontend/ios
pod install
```

### Network Connection Issues

**Problem:** App can't connect to backend

1. **Check Backend is Running:**
   ```bash
   curl http://localhost:5001/api/auth/profile
   ```
   Should show 401 (unauthorized) - that's good!

2. **For iOS Simulator:**
   - iOS simulator uses `localhost`
   - If using Android emulator, use `10.0.2.2` instead

3. **For Railway Backend:**
   - Make sure your Railway URL is in `src/config/api.js`
   - Test with: `curl https://your-railway-url.railway.app/api/auth/profile`

### Pod Installation Fails

**boost checksum error:**
```bash
cd frontend
./fix_boost.sh
cd ios
pod install
```

**Network timeout:**
```bash
pod install --repo-update
# Or increase timeout:
defaults write com.apple.dt.Xcode IDESourceTreeDisplayNames -dict-add com_apple_dt_Xcode_sourceroot_SOURCE_ROOT ~/ChandaCollectionApp/frontend
```

### Simulator Issues

**Simulator not starting:**
```bash
# Restart simulator
xcrun simctl shutdown all
xcrun simctl erase all
# Then: ⌘R from Xcode
```

**Can't see app in simulator:**
```bash
# Kill running simulator
killall "Simulator"
# Or use: xcrun simctl shutdown all
```

---

## Step 8: Access Local Backend from Simulator

### Using Host Machine IP

If you need to connect to your host's backend from the simulator:

1. **Find your Mac's IP:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **Update API config:**
   ```javascript
   // frontend/src/config/api.js
   iosSimulator: {
     baseURL: 'http://192.168.x.x:5001/api', // Your IP here
     timeout: 10000,
   }
   ```

3. **Or use `localhost` (simpler, default setting):**
   - iOS simulator automatically maps `localhost` to host's `localhost`
   - This is already configured in the app

---

## Step 9: Verify All Tests Passing

### Test Signup
```bash
# From simulator or test command:
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"ios@test.com",
    "password":"Test123!",
    "firstName":"iOS",
    "lastName":"Tester"
  }'
```

**Expected:** 201 status with token

### Test Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"ios@test.com",
    "password":"Test123!"
  }'
```

**Expected:** 200 status with token

### Test Protected Endpoint
```bash
curl http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected:** 200 status with user data

---

## Step 10: Configure for Railway Production

When ready to test with Railway backend:

1. **Get Your Railway Backend URL:**
   - Go to: https://railway.app
   - Open your project
   - Click the backend service
   - Copy the "Public URL"

2. **Update Configuration:**
   ```javascript
   // frontend/src/config/api.js
   railwayProduction: {
     baseURL: 'https://your-railway-url.railway.app/api',
     timeout: 15000,
   }
   ```

3. **Update Environment Variable:**
   ```javascript
   // frontend/src/config/api.js
   const ENVIRONMENT = __DEV__ ? 'local' : 'railwayProduction';
   
   // For testing with Railway:
   // const ENVIRONMENT = 'railwayProduction';
   ```

4. **Rebuild:**
   ```bash
   cd frontend
   npm start  # In one terminal
   # In another:
   npx react-native run-ios
   ```

---

## Useful Commands

```bash
# Start Metro server
npm start

# Build for iOS simulator
npx react-native run-ios

# Build for specific simulator
npx react-native run-ios --simulator="iPhone 15"

# Open Xcode project
open ios/HelloWorld.xcodeproj

# Clean build
cd ios && rm -rf Pods Podfile.lock && pod install
cd ..

# Install CocoaPods if missing
brew install cocoapods
# or:
sudo gem install cocoapods

# List available simulators
xcrun simctl list devices

# Launch specific simulator
xcrun simctl boot "iPhone 15"

# Check if backend is running
curl -v http://localhost:5001/api/auth/profile

# View Metro server logs
npm start -- --verbose

# Debug in Xcode
# 1. Set breakpoint (click line number)
# 2. Build and Run (⌘R)
# 3. Step through code (⌘/ F10/F11)
```

---

## Project Structure

```
ChandaCollectionApp/
├── frontend/              # React Native app
│   ├── ios/              # iOS native code
│   ├── android/          # Android native code
│   ├── src/
│   │   ├── screens/      # Login, Signup, Home screens
│   │   ├── services/     # API client
│   │   ├── config/       # API configuration
│   │   ├── navigation/   # React Navigation setup
│   │   └── utils/        # Helper functions
│   ├── App.jsx           # Root component
│   ├── index.js          # Entry point
│   └── package.json      # Dependencies
│
├── backend/              # Express.js server
│   ├── src/
│   │   ├── index.js      # Server entry
│   │   ├── db/           # Database setup
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Auth middleware
│   ├── .env              # Environment variables
│   └── package.json      # Backend dependencies
│
├── docs/                 # Documentation
└── README.md            # Project info
```

---

## Next Steps

1. ✅ **iOS Build Working** → Test all features
2. 📱 **Create Groups** → Implement group management
3. 💰 **Add Campaigns** → Implement payment collection
4. 📊 **Dashboard** → Show balance and spending
5. 📤 **Export** → PDF and Excel reports

---

## Support & Resources

- **React Native Docs:** https://reactnative.dev
- **React Navigation:** https://reactnavigation.org
- **Xcode Help:** https://developer.apple.com/xcode
- **Railway Docs:** https://docs.railway.app
- **CocoaPods:** https://cocoapods.org

---

## Quick Reference: Running the App

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
# Backend runs on http://localhost:5001
```

**Terminal 2 - Start Metro:**
```bash
cd frontend
npm start
```

**Terminal 3 - Build iOS:**
```bash
cd frontend
npx react-native run-ios
# Or use Xcode directly
```

**Expected Result:**
- ✅ Backend responding to API calls
- ✅ Metro server bundling JS
- ✅ iOS simulator showing login screen
- ✅ Signup/Login working end-to-end

---

**Happy Coding! 🚀**

For issues, check the [Troubleshooting](#step-7-troubleshooting) section above.
