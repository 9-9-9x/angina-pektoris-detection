import { Link, usePage } from '@inertiajs/react';
import { Home, Info, LayoutDashboard, ClipboardList, History, Users, Settings, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import type { Role } from '@/types/auth';

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    activePrefix?: string;
    roles?: Role[];
    guestOnly?: boolean;
}

const navItems: NavItem[] = [
    { title: 'Home', href: '/', icon: Home, guestOnly: true },
    { title: 'About', href: '/about', icon: Info, guestOnly: true },
    { title: 'Mulai Klasifikasi', href: '/classify', icon: ClipboardList, guestOnly: true },
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['doctor'] },
    { title: 'Data Pasien', href: '/patients', icon: Users, roles: ['doctor', 'admin'] },
    { title: 'Riwayat Klasifikasi', href: '/history', icon: History, roles: ['doctor', 'admin'] },
    { title: 'Pengaturan', href: '/settings/profile', icon: Settings, activePrefix: '/settings', roles: ['doctor', 'admin'] },
    { title: 'Manajemen Pengguna', href: '/admin/users', icon: UserCog, activePrefix: '/admin/users', roles: ['admin'] },
];

export function AppSidebar() {
    const { url } = usePage<SharedData>();
    const { auth } = usePage<SharedData>().props;
    const userRole = (auth.user?.role ?? null) as Role | null;

    const visibleItems = navItems.filter((item) => {
        if (item.guestOnly) return !userRole;
        if (!item.roles) return true;
        if (!userRole) return false;
        return item.roles.includes(userRole);
    });

    return (
        <aside className="w-64 bg-card border-r border-border shadow-sm min-h-[calc(100vh-64px)]">
            <nav className="p-4 space-y-2">
                {visibleItems.map((item) => {
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
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
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
