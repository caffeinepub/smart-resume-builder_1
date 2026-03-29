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
import InterviewPrep from "./pages/InterviewPrep";
import Jobs from "./pages/Jobs";
import LearningResources from "./pages/LearningResources";
import LoginPage from "./pages/LoginPage";
import MockInterview from "./pages/MockInterview";
import MockTests from "./pages/MockTests";
import ProfilePage from "./pages/ProfilePage";
import ProjectIdeas from "./pages/ProjectIdeas";
import RegisterPage from "./pages/RegisterPage";
import ResumeBuilder from "./pages/ResumeBuilder";
import RoleEligibility from "./pages/RoleEligibility";
import SkillGap from "./pages/SkillGap";
import SkillTracker from "./pages/SkillTracker";
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

const guard = (C: React.ComponentType) => () => (
  <AuthGuard>
    <C />
  </AuthGuard>
);

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
  skillTrackerRoute,
  interviewPrepRoute,
  mockInterviewRoute,
  profileRoute,
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
