import { Link, usePage } from '@inertiajs/react';
import { Home, Info, LayoutDashboard, ClipboardList, History, Users, Settings } from 'lucide-react';
import type { SharedData } from '@/types';
import { cn } from '@/lib/utils';

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    activePrefix?: string;
}

const navItems: NavItem[] = [
    { title: 'Home', href: '/', icon: Home },
    { title: 'About', href: '/about', icon: Info },
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Data Pasien', href: '/patients', icon: Users },
    { title: 'Mulai Klasifikasi', href: '/classify', icon: ClipboardList },
    { title: 'Riwayat Klasifikasi', href: '/history', icon: History },
    { title: 'Pengaturan', href: '/settings/profile', icon: Settings, activePrefix: '/settings' },
];

export function AppSidebar() {
    const { url } = usePage<SharedData>();

    return (
        <aside className="w-64 bg-gradient-to-b from-slate-50 to-blue-50 border-r border-slate-200 min-h-[calc(100vh-64px)]">
            <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = item.activePrefix
                        ? url.startsWith(item.activePrefix)
                        : url === item.href || (item.href !== '/' && url.startsWith(item.href + '/'));
                    const Icon = item.icon;
                    
                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                isActive 
                                    ? "bg-slate-700 text-white shadow-md" 
                                    : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
