# SmartResume AI

## Current State
Global localStorage keys shared across all users.

## Requested Changes (Diff)

### Add
- Per-user keys: resume_phone, ats_phone, notifications_phone

### Modify
- storage.ts, extras.ts, AppShell.tsx

### Remove
- Global shared resume key

## Implementation Plan
1. Add getCurrentUserPhone to auth.ts
2. Update storage.ts with per-user keys
3. Update extras.ts with per-user keys
4. Fix notification z-index
