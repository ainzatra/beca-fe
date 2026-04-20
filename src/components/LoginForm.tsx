import { useState } from 'react';
import { api, cn } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from '@tanstack/react-router';
import { useUserStore } from '@/stores/useUserStore';
import { toast } from 'sonner';

interface LoginFormProps {
  className?: string;
  [key: string]: any;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const { setUser } = useUserStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api('/auth/login', false, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || 'Login failed. Please try again.');
        return;
      }

      localStorage.setItem('beca_token', result.token);
      setUser(result);
      toast.success('Login successful!', {
        style: { backgroundColor: 'limegreen', color: 'white' },
      });
      navigate({ to: '/dashboard' });
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('space-y-8', className)} {...props}>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            {/* <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div> */}
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-11"
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}
