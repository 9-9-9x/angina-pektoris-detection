import { Head, useForm } from '@inertiajs/react';
import { Heart, Activity, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
            <Head title="Login Tenaga Medis" />

            <div className="min-h-screen w-full flex bg-[#e3ebf6]">
                {/* Left Column */}
                <div className="hidden md:flex md:w-1/2 relative bg-[#1E293B] items-center justify-center overflow-hidden">
                    <img
                        src="/jantung_login_image_2.png"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover scale-[1.03] blur-[6px] opacity-90"
                    />
                    <div className="absolute inset-0 bg-[#2b4266]/10 mix-blend-multiply" />
                    <div className="relative w-[65%] max-w-[420px] aspect-[4/5] bg-white/20 backdrop-blur-md rounded-[40px] p-7 shadow-2xl border border-white/50 flex items-center justify-center z-10">
                        <img
                            src="/jantung_login_image_2.png"
                            alt="Anatomi Jantung"
                            className="w-full h-full object-cover rounded-[28px] shadow-lg"
                        />
                        <div className="absolute top-0 right-[10%] w-[160px] h-[56px] bg-white rounded-full shadow-lg -translate-y-1/2" />
                        <div className="absolute bottom-[10%] left-0 w-[160px] h-[56px] bg-white rounded-full shadow-lg -translate-x-1/2" />
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-center gap-2 mb-10 w-full max-w-[440px]">
                        <div className="flex items-center justify-center gap-4 w-full">
                            <div className="relative flex-shrink-0">
                                <Heart className="w-12 h-12 text-[#ff3355] fill-[#ff3355]" />
                                <Activity className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <h1 className="text-4xl font-bold text-[#668bc0] tracking-tight">Sistem Klasifikasi</h1>
                        </div>
                        <h2 className="text-5xl font-bold text-[#567bb0] tracking-tight text-center">Angina Pektoris</h2>
                    </div>

                    {/* Login Card */}
                    <div className="w-full max-w-[440px] bg-white rounded-[20px] shadow-lg p-10 pb-12">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-5 h-5 text-[#355178]" />
                            <span className="text-sm font-medium text-[#466993]">Portal Tenaga Medis</span>
                        </div>
                        <h2 className="text-5xl leading-tight font-bold text-[#355178] mb-8">Login</h2>

                        {status && (
                            <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-base text-[#466993]">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="h-11 border-[#b5c7e1] text-[#466993] focus:border-[#355178] focus:ring-[#355178] rounded-md px-3"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-base text-[#466993]">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="h-11 border-[#b5c7e1] text-[#466993] focus:border-[#355178] focus:ring-[#355178] rounded-md px-3"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="flex items-center pt-1 pb-1">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                    className="border-[#b5c7e1] rounded-[4px] data-[state=checked]:bg-[#355178] data-[state=checked]:border-[#355178]"
                                />
                                <Label htmlFor="remember" className="ml-2 text-sm font-normal text-[#466993]">
                                    Ingat saya
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-12 mt-4 bg-[#3a5883] hover:bg-[#2c4467] text-white font-medium text-lg rounded-[6px]"
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </form>

                        <p className="mt-6 text-xs text-center text-[#8fa5c0]">
                            Halaman ini khusus untuk dokter dan admin.
                            Akun dikelola oleh administrator sistem.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
