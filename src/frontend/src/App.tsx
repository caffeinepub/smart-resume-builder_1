import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import AIAssistant from "./components/AIAssistant";
import AuthGuard from "./components/AuthGuard";
import ATSAnalyzer from "./pages/ATSAnalyzer";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoginPage from "./pages/AdminLoginPage";
import CareerRoadmap from "./pages/CareerRoadmap";
import Certifications from "./pages/Certifications";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import InterviewPrep from "./pages/InterviewPrep";
import Jobs from "./pages/Jobs";
import LearningResources from "./pages/LearningResources";
import LoginPage from "./pages/LoginPage";
import MockInterview from "./pages/MockInterview";
import MockTests from "./pages/MockTests";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import ProfessorLoginPage from "./pages/ProfessorLoginPage";
import ProfessorRegisterPage from "./pages/ProfessorRegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectIdeas from "./pages/ProjectIdeas";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterLoginPage from "./pages/RecruiterLoginPage";
import RecruiterRegisterPage from "./pages/RecruiterRegisterPage";
import RegisterPage from "./pages/RegisterPage";
import ResumeBuilder from "./pages/ResumeBuilder";
import RoleEligibility from "./pages/RoleEligibility";
import SkillGap from "./pages/SkillGap";
import SkillTracker from "./pages/SkillTracker";
import StreamSelectPage from "./pages/StreamSelectPage";
import { initDarkMode } from "./utils/extras";
import {
  getCurrentRole,
  getProfessorAuth,
  getRecruiterAuth,
} from "./utils/roleAuth";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

// Student auth guard
const guard = (C: React.ComponentType) => () => (
  <AuthGuard>
    <C />
  </AuthGuard>
);

// Admin auth guard
function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const role = localStorage.getItem("currentRole");
  if (role !== "admin") {
    // Redirect handled via useEffect in AdminDashboard itself
    return null;
  }
  return <>{children}</>;
}

// Professor auth guard
function ProfessorAuthGuard({ children }: { children: React.ReactNode }) {
  const role = getCurrentRole();
  const auth = getProfessorAuth();
  if (role !== "professor" || !auth) {
    return null;
  }
  return <>{children}</>;
}

// Recruiter auth guard
function RecruiterAuthGuard({ children }: { children: React.ReactNode }) {
  const role = getCurrentRole();
  const auth = getRecruiterAuth();
  if (role !== "recruiter" || !auth) {
    return null;
  }
  return <>{children}</>;
}

const adminGuard = (C: React.ComponentType) => () => (
  <AdminAuthGuard>
    <C />
  </AdminAuthGuard>
);

const professorGuard = (C: React.ComponentType) => () => (
  <ProfessorAuthGuard>
    <C />
  </ProfessorAuthGuard>
);

const recruiterGuard = (C: React.ComponentType) => () => (
  <RecruiterAuthGuard>
    <C />
  </RecruiterAuthGuard>
);

// Existing student routes
const streamSelectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stream-select",
  component: guard(StreamSelectPage),
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: guard(Dashboard),
});
const resumeBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resume-builder",
  component: guard(ResumeBuilder),
});
const atsAnalyzerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ats-analyzer",
  component: guard(ATSAnalyzer),
});
const roleEligibilityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/role-eligibility",
  component: guard(RoleEligibility),
});
const skillGapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/skill-gap",
  component: guard(SkillGap),
});
const learningResourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learning-resources",
  component: guard(LearningResources),
});
const careerRoadmapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/career-roadmap",
  component: guard(CareerRoadmap),
});
const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jobs",
  component: guard(Jobs),
});
const certificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/certifications",
  component: guard(Certifications),
});
const projectIdeasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: guard(ProjectIdeas),
});
const mockTestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mock-tests",
  component: guard(MockTests),
});
const skillTrackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/skill-tracker",
  component: guard(SkillTracker),
});
const interviewPrepRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/interview-prep",
  component: guard(InterviewPrep),
});
const mockInterviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mock-interview",
  component: guard(MockInterview),
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: guard(ProfilePage),
});

// New role-specific routes
const professorLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/professor-login",
  component: ProfessorLoginPage,
});
const professorRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/professor-register",
  component: ProfessorRegisterPage,
});
const professorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/professor-dashboard",
  component: professorGuard(ProfessorDashboard),
});
const recruiterLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recruiter-login",
  component: RecruiterLoginPage,
});
const recruiterRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recruiter-register",
  component: RecruiterRegisterPage,
});
const recruiterDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recruiter-dashboard",
  component: recruiterGuard(RecruiterDashboard),
});
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-login",
  component: AdminLoginPage,
});
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-dashboard",
  component: adminGuard(AdminDashboard),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  streamSelectRoute,
  dashboardRoute,
  resumeBuilderRoute,
  atsAnalyzerRoute,
  roleEligibilityRoute,
  skillGapRoute,
  learningResourcesRoute,
  careerRoadmapRoute,
  jobsRoute,
  certificationsRoute,
  projectIdeasRoute,
  mockTestsRoute,
  skillTrackerRoute,
  interviewPrepRoute,
  mockInterviewRoute,
  profileRoute,
  // New role routes
  professorLoginRoute,
  professorRegisterRoute,
  professorDashboardRoute,
  recruiterLoginRoute,
  recruiterRegisterRoute,
  recruiterDashboardRoute,
  adminLoginRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppInit() {
  useEffect(() => {
    initDarkMode();
  }, []);
  return null;
}

export default function App() {
  return (
    <>
      <AppInit />
      <RouterProvider router={router} />
      <AIAssistant />
    </>
  );
}
