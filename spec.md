# SMARTRESUME AI

## Current State
Full career platform with 10 pages. All pages have hidden file inputs (className="hidden") but user reports a visible file field. An AI chat/search system does not exist.

## Requested Changes (Diff)

### Add
- Floating AI Career Assistant chat widget visible on all authenticated pages
- The widget opens as an in-page panel/modal (NOT a new tab)
- Career-focused smart responses using a local knowledge base covering: resume tips, ATS, skills, certifications, job search, career roadmap, interview prep
- Suggested quick-action questions shown when chat is empty
- Chat history stored in LocalStorage (per session)
- Widget toggle button (bottom-right floating button) with pulse animation to attract attention

### Modify
- Fix any visible/exposed raw file input fields across all pages — ensure all `<input type="file">` elements are hidden and only triggered via styled buttons
- All external links in the AI chat (if any) must open in new tab, but the chat widget itself stays in-page

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/AIAssistant.tsx` — floating chat widget component
   - Floating button bottom-right with brain/bot icon
   - Slide-up panel (not a modal overlay) ~400px wide, stays on screen
   - Input bar at bottom, messages list above
   - Smart career AI response engine using keyword matching + knowledge base
   - Quick suggestion chips when chat is empty
   - LocalStorage for chat history
2. Add `<AIAssistant />` to the root layout (App.tsx) so it appears on all pages
3. Audit all pages for visible file inputs and ensure className="hidden" is applied
