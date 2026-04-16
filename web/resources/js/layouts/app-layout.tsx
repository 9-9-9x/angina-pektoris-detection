import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: { title: string; href: string }[];
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
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
