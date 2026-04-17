import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login as loginRoute, register as registerRoute } from '@/routes';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Daftar" />

            <div className="min-h-screen bg-muted flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Register Card */}
                    <div className="bg-card rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-foreground text-center mb-8">Lengkapi Data Diri</h2>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <Label htmlFor="name" className="text-foreground">Username</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 h-11"
                                    placeholder="Masukkan username"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-foreground">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 h-11"
                                    placeholder="Masukkan email"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-foreground">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 h-11"
                                    placeholder="Masukkan password"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation" className="text-foreground">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="mt-1 h-11"
                                    placeholder="Konfirmasi password"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium mt-2"
                            >
                                {processing ? 'Loading...' : 'Daftar'}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Sudah punya akun?{' '}
                            <Link href={loginRoute()} className="font-medium text-foreground hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
