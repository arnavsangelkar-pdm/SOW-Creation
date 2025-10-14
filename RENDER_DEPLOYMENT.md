# Render Deployment Guide

This guide will help you deploy the SOW & Proposal Generator to Render.com.

## Quick Deploy (Recommended)

The easiest way to deploy is using the Render Blueprint:

1. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file
   - Click "Apply" to deploy

3. **Configure Environment Variables** (Optional):
   - In the Render dashboard, go to your web service
   - Navigate to "Environment" tab
   - Add `OPENAI_API_KEY` if you want real AI generation (otherwise mock generation will be used)
   - Customize `NEXT_PUBLIC_BRAND_NAME` and `NEXT_PUBLIC_BRAND_COLOR` if desired

## Manual Deploy

If you prefer manual setup:

1. **Create New Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your Git repository

2. **Configure Settings**:
   - **Name**: `sow-proposal-generator` (or your preferred name)
   - **Runtime**: Node
   - **Region**: Choose your preferred region (e.g., Oregon)
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Starter (or higher)

3. **Environment Variables** (Optional):
   Add these in the "Environment" section:
   
   | Key | Value | Description |
   |-----|-------|-------------|
   | `NODE_ENV` | `production` | Sets Node environment |
   | `OPENAI_API_KEY` | `sk-...` | (Optional) OpenAI API key for real AI generation |
   | `NEXT_PUBLIC_BRAND_NAME` | `"Apex Consulting"` | (Optional) Your brand name |
   | `NEXT_PUBLIC_BRAND_COLOR` | `"#6366f1"` | (Optional) Your primary color |

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for build and deployment to complete (typically 3-5 minutes)
   - Access your app at the provided URL (e.g., `https://sow-proposal-generator.onrender.com`)

## Features & Configuration

### Mock Mode (Default)
- **No API key required** - works out of the box
- Uses deterministic mock generation based on input
- Instant generation, perfect for demos
- No costs involved

### OpenAI Mode (Optional)
To enable real AI generation:
1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to Render environment variables: `OPENAI_API_KEY=sk-...`
3. Redeploy or trigger a manual deploy
4. The app will automatically use OpenAI GPT-4 for generation

### Custom Branding
Customize the look and feel:
- `NEXT_PUBLIC_BRAND_NAME`: Company name displayed throughout the app
- `NEXT_PUBLIC_BRAND_COLOR`: Primary color (hex format)

## Health Checks

Render will automatically monitor your app's health at the root path (`/`). The app should respond with status 200 when healthy.

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure Node version compatibility (18+ recommended)
- Review build logs in Render dashboard

### App Doesn't Start
- Verify `npm start` works locally
- Check environment variables are set correctly
- Review application logs in Render dashboard

### OpenAI Generation Not Working
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI account has credits/active subscription
- App will fallback to mock generation if OpenAI fails

### Styles Not Loading
- Clear browser cache
- Check that the build completed successfully
- Verify `npm run build` works locally

## Post-Deployment

After successful deployment:

1. **Test the App**:
   - Visit your Render URL
   - Navigate to `/intake` 
   - Load a sample and generate an SOW
   - Test export functionality

2. **Custom Domain** (Optional):
   - In Render dashboard, go to "Settings"
   - Add your custom domain
   - Configure DNS records as instructed

3. **Set Up Auto-Deploy**:
   - By default, Render auto-deploys on git push to main branch
   - Configure in "Settings" → "Build & Deploy" if needed

4. **Monitor Performance**:
   - Check logs in Render dashboard
   - Monitor response times and errors
   - Upgrade plan if needed for better performance

## Costs

- **Free Tier**: Limited hours, good for demos
- **Starter Plan**: $7/month, always-on service
- **Pro Plan**: Higher performance and features

**Note**: OpenAI API usage is separate and billed by OpenAI based on usage.

## Support

For Render-specific issues:
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)

For app-specific issues:
- Check the main [README.md](./README.md)
- Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

---

**Ready to deploy!** 🚀

Your app is fully configured for Render deployment with the `render.yaml` blueprint.

