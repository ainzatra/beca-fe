import React, { useState } from 'react';
import Header from '@/components/Header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { useUserStore, type User } from '@/stores/useUserStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/utils';
import { toast } from 'sonner';

export default function SettingsPage() {
  const qc = useQueryClient();
  const currentUser = useUserStore((s) => s.user) as User | null;

  // local editable state for profile
  const [name, setName] = useState(currentUser?.name ?? '');
  const [username, setUsername] = useState(currentUser?.username ?? '');

  // password sheet state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // simple UI errors
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (payload: { name: string; username: string }) =>
      await api(`/users/${currentUser?.id}`, true, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    onSuccess: async (res) => {
      if (res.status !== 200) {
        const result = await res.json();
        toast.error(result.message);
      }
      if (currentUser) {
        const updated = { ...currentUser, name, username };
        useUserStore.getState().setUser(updated);
      }
      toast.success('Profile updated successfully');
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (payload: {
      old: string;
      new: string;
      confirm: string;
    }) =>
      await api(`/users/password/${currentUser?.id}`, true, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    onSuccess: async (res) => {
      if (res.status === 401) {
        const result = await res.json();
        toast.error(result.message);
        return;
      }
      toast.success('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
  });

  if (!currentUser) {
    return (
      <main className="max-w-7xl mx-auto p-4">
        <Header />
        <div className="rounded-lg bg-white p-6 shadow">No user data</div>
      </main>
    );
  }

  function handleProfileSaveConfirmed() {
    // validation
    if (!name.trim() || !username.trim()) {
      setProfileError('Name and username are required');
      return;
    }
    setProfileError(null);
    updateProfileMutation.mutate({
      name: name.trim(),
      username: username.trim(),
    });
  }

  function handlePasswordUpdateConfirmed() {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Password do not match');
      return;
    }
    setPasswordError(null);
    updatePasswordMutation.mutate({
      old: oldPassword,
      new: newPassword,
      confirm: confirmPassword,
    });
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage your account details and password
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={currentUser.email} disabled />
          </div>

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
        </div>

        {profileError && (
          <div className="text-sm text-destructive mt-2">{profileError}</div>
        )}
        {updateProfileMutation.isError && (
          <div className="text-sm text-destructive mt-2">
            Failed to update profile
          </div>
        )}

        <div className="mt-6">
          {/* Confirm dialog: Save profile */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                className="mr-2"
                disabled={updateProfileMutation.isPending}
              >
                Save changes
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm profile update</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to update your name and username?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleProfileSaveConfirmed}>
                  {updateProfileMutation.isPending ? 'Saving...' : 'Confirm'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Password change opens a sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Change password
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Change Password</SheetTitle>
              </SheetHeader>

              <div className="grid gap-3 p-4">
                <div>
                  <Label className="mb-2" htmlFor="old">
                    Current password
                  </Label>
                  <Input
                    id="old"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Current password"
                  />
                </div>

                <div>
                  <Label className="mb-2" htmlFor="new">
                    New password
                  </Label>
                  <Input
                    id="new"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                  />
                </div>

                <div>
                  <Label className="mb-2" htmlFor="confirm">
                    Confirm password
                  </Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                {passwordError && (
                  <div className="text-sm text-destructive">
                    {passwordError}
                  </div>
                )}
              </div>

              <SheetFooter>
                {/* Confirm dialog before sending password update */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="mr-2"
                      disabled={updatePasswordMutation.isPending}
                    >
                      Update password
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Confirm password change
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to change your password? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handlePasswordUpdateConfirmed}
                      >
                        {updatePasswordMutation.isPending
                          ? 'Updating...'
                          : 'Confirm'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  variant="ghost"
                  onClick={() => {
                    // close sheet via DOM: sheet close button exists in the SheetContent as Close; consumers can also rely on user closing it.
                    // Here we simply reset local password fields.
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError(null);
                  }}
                >
                  Cancel
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>

      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Last updated profile info shown above.
        </div>
      </CardFooter>
    </Card>
  );
}
