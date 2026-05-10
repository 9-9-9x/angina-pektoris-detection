import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { edit as editPassword } from '@/routes/user-password';
import { edit as editAppearance } from '@/routes/appearance';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    { title: 'Profil', href: edit(), icon: null },
    { title: 'Kata Sandi', href: editPassword(), icon: null },
    { title: 'Tampilan', href: editAppearance(), icon: null },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
                <p className="text-sm text-muted-foreground mt-1">Kelola profil dan pengaturan akun Anda</p>
            </div>

            <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    <aside className="lg:w-52 border-b lg:border-b-0 lg:border-r border-border p-4 bg-muted/40">
                        <nav className="flex flex-row flex-wrap lg:flex-col gap-1">
                            {sidebarNavItems.map((item, index) => (
                                <Link
                                    key={`${toUrl(item.href)}-${index}`}
                                    href={item.href}
                                    className={cn(
                                        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                        isCurrentUrl(item.href)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
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
