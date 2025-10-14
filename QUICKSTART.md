# Quick Start Guide

## Get Running in 60 Seconds

```bash
# 1. Install dependencies
pnpm install

# 2. Start dev server
pnpm dev

# 3. Open browser
open http://localhost:3000
```

## First Steps

### Option 1: Quick Demo
1. Navigate to http://localhost:3000/intake
2. Click **"Load Sample A (SaaS Onboarding)"**
3. Click **"Generate SOW & Proposal"**
4. Explore the workspace!

### Option 2: Create Your Own
1. Fill in the intake form with your project details
2. Generate your custom SOW
3. Edit sections, add comments, export

## Key Routes

- `/` - Landing page
- `/intake` - Discovery form
- `/workspace` - Main editor
- `/review/[id]` - Read-only view

## Environment Setup (Optional)

Create `.env.local` for OpenAI integration:

```bash
OPENAI_API_KEY=sk-your-key-here
NEXT_PUBLIC_BRAND_NAME="Your Company"
NEXT_PUBLIC_BRAND_COLOR="#6366f1"
```

Without API key → Uses deterministic mock (works great!)

## Common Commands

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

## Deploy to Render

1. Push code to GitHub
2. Go to https://render.com/new/web-service
3. Connect repository
4. Build: `npm install && npm run build`
5. Start: `npm start`
6. Deploy!

## Features to Try

✅ Load sample data  
✅ Generate SOW  
✅ Edit sections (Markdown editor!)  
✅ View timeline visualization  
✅ Check pricing breakdown  
✅ Add comments  
✅ Create version snapshots  
✅ Change document status  
✅ Export as PDF/DOCX/Markdown  

## Troubleshooting

**"Document Not Found" in workspace?**
→ Generate a SOW from `/intake` first

**Styles look broken?**
→ Restart dev server (`pnpm dev`)

**Export not working?**
→ Check browser console; API routes need to be deployed

## Next Steps

- Customize brand colors in `lib/brand.ts`
- Add your own sample data in `data/samples.ts`
- Modify sections in `lib/ai.ts`
- Extend the schema in `lib/schema.ts`

---

**Need help?** Check the main README.md for detailed documentation.

