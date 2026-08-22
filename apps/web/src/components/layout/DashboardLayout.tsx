"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { APP_NAME } from "@/config/brand";
import { User, LogOut } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Matches', href: '/matches' },
    { name: 'Saved', href: '/saved' },
    { name: 'Applications', href: '/applications' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[var(--bg-color)] border-b border-[var(--border-color)] sticky top-0 z-10">
        <div className="flex items-center space-x-8">
          <Link href="/matches" className="font-bold text-xl text-indigo-600 dark:text-indigo-400">
            {APP_NAME}
          </Link>
          <div className="hidden md:flex space-x-6">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium pb-4 -mb-4 transition-colors ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-primary' 
                      : 'text-[var(--text-secondary)] hover:text-primary dark:hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/profile" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium hover:ring-2 hover:ring-primary transition">
            <User className="w-4 h-4" />
          </Link>
          <button onClick={handleLogout} className="text-[var(--text-secondary)] hover:text-red-500 transition">
            <LogOut className="w-5 h-5" />
          </button>
          <ThemeSwitcher />
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>
    </div>
  );
}
