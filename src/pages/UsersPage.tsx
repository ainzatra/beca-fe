import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/utils';
import { useUserStore } from '@/stores/useUserStore';
import { toast } from 'sonner';

type Role = 'ADMIN' | 'SURVEYOR';

type User = {
  id: string;
  name: string;
  username: string;
  role: Role;
};

type NewUserPayload = {
  name: string;
  username: string;
  role: Role;
  password: string;
  confirm_password: string;
};

export default function UsersPage() {
  const qc = useQueryClient();
  const currentUser = useUserStore((s) => s.user);
  const isAdmin = currentUser?.role === 'ADMIN';

  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api('/users', true);
      const result = await response.json();
      return result as User[];
    },
  });

  const mutation = useMutation<Response, unknown, NewUserPayload>({
    mutationFn: async (payload: NewUserPayload) =>
      await api('/users', true, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: async (res) => {
      if (res.status === 200 || res.status === 201) {
        toast.success('User created successfully');
        qc.invalidateQueries({ queryKey: ['users'] });
        return;
      }
      const result = await res.json();
      toast.error(result.message);
    },
  });
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('SURVEYOR');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If the logged-in user is an 'admin' (only), force new users to be SURVEYOR
    if (isAdmin && showForm) {
      setRole('SURVEYOR');
    }
  }, [isAdmin, showForm]);

  function resetForm() {
    setName('');
    setUsername('');
    setEmail('');
    setRole('SURVEYOR');
    setPassword('');
    setConfirm('');
    setError(null);
  }

  function handleAdd() {
    // simple validation
    if (!name.trim() || !username.trim() || !password) {
      setError('Please fill required fields');
      return;
    }

    // email validation (trim and simple regex)
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed || !emailRegex.test(emailTrimmed)) {
      setError('Please provide a valid email address');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    const payload = {
      name,
      username,
      role,
      email: emailTrimmed,
      password,
      confirm_password: confirm,
    };
    console.log({ payload });
    mutation.mutate(payload);

    resetForm();
    setShowForm(false);
  }

  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-sm text-muted-foreground">
              Manage application users
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => setShowForm((s) => !s)} size="sm">
              {showForm ? 'Cancel' : 'Add User'}
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="mb-4 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={(v) => {
                    if (!isAdmin) setRole(v as Role);
                  }}
                >
                  <SelectTrigger
                    className={`w-full ${isAdmin ? 'pointer-events-none opacity-70' : ''}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {!isAdmin && <SelectItem value="ADMIN">Admin</SelectItem>}
                    <SelectItem value="SURVEYOR">Surveyor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>

              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive mt-2">{error}</div>
            )}

            <div className="mt-4 flex gap-2">
              <Button onClick={handleAdd}>Create</Button>
              <Button
                variant="ghost"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <tr>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {users
              ? users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell className="capitalize">{u.role}</TableCell>
                  </TableRow>
                ))
              : 'Loading...'}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
