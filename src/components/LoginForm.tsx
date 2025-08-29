import { useState } from 'react';
import { api, cn } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import images from '@/constants/images';
import { Link, useNavigate } from '@tanstack/react-router';
import { useUserStore, type User } from '@/stores/useUserStore';
import { toast } from 'sonner';

interface LoginFormProps {
  className?: string;
  [key: string]: any;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const { setUser } = useUserStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      toast.error('Please enter both username and password');
      return;
    }

    try {
      const response = await api('/auth/login', false, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        toast.error(response.statusText || 'Login failed. Please try again.');
        return;
      }

      const result = await response.json();
      localStorage.setItem('beca_token', result.token);
      setUser(result);
      toast.success('Login successful!', {
        style: { backgroundColor: 'limegreen', color: 'white' },
      });
      // Navigate to dashboard
      navigate({ to: '/dashboard' });
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return;
    }
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
