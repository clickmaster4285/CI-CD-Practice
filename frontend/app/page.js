'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const validateForm = () => {
    const formData = new FormData(formRef.current);
    const email = formData.get('email')?.toString().trim();
    const password = formData.get('password')?.toString().trim();
    const errors = {};

    if (!email || !email.includes('@')) {
      errors.email = 'Please enter a valid email';
    }
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Login:', { email: formRef.current.email.value });
    alert('Logged in successfully! (Demo)');
    formRef.current.reset();
    setErrors({});
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 font-sans">
      {/* Subtle background pattern using Shadcn colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-background to-muted/20" />

      <Card className="w-full max-w-md relative z-10 shadow-lg border-card/50 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          {/* Icon using primary colors */}
          <div className="mx-auto w-20 h-20 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-4">
            <Mail className="w-10 h-10 text-primary" />
          </div>

          <CardTitle className="text-3xl font-bold text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12 rounded-xl"
                  hasError={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12 rounded-xl"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" name="remember" />
              <Label htmlFor="remember" className="text-sm leading-none cursor-pointer">
                Remember me
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="text-center text-sm text-muted-foreground space-y-2 pt-2">
            <a href="#" className="hover:text-foreground font-medium hover:underline">Forgot password?</a>
            <p>
              Don't have an account?{' '}
              <a href="#" className="text-primary hover:underline font-medium">Sign up</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
