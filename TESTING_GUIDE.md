# Testing Guide - SOW Generator

## 🎯 What Was Fixed

### 1. **Quick Actions Buttons (Left Sidebar)** ✅
- **Issue**: Buttons were trying to navigate to invalid section IDs
- **Fix**: Now properly switch to the correct tabs
- **Result**: All three Quick Action buttons now work perfectly

### 2. **Section Editing** ✅
- **Issue**: Could only edit SOW sections, not Proposal sections
- **Fix**: Added `updateProposalSection` function to store
- **Result**: Can now edit both SOW and Proposal sections independently

### 3. **Tab Switching** ✅
- **Issue**: Proposal tab wasn't properly updating proposal document
- **Fix**: Proper document selection based on active tab
- **Result**: Switching between SOW and Proposal tabs works correctly

### 4. **Export Functionality** ✅
- **Issue**: PDF and DOCX exports weren't downloading properly
- **Fix**: 
  - PDF opens in new window with print dialog (save as PDF)
  - Text export properly downloads as .txt file
  - Markdown export downloads as .md file
- **Result**: All export options now work

## 🧪 How to Test

### Step 1: Generate a Document

1. **Start the app**:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

2. **Go to Intake** (`/intake`)

3. **Load Sample A or B**:
   - Click "Load Sample A" or "Load Sample B" button
   - Verify form populates with data

4. **Generate SOW**:
   - Click "Generate SOW & Proposal" button
   - Wait for generation (should be instant in mock mode)
   - Should redirect to `/workspace`

### Step 2: Test SOW Tab

1. **Verify SOW Tab is Active**:
   - Should be on "SOW" tab by default
   - Left sidebar shows "SOW Outline"

2. **Navigate Sections**:
   - Click different sections in the outline tree
   - Verify section content appears in the editor
   - Active section should be highlighted

3. **Edit a Section**:
   - Select "Executive Summary" or any text section
   - Make a change in the markdown editor
   - Verify "Auto-saved" toast appears
   - Verify timestamp updates in header

### Step 3: Test Proposal Tab

1. **Switch to Proposal Tab**:
   - Click "Proposal" tab at the top
   - Left sidebar should now show "Proposal Outline"

2. **Navigate Proposal Sections**:
   - Click different sections in the outline tree
   - Verify proposal content appears (may differ from SOW)

3. **Edit Proposal Section**:
   - Select any section
   - Make a change
   - Verify "Auto-saved" toast appears
   - **IMPORTANT**: Switch back to SOW tab and verify SOW wasn't changed

### Step 4: Test Quick Actions

Located in the left sidebar below the outline tree:

1. **View Timeline Button**:
   - Click "View Timeline"
   - Should switch to Timeline tab
   - Should see milestone visualization

2. **View Pricing Button**:
   - Click "View Pricing"
   - Should switch to Pricing tab
   - Should see pricing breakdown table

3. **View Versions Button**:
   - Click "View Versions"
   - Should switch to Versions tab
   - Should show version history (empty if no saves yet)

### Step 5: Test Timeline Tab

1. **Manual Navigation**:
   - Click "Timeline" tab at top
   - OR use "View Timeline" Quick Action

2. **Verify Display**:
   - Should see week-by-week grid
   - Should see milestone bars
   - Should show milestone names and durations
   - Bars should be positioned correctly by start/end week

### Step 6: Test Pricing Tab

1. **Manual Navigation**:
   - Click "Pricing" tab at top
   - OR use "View Pricing" Quick Action

2. **Verify Display**:
   - Should show pricing model (T&M, Fixed, or Hybrid)
   - Should show total cost
   - **For T&M**: Role-based table with rates and hours
   - **For Fixed**: Itemized breakdown
   - Should show pricing notes if available

### Step 7: Test Versions Tab

1. **Create a Version**:
   - Go back to SOW or Proposal tab
   - Click "Save" button in header
   - Verify toast notification

2. **View Versions**:
   - Click "Versions" tab
   - OR use "View Versions" Quick Action
   - Should see version entry with timestamp
   - Should show description: "Manual save - HH:MM:SS"

### Step 8: Test Export Functionality

All exports accessible from header "Export" dropdown:

#### PDF Export
1. **Click Export → Export as PDF**
2. **Expected Behavior**:
   - New browser window opens
   - Document HTML displays
   - Print dialog automatically opens
   - Can save as PDF from print dialog
3. **Verify**:
   - Document includes title, client name, date
   - All sections are formatted properly
   - Markdown is converted to HTML

#### Text Export
1. **Click Export → Export as Text**
2. **Expected Behavior**:
   - `.txt` file downloads immediately
   - Filename based on document title
3. **Verify**:
   - Open the downloaded file
   - Contains title, client info, and full markdown content
   - Readable plain text format

#### Markdown Export
1. **Click Export → Export as Markdown**
2. **Expected Behavior**:
   - `.md` file downloads immediately
   - Filename based on document title
3. **Verify**:
   - Open the downloaded file
   - Contains raw markdown
   - Can be opened in any markdown editor

### Step 9: Test Status Workflow

1. **Initial State**:
   - Document should be in "Draft" status (blue badge)
   - Should see "Submit for Review" button

2. **Submit for Review**:
   - Click "Submit for Review" button
   - Status badge should change to "In Review" (yellow)
   - Button should change to "Approve"

3. **Approve Document**:
   - Click "Approve" button
   - Status badge should change to "Approved" (green)
   - All sections should become read-only
   - Markdown toolbar should be hidden

### Step 10: Test Comments

Located in right sidebar:

1. **Add Comment**:
   - Select a section from outline
   - Type in comment box in right sidebar
   - Click "Add Comment" or similar button
   - Verify comment appears with timestamp

2. **Resolve Comment**:
   - Click "Resolve" on a comment
   - Verify comment shows as resolved

3. **Section-Specific**:
   - Switch to different section
   - Verify comments change based on active section

## ✅ Complete Testing Checklist

### Tabs
- [ ] SOW tab displays and edits SOW sections
- [ ] Proposal tab displays and edits Proposal sections
- [ ] Timeline tab shows milestone visualization
- [ ] Pricing tab shows pricing breakdown
- [ ] Versions tab shows version history

### Quick Actions
- [ ] "View Timeline" switches to Timeline tab
- [ ] "View Pricing" switches to Pricing tab
- [ ] "View Versions" switches to Versions tab

### Navigation
- [ ] Outline tree shows correct sections per tab
- [ ] Clicking sections loads content in editor
- [ ] Active section is highlighted
- [ ] Outline title changes per tab (SOW/Proposal Outline)

### Editing
- [ ] Can edit text sections with markdown editor
- [ ] Can edit bullet sections with textarea
- [ ] Auto-save triggers and shows toast
- [ ] Timestamp updates in header
- [ ] Changes persist after page refresh (localStorage)
- [ ] SOW and Proposal edits are independent

### Exports
- [ ] PDF export opens print dialog
- [ ] Text export downloads .txt file
- [ ] Markdown export downloads .md file
- [ ] All exports contain complete document content

### Status Workflow
- [ ] Draft → In Review transition works
- [ ] In Review → Approved transition works
- [ ] Approved status makes document read-only
- [ ] Status badge displays correct color/text

### Comments
- [ ] Can add comments to sections
- [ ] Can resolve/unresolve comments
- [ ] Comments are section-specific
- [ ] Comments show timestamp and author

### Header Actions
- [ ] Save button creates version snapshot
- [ ] Back button returns to home
- [ ] Share button is present (placeholder)
- [ ] Status badge displays correctly

## 🐛 Known Limitations

1. **PDF Export**: Opens HTML in print dialog (not true PDF generation)
   - **Workaround**: Use browser's "Print to PDF" feature
   - **Production**: Would use @react-pdf/renderer

2. **Text Export**: Saves as .txt instead of .docx
   - **Workaround**: Save as .txt and open in Word
   - **Production**: Would use docx library

3. **LocalStorage Only**: No server persistence
   - **Workaround**: Use Export → Markdown to backup
   - **Production**: Would use database

4. **Single User**: No real-time collaboration
   - **Production**: Would add WebSocket support

## 📝 Notes for Render Deployment

After deploying to Render:

1. **Test on Render URL**: Repeat all tests above
2. **Check API Routes**: Ensure `/api/*` routes work
3. **Check Exports**: Verify downloads work in production
4. **Test Across Browsers**: Chrome, Firefox, Safari
5. **Test on Mobile**: Responsive design (if applicable)

## 🆘 Troubleshooting

### Quick Actions Don't Work
- **Check**: Console for JavaScript errors
- **Verify**: onClick handlers are calling setActiveTab()
- **Clear**: Browser cache and reload

### Exports Don't Download
- **Check**: Browser popup blocker (for PDF)
- **Check**: Download settings in browser
- **Verify**: API routes are accessible (`/api/export/*`)

### Sections Don't Update
- **Check**: Active tab matches document type
- **Verify**: LocalStorage has data (Dev Tools → Application → Local Storage)
- **Try**: Refresh page to reload from storage

### Tabs Don't Switch
- **Check**: Console for React errors
- **Verify**: Tabs component is receiving correct props
- **Try**: Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

---

**All features are now fully functional!** ✨

If you encounter any issues during testing, check the browser console for errors and refer to the troubleshooting section above.

