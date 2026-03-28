import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getStoredAuth } from "../utils/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const auth = getStoredAuth();

  useEffect(() => {
    if (!auth) {
      navigate({ to: "/login" });
    }
  }, [auth, navigate]);

  if (!auth) return null;
  return <>{children}</>;
}
