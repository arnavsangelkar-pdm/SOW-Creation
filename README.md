# SOW & Proposal Generator

A polished demo application that transforms discovery call inputs into structured **Statements of Work (SOW)** and **Proposals** using AI. Built with Next.js 14, TypeScript, and modern UI components.

![SOW Generator](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)

## ✨ Features

### Core Functionality
- **🤖 AI-Powered Generation**: Convert discovery inputs into professional SOWs with smart defaults
- **✏️ Rich Editor**: Edit sections, deliverables, timelines, and pricing with visual controls
- **💬 Collaboration**: Comments, change tracking, and version history built-in
- **📤 Multiple Export Formats**: PDF, DOCX, and Markdown export
- **🔄 Status Workflow**: Draft → In Review → Approved with appropriate controls
- **📊 Visual Timeline**: Gantt-style milestone visualization
- **💰 Pricing Tables**: Support for T&M, Fixed, and Hybrid pricing models

### Technical Highlights
- **Mock-First Design**: Works perfectly without API keys; optionally uses OpenAI when available
- **Optimistic UI**: Fast, responsive interactions with auto-save
- **LocalStorage Persistence**: No database required for demo purposes
- **Type-Safe**: Full TypeScript with Zod validation
- **Modern Stack**: Next.js 14 App Router, React 18, Tailwind CSS
- **Component Library**: Built on shadcn/ui for consistency

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- pnpm, npm, or yarn

### Installation

```bash
# Clone or navigate to the project
cd "SOW From Notes"

# Install dependencies
pnpm install
# or
npm install
# or
yarn install
```

### Development

```bash
# Start the development server
pnpm dev
# or
npm run dev

# Open http://localhost:3000
```

The app will launch at `http://localhost:3000`.

---

## 📋 Usage Guide

### 1. Create Your First SOW

1. **Landing Page** (`/`): Overview of features
2. **Intake Form** (`/intake`): Fill in discovery details
   - Use "Load Sample A" or "Load Sample B" for quick start
   - Fill in client info, project details, scope, and constraints
3. **Generate**: Click "Generate SOW & Proposal"
4. **Workspace** (`/workspace`): Edit, comment, and refine
5. **Export**: Download as PDF, DOCX, or Markdown

### 2. Workspace Features

#### Left Sidebar: Outline Tree
- Navigate sections by clicking
- Active section highlighted in primary color

#### Main Editor
- **Tabs**: Switch between SOW, Proposal, Timeline, Pricing, Versions
- **Section Editor**: 
  - Text sections use Markdown editor
  - Bullet lists: one item per line
  - Tables/Timeline: JSON format (editable)
- **Auto-save**: Changes saved automatically to localStorage

#### Right Sidebar: Comments
- Add comments to current section
- Resolve/reopen comments
- Thread history preserved

#### Top Bar Actions
- **Status Badge**: Shows Draft / In Review / Approved
- **Save**: Create version snapshot
- **Export**: Download in multiple formats
- **Share**: (Placeholder for future implementation)
- **Submit/Approve**: Move document through workflow

### 3. Sample Data

Two pre-built samples available:

- **Sample A**: SaaS onboarding revamp (12-week, Hybrid pricing)
- **Sample B**: E-commerce personalization (8-week, T&M pricing)

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file (optional):

```bash
# Optional: OpenAI API key for real AI generation
# If not provided, uses deterministic mock generation
OPENAI_API_KEY=sk-...

# Optional: Brand customization
NEXT_PUBLIC_BRAND_NAME="Apex Consulting"
NEXT_PUBLIC_BRAND_COLOR="#6366f1"
```

### Mock vs. OpenAI Mode

**Default (Mock Mode)**:
- No API key required
- Deterministic output based on heuristics
- Instant generation
- Perfect for demos and testing

**OpenAI Mode** (when `OPENAI_API_KEY` is set):
- Uses GPT-4 Turbo for generation
- More natural language
- Adapts to input nuances
- Fallback to mock if API fails

The AI abstraction is in `lib/ai.ts`.

---

## 📦 Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── generate/route.ts       # SOW generation endpoint
│   │   └── export/
│   │       ├── pdf/route.ts        # PDF export
│   │       └── docx/route.ts       # DOCX export
│   ├── intake/page.tsx             # Discovery intake form
│   ├── workspace/page.tsx          # Main editor workspace
│   ├── review/[id]/page.tsx        # Read-only review page
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Global styles
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── IntakeForm.tsx              # Discovery form
│   ├── OutlineTree.tsx             # Section navigation
│   ├── EditorPane.tsx              # Content editor
│   ├── Timeline.tsx                # Milestone visualization
│   ├── PricingTable.tsx            # Pricing breakdown
│   ├── CommentDrawer.tsx           # Comments sidebar
│   ├── VersionList.tsx             # Version history
│   ├── StatusBadge.tsx             # Status indicator
│   └── ExportMenu.tsx              # Export dropdown
├── lib/
│   ├── schema.ts                   # TypeScript types & Zod schemas
│   ├── ai.ts                       # AI abstraction (mock + OpenAI)
│   ├── prompts.ts                  # System prompt builder
│   ├── store.ts                    # Zustand state management
│   ├── storage.ts                  # LocalStorage utilities
│   ├── brand.ts                    # Brand configuration
│   ├── diff.ts                     # Simple diff utility
│   └── utils.ts                    # Helper functions
├── data/
│   └── samples.ts                  # Sample discovery inputs
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🚢 Deployment

### Deploy to Render

1. **Create a Render account** at https://render.com

2. **New Web Service**:
   - Connect your Git repository
   - Or use "Deploy from Docker" for manual deployment

3. **Configuration**:
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Environment Variables** (optional):
   - `OPENAI_API_KEY`: Your OpenAI key
   - `NEXT_PUBLIC_BRAND_NAME`: Your brand name
   - `NEXT_PUBLIC_BRAND_COLOR`: Your primary color

5. **Deploy**: Click "Create Web Service"

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables (optional)
vercel env add OPENAI_API_KEY
```

### Deploy to Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Build: `npm run build`
3. Deploy: `netlify deploy --prod`

---

## 🎨 Customization

### Brand Colors

Edit `lib/brand.ts` or set environment variables:

```typescript
export const DEFAULT_BRAND: OrgBrand = {
  name: "Your Company",
  primaryColor: "#your-color",
  secondaryColor: "#your-secondary",
  tone: "consultative",
};
```

### Sections & Schema

Modify `lib/ai.ts` to adjust generated sections:

```typescript
const sections = [
  { id: "exec-summary", title: "Executive Summary", kind: "text", ... },
  // Add or remove sections here
];
```

### Pricing Models

Adjust pricing in `lib/ai.ts`:

```typescript
const pricing = {
  model: pricingModel,
  tm: {
    roles: [
      { role: "Senior Consultant", rate: 250, currency: "USD" },
      // Modify rates
    ],
    // ...
  },
};
```

---

## 📄 Export Formats

### PDF Export
- HTML-based (browser print)
- Styled with brand colors
- Includes cover page and TOC
- Print-optimized CSS

### DOCX Export
- Text-based (simplified)
- Future: Use `docx` library for full formatting

### Markdown Export
- Raw markdown content
- Copy/paste friendly
- Version control compatible

**Note**: For production-grade exports, integrate `@react-pdf/renderer` for PDFs and `docx` for Word documents.

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Load Sample A, generate SOW
- [ ] Edit section content
- [ ] Add comment to a section
- [ ] Resolve comment
- [ ] Create version snapshot
- [ ] Change status to "In Review"
- [ ] Export as PDF
- [ ] Export as DOCX
- [ ] Export as Markdown
- [ ] View timeline visualization
- [ ] View pricing breakdown
- [ ] Navigate to review page

### Known Limitations

- **No Server Database**: All data stored in localStorage (resets on clear)
- **Single User**: No multi-user collaboration (yet)
- **Basic Exports**: PDF/DOCX are simplified (HTML/text)
- **No Authentication**: Open access (add auth for production)
- **No Real-Time Sync**: Changes not synced across tabs

---

## 🛠️ Development Notes

### State Management
- **Zustand**: Global workspace state
- **LocalStorage**: Persistence layer
- **React Query**: (Optional) For API caching

### Styling
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component primitives
- **CSS Variables**: Theme customization

### Type Safety
- **TypeScript**: Strict mode enabled
- **Zod**: Runtime validation
- **Schema-First**: All data structures typed

---

## 🐛 Troubleshooting

### "Document Not Found" in Workspace
- **Cause**: No SOW generated yet
- **Fix**: Go to `/intake` and generate a document

### Export Not Working
- **Cause**: API route error or CORS
- **Fix**: Check browser console; ensure API routes deployed

### OpenAI Generation Fails
- **Cause**: Invalid API key or rate limit
- **Fix**: Check `.env.local`; verify key is active; falls back to mock

### Styles Not Loading
- **Cause**: Tailwind not compiled
- **Fix**: Restart dev server (`pnpm dev`)

---

## 🤝 Contributing

This is a demo project. Contributions welcome for:

- Enhanced export formats (true PDF/DOCX)
- Real-time collaboration
- Database persistence
- Authentication/authorization
- Clause library
- Multi-language support

---

## 📝 License

MIT License - feel free to use this project as a starting point for your own SOW generation tool.

---

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **shadcn** for beautiful component primitives
- **Vercel** for hosting and deployment tools
- **Tailwind CSS** for utility-first styling
- **Lucide** for clean iconography

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the project structure and code comments
3. Open an issue in the repository

---

**Built with ❤️ using Next.js, TypeScript, and AI**

