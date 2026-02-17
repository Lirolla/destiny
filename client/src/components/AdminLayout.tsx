import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Mic,
  Activity,
  ArrowLeft,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Paths are relative to Router base="/admin"
const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/users", label: "Users", icon: Users },
  { path: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { path: "/feedback", label: "Feedback", icon: MessageSquare },
  { path: "/audiobook-tools", label: "Audiobook Tools", icon: Mic },
  { path: "/activity-log", label: "Activity Log", icon: Activity },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: adminUser } = trpc.admin.me.useQuery(undefined, { retry: false });
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setLocation("/login");
    },
  });

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location === item.path
                : location === item.path || location.startsWith(item.path + "/");
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-border space-y-1">
            <a href="/">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">
                <ArrowLeft className="w-4 h-4 shrink-0" />
                Back to Site
              </div>
            </a>
            <button
              onClick={() => logoutMutation.mutate()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-500 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Logout
            </button>
            <div className="px-3 py-2 text-xs text-muted-foreground">
              Signed in as <span className="font-medium text-foreground">{adminUser?.name || "Admin"}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-sm">Admin</span>
          </div>
          <div className="w-5" />
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
