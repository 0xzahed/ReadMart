import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

type LocationState = {
  from?: string;
};

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdminAuthenticated, login } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const from = (location.state as LocationState | null)?.from;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ok = login(email, password);

    if (!ok) {
      setError("Email and password are required.");
      return;
    }

    setError("");
    navigate(from && from !== "/admin" ? from : "/admin/dashboard", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Access the admin dashboard securely.
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              className="mt-1"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@readmart.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative mt-1">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

          <Button className="h-11 w-full rounded-xl text-base font-semibold" type="submit">
            Login to Admin
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Back to store?{" "}
          <Link to="/" className="font-semibold text-primary">
            Go Home
          </Link>
        </p>
      </div>
    </div>
  );
}
