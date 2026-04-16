import { Link, usePage } from '@inertiajs/react';
import { Heart, Activity, Home, Info, LogOut } from 'lucide-react';
import type { SharedData } from '@/types';

export function AppHeader() {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="border-b border-border bg-card shadow-sm">
            <div className="flex h-16 items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative">
                        <Heart className="h-8 w-8 fill-red-500 text-red-500" />
                        <Activity className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform text-white" />
                    </div>
                    <span className="text-lg font-semibold text-card-foreground">
                        Sistem Klasifikasi{' '}
                        <span className="font-bold">Angina Pektoris</span>
                    </span>
                </Link>

                {/* Top Navigation */}
                <nav className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Home className="h-5 w-5" />
                        <span>Home</span>
                    </Link>
                    <Link
                        href="/about"
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Info className="h-5 w-5" />
                        <span>About</span>
                    </Link>

                    {auth.user && (
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex items-center gap-2 text-muted-foreground hover:text-destructive"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
