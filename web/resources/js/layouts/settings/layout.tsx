import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { edit as editPassword } from '@/routes/user-password';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    { title: 'Profil', href: edit(), icon: null },
    { title: 'Kata Sandi', href: editPassword(), icon: null },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
                <p className="text-sm text-slate-500 mt-1">Kelola profil dan pengaturan akun Anda</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    <aside className="lg:w-52 border-b lg:border-b-0 lg:border-r border-slate-100 p-4">
                        <nav className="flex flex-row flex-wrap lg:flex-col gap-1">
                            {sidebarNavItems.map((item, index) => (
                                <Link
                                    key={`${toUrl(item.href)}-${index}`}
                                    href={item.href}
                                    className={cn(
                                        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                        isCurrentUrl(item.href)
                                            ? 'bg-[#4a6fa5] text-white'
                                            : 'text-slate-600 hover:bg-[#4a6fa5]/10 hover:text-[#4a6fa5]'
                                    )}
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    <div className="flex-1 p-8">
                        <section className="space-y-10">
                            {children}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
