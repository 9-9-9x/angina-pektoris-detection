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

            {/* Full page — single background */}
            <div className="min-h-screen w-full flex items-center justify-center bg-[#e3ebf6] relative overflow-hidden p-8">

                {/* Blurred IHC bg decoration */}
                <img
                    src="/ihc.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover scale-[1.4] blur-[60px] opacity-20 pointer-events-none"
                />

                {/* Outer wrapper */}
                <div className="relative z-10 flex items-center gap-10 w-full max-w-[960px]">

                    {/* ── Left: IHC card ── */}
                    <div className="hidden md:flex flex-col items-center justify-center relative flex-shrink-0 w-[340px]">
                        {/* Pill top-right */}
                        <div className="absolute top-[-18px] right-[-10px] w-[150px] h-[52px] bg-white rounded-full shadow-md z-20" />
                        {/* Pill bottom-left */}
                        <div className="absolute bottom-[-16px] left-[-20px] w-[120px] h-[46px] bg-white rounded-full shadow-md z-20" />

                        {/* Glass card */}
                        <div className="relative w-full aspect-[3/4] bg-white/50 backdrop-blur-md rounded-[36px] shadow-xl border border-white/60 flex items-center justify-center p-12 z-10">
                            <img
                                src="/ihc.png"
                                alt="IHC Rumah Sakit Perkebunan Jember Klinik"
                                className="w-full object-contain drop-shadow-sm"
                            />
                        </div>
                    </div>

                    {/* ── Right: title + form ── */}
                    <div className="flex-1 flex flex-col items-center">
                        {/* Title */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="relative flex-shrink-0 w-10 h-10">
                                <Heart className="w-10 h-10 text-[#ff3355] fill-[#ff3355]" />
                                <Activity className="w-5 h-5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-2xl font-bold text-[#668bc0]">Sistem Klasifikasi</span>
                                <span className="text-3xl font-bold text-[#3a5883]">Angina Pektoris</span>
                            </div>
                        </div>

                        {/* Form card */}
                        <div className="w-full max-w-[440px] bg-white rounded-[20px] shadow-lg p-10 pb-12">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="w-4 h-4 text-[#355178]" />
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
            </div>
        </>
    );
}
