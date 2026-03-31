# SmartResume AI

## Current State
The app has a stream selection flow: after signup/login, users are redirected to `/stream-select` where they choose their academic stream (CSE, ME, MBA, Arts, etc.). This stream is saved in LocalStorage and used throughout the app to filter roles, jobs, skill gaps, and learning resources. Stream badges and "Change stream" links appear in the sidebar (AppShell), RoleEligibility page, and Jobs page.

## Requested Changes (Diff)

### Add
- Default stream fallback: `getUserStream()` in `auth.ts` should return `"cse"` if no stream is stored (so all stream-based features continue working silently)

### Modify
- `RegisterPage.tsx`: navigate to `/dashboard` directly after registration (remove `/stream-select` redirect)
- `LoginPage.tsx`: navigate to `/dashboard` directly after login (remove stream check and `/stream-select` redirect, remove `getUserStream` import)
- `AppShell.tsx`: remove the stream badge block (the colored label + RefreshCw "Change stream" link) from the sidebar. Remove unused `getUserStream`, `getStreamById` imports and `userStream`/`streamDef` variables. Remove `RefreshCw` import if not used elsewhere.
- `RoleEligibility.tsx`: remove the stream indicator badge ("Showing roles for: X" + RefreshCw change stream link). Remove `RefreshCw` import. Keep `userStream`, `streamDef`, `streamRoles` variables as they are needed for role data.
- `Jobs.tsx`: remove the stream badge from the page header. Remove the "Browse portals for:" stream selector dropdown and "Browse All Streams" toggle button. Remove `allStreams`, `browseStream`, `showAllStreams`, `browseStreamDef` state/variables. Simply show portals for `userStream` (defaulting to cse). Remove `getAllStreams` import. Keep `getStreamById`, `getStreamJobPortals`, `getUserStream` imports.
- `App.tsx`: remove `StreamSelection` import and `streamSelectRoute` from the router

### Remove
- `StreamSelection.tsx` page file
- `/stream-select` route
- Stream selection step from auth flow
- All stream badge/label UI elements across pages
- "Change stream" links and RefreshCw icons

## Implementation Plan
1. Update `auth.ts` getUserStream to default to `"cse"`
2. Update `RegisterPage.tsx` to go to `/dashboard`
3. Update `LoginPage.tsx` to go to `/dashboard`
4. Remove stream badge from `AppShell.tsx` sidebar
5. Remove stream indicator from `RoleEligibility.tsx`
6. Remove stream selector from `Jobs.tsx` header
7. Remove `StreamSelection` from `App.tsx` routes
8. Delete `StreamSelection.tsx`
