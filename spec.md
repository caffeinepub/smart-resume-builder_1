# SMARTRESUME AI — Complete Multi-Role Career Ecosystem

## Current State

The app is a student-only career platform with:
- Login/Register using mobile number (LocalStorage-based auth)
- Stream selection after login (8 academic streams)
- Student-only dashboard with resume builder, ATS analyzer, role eligibility, skill gap, learning resources, career roadmap, jobs portal, mock tests, project ideas, interview prep, AI assistant, certifications, skill tracker
- All data stored per-user via `stream_<mobile>`, `resume_<mobile>`, etc.
- `AuthGuard` component that checks `career_auth` localStorage key
- App opens directly to `/` (Home) which redirects to login
- Single role system — no professor, recruiter, or admin dashboards
- No role-based access control

## Requested Changes (Diff)

### Add
- **Role Selection Landing Page** (`/`) — Full-screen 4-card layout: Student, Professor, Recruiter, Admin; each card routes to its own login
- **Admin Login page** (`/admin-login`) — Fixed credentials (admin123/admin123), sets `currentRole=admin` in localStorage, redirects to `/admin-dashboard`
- **Professor Login page** (`/professor-login`) — New login using name+mobile, sets `currentRole=professor`, routes to `/professor-dashboard`
- **Professor Register page** (`/professor-register`)
- **Recruiter Login page** (`/recruiter-login`) — New login using name+mobile+company, sets `currentRole=recruiter`, routes to `/recruiter-dashboard`
- **Recruiter Register page** (`/recruiter-register`)
- **Admin Dashboard** (`/admin-dashboard`) — Stat cards (total students, professors, recruiters), stream distribution chart, user list management, global notifications, recruiter approval
- **Professor Dashboard** (`/professor-dashboard`) — Student list (pulled from localStorage), filter by stream, search, view resume/ATS score, add feedback, recommend skills, assign projects, mark placement-ready, batch analytics
- **Recruiter Dashboard** (`/recruiter-dashboard`) — Candidate search/filter by stream/skills/ATS score, shortlist candidates, post jobs/internships, send interview invitations
- **Role-based AuthGuard** — Student routes check `currentRole=student`, professor routes check `currentRole=professor`, recruiter routes check `currentRole=recruiter`, admin routes check `currentRole=admin`
- `currentRole` localStorage key set on every login
- `utils/roleAuth.ts` — Role-specific auth helpers

### Modify
- **`/` (Home)** — Remove direct redirect to login; render the 4-role selection landing page
- **Student Login/Register** — After login/register set `currentRole=student`
- **AuthGuard** — Extend to accept required role; redirect to role selection if wrong role
- **App.tsx** — Add all new routes for professor, recruiter, admin
- **Student routes** — All existing student pages remain intact, protected by `currentRole=student`

### Remove
- Nothing removed — all student features preserved

## Implementation Plan

1. **`utils/roleAuth.ts`** — helpers: `getCurrentRole()`, `setCurrentRole()`, `clearCurrentRole()`, `getProfessors()`, `getRecruiters()`, `registerProfessor()`, `registerRecruiter()`
2. **Update `utils/auth.ts`** — student login/register now sets `currentRole=student`
3. **Update `components/AuthGuard.tsx`** — accept `requiredRole` prop; check `currentRole` in addition to `career_auth`
4. **Update `pages/Home.tsx`** — replace with 4-card Role Selection landing page
5. **Add `pages/ProfessorLoginPage.tsx`** and `ProfessorRegisterPage.tsx`
6. **Add `pages/RecruiterLoginPage.tsx`** and `RecruiterRegisterPage.tsx`
7. **Add `pages/AdminLoginPage.tsx`** — hardcoded credentials
8. **Add `pages/AdminDashboard.tsx`** — stats, user management, stream charts, notifications, recruiter approval
9. **Add `pages/ProfessorDashboard.tsx`** — student list with filter/search, feedback, project assignment, analytics
10. **Add `pages/RecruiterDashboard.tsx`** — candidate search/filter, shortlist, job posting, interview invitations
11. **Update `App.tsx`** — register all new routes with role-specific guards
12. **Student AppShell** — add logout that clears both `career_auth` and `currentRole`, redirect to role selection `/`
