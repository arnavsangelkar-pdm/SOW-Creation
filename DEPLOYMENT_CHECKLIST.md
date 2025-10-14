# Deployment Checklist for Render

Use this checklist to ensure your app is ready for deployment.

## ✅ Pre-Deployment Checklist

### 1. Code & Dependencies
- [x] All dependencies listed in `package.json`
- [x] Build script configured: `npm run build`
- [x] Start script configured: `npm start`
- [x] Next.js configuration in `next.config.js`
- [x] TypeScript properly configured

### 2. Configuration Files
- [x] `render.yaml` - Render blueprint for Infrastructure as Code
- [x] `.gitignore` - Prevents committing sensitive files
- [x] `.env.example` - Documents environment variables (for local reference)

### 3. Environment Variables Setup
Decide which variables you need:

| Variable | Required? | Default | Purpose |
|----------|-----------|---------|---------|
| `NODE_ENV` | Auto-set | `production` | Node environment |
| `OPENAI_API_KEY` | Optional | None | Enables real AI generation (otherwise uses mock) |
| `NEXT_PUBLIC_BRAND_NAME` | Optional | "Apex Consulting" | Your brand name |
| `NEXT_PUBLIC_BRAND_COLOR` | Optional | "#6366f1" | Your primary color |

### 4. Git Repository
- [ ] Initialize git: `git init`
- [ ] Add all files: `git add .`
- [ ] Commit: `git commit -m "Initial commit"`
- [ ] Create GitHub repository
- [ ] Push to GitHub: `git push -u origin main`

### 5. Local Testing
Before deploying, test locally:

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Test production build locally
npm start

# Open http://localhost:3000 and verify:
# - Landing page loads
# - Can navigate to /intake
# - Can generate an SOW
# - Can export documents
```

## 🚀 Deployment Steps

### Option A: Blueprint Deploy (Recommended)

1. **Login to Render**: https://dashboard.render.com/
2. **New Blueprint**:
   - Click "New" → "Blueprint"
   - Connect your GitHub account
   - Select your repository
   - Render will detect `render.yaml` automatically
3. **Review Configuration**: 
   - Verify service name, region, and plan
   - Add `OPENAI_API_KEY` if desired (in Environment section)
4. **Deploy**: Click "Apply"
5. **Wait**: Build typically takes 3-5 minutes
6. **Access**: Use the URL provided by Render

### Option B: Manual Deploy

1. **New Web Service**: Click "New" → "Web Service"
2. **Connect Repository**: Link your GitHub repo
3. **Configure**:
   - Name: `sow-proposal-generator`
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. **Add Environment Variables** (optional)
5. **Create Web Service**

## ✨ Post-Deployment Verification

After deployment completes, test these features:

### Core Functionality
- [ ] App loads at your Render URL
- [ ] Navigate to `/intake` - form loads
- [ ] Click "Load Sample A" - form populates
- [ ] Click "Generate SOW & Proposal" - redirects to workspace
- [ ] Workspace shows generated content
- [ ] Can edit sections
- [ ] Can add comments
- [ ] Can change status (Draft → In Review → Approved)

### Export Features
- [ ] Export as PDF works
- [ ] Export as DOCX works
- [ ] Export as Markdown works

### Navigation
- [ ] Left sidebar outline tree works
- [ ] Tab navigation works (SOW, Proposal, Timeline, Pricing, Versions)
- [ ] Timeline visualization displays
- [ ] Pricing table displays

### Edge Cases
- [ ] Refresh page - state persists (localStorage)
- [ ] Multiple sections can be edited
- [ ] Comments can be resolved/reopened
- [ ] Version snapshots can be created

## 🔧 Troubleshooting

### Build Failures

**Issue**: Build fails with dependency errors
- **Fix**: Run `npm install` locally, ensure package-lock.json is committed

**Issue**: TypeScript errors during build
- **Fix**: Run `npm run build` locally, fix all TypeScript errors

### Runtime Issues

**Issue**: App crashes on startup
- **Fix**: Check Render logs for errors, verify `npm start` works locally

**Issue**: 404 errors for routes
- **Fix**: Ensure Next.js is in production mode, check next.config.js

**Issue**: Styles not loading
- **Fix**: Verify Tailwind is properly configured, check build output includes CSS

### OpenAI Issues

**Issue**: Generation fails even with API key
- **Fix**: Verify key format (`sk-...`), check OpenAI account status
- **Note**: App falls back to mock generation on failure

**Issue**: Slow generation times
- **Fix**: This is normal for OpenAI API (can take 10-30 seconds)
- **Alternative**: Use mock mode for demos (instant)

## 📊 Monitoring

After deployment:

1. **Check Logs**: 
   - Go to your service in Render dashboard
   - Click "Logs" tab
   - Monitor for errors or warnings

2. **Performance**:
   - Monitor response times
   - Check memory usage
   - Upgrade plan if needed

3. **Costs**:
   - Free tier: Limited hours per month
   - Starter ($7/mo): Always-on service
   - OpenAI: Separate billing based on usage

## 🎯 Next Steps

After successful deployment:

1. **Custom Domain** (Optional):
   - Add custom domain in Render settings
   - Configure DNS records

2. **Environment Variables**:
   - Review and update as needed
   - Keep `OPENAI_API_KEY` secure

3. **Auto-Deploy**:
   - Push to main branch triggers auto-deploy
   - Configure branch in Render settings if different

4. **Share**:
   - Share your Render URL with team/clients
   - Consider adding authentication for production use

## 📚 Additional Resources

- [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) - Detailed deployment guide
- [README.md](./README.md) - Full project documentation
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Technical overview
- [Render Docs](https://render.com/docs) - Official Render documentation

---

**You're ready to deploy!** 🎉

All configuration files are in place. Follow the deployment steps above to get your app live.

