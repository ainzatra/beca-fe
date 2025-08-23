import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import images from '@/constants/images';
import { Link, useNavigate } from '@tanstack/react-router';
import type { User } from '@/stores/useUserStore';
import { toast } from 'sonner';

interface LoginFormProps {
  className?: string;
  setUser: (user: User) => void;
  [key: string]: any;
}

export function LoginForm({ className, setUser, ...props }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validRoles = ['surveyor', 'admin', 'superadmin'];

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      toast.error('Please enter both username and password');
      return;
    }

    if (!validRoles.includes(password.trim().toLowerCase())) {
      toast.error('Incorrect username or password', {});
      return;
    }

    // Call setUser with the username password will set the role of the user
    setUser({ id: '123', username, role: password });

    // Navigate to dashboard
    navigate({ to: '/dashboard' });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-1">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={images.logo}
                  alt="logo"
                  className="w-[240px] h-[240px]"
                />
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Link
                  to="/forgot-password"
                  className="text-center text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
