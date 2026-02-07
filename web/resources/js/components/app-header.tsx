import { Link, usePage } from '@inertiajs/react';
import { Heart, Activity, Home, Info, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SharedData } from '@/types';

export function AppHeader() {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="bg-white border-b border-slate-200 shadow-sm">
            <div className="px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative">
                        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                        <Activity className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-lg font-semibold text-slate-700">
                        Sistem Klasifikasi <span className="font-bold">Angina Pektoris</span>
                    </span>
                </Link>

                {/* Top Navigation */}
                <nav className="flex items-center gap-6">
                    <Link 
                        href="/" 
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        <span>Home</span>
                    </Link>
                    <Link 
                        href="#about" 
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <Info className="w-5 h-5" />
                        <span>About</span>
                    </Link>
                    
                    {auth.user && (
                        <Link href="/logout" method="post" as="button">
                            <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-red-600">
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </Button>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
