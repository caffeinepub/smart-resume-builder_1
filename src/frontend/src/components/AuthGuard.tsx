import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getStoredAuth } from "../utils/auth";
import { getCurrentRole } from "../utils/roleAuth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const auth = getStoredAuth();

  useEffect(() => {
    if (!auth) {
      navigate({ to: "/login" });
      return;
    }
    // If the stored role is not 'student', this user shouldn't be on student routes
    const role = getCurrentRole();
    if (role && role !== "student") {
      navigate({ to: "/" });
      return;
    }
    // Stream guard: if user is logged in but has no stream selected, redirect to stream-select
    const streamKey = `stream_${auth.phone}`;
    const hasStream = !!localStorage.getItem(streamKey);
    if (!hasStream && window.location.pathname !== "/stream-select") {
      navigate({ to: "/stream-select" });
    }
  }, [auth, navigate]);

  if (!auth) return null;

  // Block non-students from student routes
  const role = getCurrentRole();
  if (role && role !== "student") return null;

  // If no stream and not on stream-select page, render nothing (redirect in effect)
  const streamKey = `stream_${auth.phone}`;
  const hasStream = !!localStorage.getItem(streamKey);
  if (!hasStream && window.location.pathname !== "/stream-select") {
    return null;
  }

  return <>{children}</>;
}
