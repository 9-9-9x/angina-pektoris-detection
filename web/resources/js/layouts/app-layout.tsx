import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: { title: string; href: string }[];
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
            <AppHeader />
            <div className="flex">
                <AppSidebar />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
