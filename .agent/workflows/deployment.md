---
description: How to deploy the portfolio frontend to Vercel or Netlify
---

# Portfolio Deployment Workflow (Frontend)

This guide explains how to deploy the frontend independently of the backend.

## Prerequisites
- A Vercel or Netlify account.
- GitHub repository connected to your account.

## Workflow Steps

### 1. Version Tagging
Before every major release, ensure the version in `package.json` is updated.
- `v1.0.x`: Patch fixes
- `v1.1.x`: New frontend features / Polish
- `v2.0.x`: Breaking changes or Backend integration

### 2. Mock Mode Configuration (Optional)
If you want to force mock mode even if the backend is reachable, set the following environment variable in your deployment platform:
- `VITE_FORCE_MOCK=true`

### 3. Deployment Command
The deployment platform should run:
```bash
npm run build
```
The output directory is `dist/`.

### 4. Environment Variables
Ensure the following variables are set in Vercel/Netlify:
- `VITE_API_URL`: URL of your backend (if deployed). If left empty, the frontend will automatically switch to **Mock Data Mode** after a failed connection attempt.

## Fallback Behavior
- **Success**: Frontend connects to Backend -> Real-time updates enabled.
- **Connection Failure**: Frontend waits 5 seconds -> Loads `MOCK_DATA` -> Displays "Offline Mode" badge.

## Verification
After deployment, visit the site. If it loads with "AI Vision Analytics" and other mock projects, the fallback is working correctly.
