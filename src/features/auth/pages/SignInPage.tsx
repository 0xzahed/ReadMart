import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { FaApple, FaFacebookF, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const providers = [
  { name: "Apple", icon: FaApple },
  { name: "Google", icon: FaGoogle },
  { name: "Facebook", icon: FaFacebookF },
];

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pb-20 lg:pb-0">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hi! Welcome back, you&apos;ve been missed.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input placeholder="example@email.com" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative mt-1">
              <Input type={showPassword ? "text" : "password"} placeholder="••••••••" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Link to="#" className="block text-right text-xs text-primary font-medium">
            Forgot Password?
          </Link>
        </div>

        <Button className="w-full h-12 rounded-xl text-base font-semibold">Sign In</Button>

        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-background px-4 text-xs text-muted-foreground">Or sign in with</span>
        </div>

        <div className="flex justify-center gap-4">
          {providers.map((provider) => {
            const Icon = provider.icon;
            return (
              <button
                key={provider.name}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                type="button"
                aria-label={`Sign in with ${provider.name}`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Admin access only.
        </p>
      </div>
    </div>
  );
}
