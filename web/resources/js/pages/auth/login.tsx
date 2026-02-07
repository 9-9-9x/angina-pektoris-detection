import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Heart, Activity } from 'lucide-react';
import { login as loginRoute, register as registerRoute } from '@/routes';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Header with Logo */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="relative">
                            <Heart className="w-12 h-12 text-red-500 fill-red-500" />
                            <Activity className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-slate-600">Sistem Klasifikasi</h1>
                            <h2 className="text-2xl font-bold text-slate-700">Angina Pektoris</h2>
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-4xl font-bold text-slate-700 mb-8">Login</h2>

                        {status && (
                            <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <Label htmlFor="email" className="text-slate-600">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Masukkan email"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-600">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-slate-500 hover:text-slate-700"
                                    >
                                        Lupa password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Masukkan password"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                />
                                <Label htmlFor="remember" className="ml-2 text-sm text-slate-600">
                                    Remember me
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 bg-slate-700 hover:bg-slate-800 text-white font-medium"
                            >
                                {processing ? 'Loading...' : 'Login'}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-600">
                            Belum punya akun?{' '}
                            <Link href={registerRoute()} className="font-medium text-slate-800 hover:underline">
                                Daftar
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
