import { Home, FileText, BarChart2, MessageSquare, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useUserStore } from '@/stores/useUserStore';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from './ui/button';
import { useEffect } from 'react';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    isAdminOnly: false,
    icon: Home,
    iconColor: 'text-[#1E90FF]', // Dodger Blue
  },
  {
    title: 'Campaigns',
    url: '/campaigns',
    isAdminOnly: true,
    icon: FileText,
    iconColor: 'text-[#28A745]', // Green
  },
  {
    title: 'Analytics',
    url: '/analytics',
    isAdminOnly: true,
    icon: BarChart2,
    iconColor: 'text-[#6F42C1]', // Purple
  },
  {
    title: 'Reponses',
    url: '/reponses',
    isAdminOnly: false,
    icon: MessageSquare,
    iconColor: 'text-[#FFA500]', // Orange
  },
  {
    title: 'Users',
    url: '/users',
    isAdminOnly: true,
    icon: Users,
    iconColor: 'text-[#DC3545]', // Red
  },
];

export function AppSidebar() {
  const { user, setUser } = useUserStore();
  const state = useRouterState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.username) {
      navigate({ to: '/' });
    }
  }, [user]);

  const logoutUser = () => {
    setUser({
      id: null,
      username: null,
      role: null,
    });
    navigate({ to: '/' });
  };
  return (
    <Sidebar className="px-4 py-6">
      <SidebarHeader>
        <div className="bg-gradient-to-r from-white to-slate-50 rounded-md p-3 shadow-inner">
          <div className="text-sm font-semibold">{user.username}</div>
          <div className="text-xs text-muted-foreground">
            {user.role?.toUpperCase()}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => {
              const isActive =
                state.location.pathname === item.url ||
                state.location.pathname.startsWith(item.url + '/');
              // hide admin-only items if user is not admin
              if (item.isAdminOnly && user.role !== 'admin') return null;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`hover:shadow-md transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg transform scale-[1.02] hover:bg-primary-hover'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-100'
                    }`}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 px-4 py-6 rounded-xl font-medium text-sm"
                    >
                      {/* Icon */}
                      <span
                        className={`flex-shrink-0 text-muted-foreground text-[${item.iconColor}]`}
                      >
                        <item.icon
                          className={`w-5 h-5 ${
                            isActive
                              ? 'text-white'
                              : item.iconColor || 'text-gray-500'
                          }`}
                        />
                      </span>

                      {/* Title */}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="outline"
                className="border-red-500 hover:bg-red-500 hover:text-white"
                onClick={logoutUser}
              >
                Logout
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
