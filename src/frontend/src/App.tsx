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
import CareerRoadmap from "./pages/CareerRoadmap";
import Certifications from "./pages/Certifications";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import LearningResources from "./pages/LearningResources";
import LoginPage from "./pages/LoginPage";
import MockTests from "./pages/MockTests";
import ProjectIdeas from "./pages/ProjectIdeas";
import RegisterPage from "./pages/RegisterPage";
import ResumeBuilder from "./pages/ResumeBuilder";
import RoleEligibility from "./pages/RoleEligibility";
import SkillGap from "./pages/SkillGap";
import { initDarkMode } from "./utils/extras";

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
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  ),
});
const resumeBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resume-builder",
  component: () => (
    <AuthGuard>
      <ResumeBuilder />
    </AuthGuard>
  ),
});
const atsAnalyzerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ats-analyzer",
  component: () => (
    <AuthGuard>
      <ATSAnalyzer />
    </AuthGuard>
  ),
});
const roleEligibilityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/role-eligibility",
  component: () => (
    <AuthGuard>
      <RoleEligibility />
    </AuthGuard>
  ),
});
const skillGapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/skill-gap",
  component: () => (
    <AuthGuard>
      <SkillGap />
    </AuthGuard>
  ),
});
const learningResourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learning-resources",
  component: () => (
    <AuthGuard>
      <LearningResources />
    </AuthGuard>
  ),
});
const careerRoadmapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/career-roadmap",
  component: () => (
    <AuthGuard>
      <CareerRoadmap />
    </AuthGuard>
  ),
});
const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jobs",
  component: () => (
    <AuthGuard>
      <Jobs />
    </AuthGuard>
  ),
});
const certificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/certifications",
  component: () => (
    <AuthGuard>
      <Certifications />
    </AuthGuard>
  ),
});
const projectIdeasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: () => (
    <AuthGuard>
      <ProjectIdeas />
    </AuthGuard>
  ),
});
const mockTestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mock-tests",
  component: () => (
    <AuthGuard>
      <MockTests />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
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
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppInit() {
  useEffect(() => {
    // Do NOT auto-initialize sample data — users must create their own data
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
