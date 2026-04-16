import { Head, Link, useForm } from '@inertiajs/react';
import { Heart, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
            
            <div className="min-h-screen w-full flex bg-[#e3ebf6]">
                
                {/* Left Column - Image with Glassmorphism Overlay */}
                <div className="hidden md:flex md:w-1/2 relative bg-[#1E293B] items-center justify-center overflow-hidden">
                    {/* Blurred Background */}
                    <img 
                        src="/jantung_login_image_2.png" 
                        alt="Background Blur" 
                        className="absolute inset-0 w-full h-full object-cover scale-[1.03] blur-[6px] opacity-90"
                    />
                    
                    {/* Dark/Color Overlay for contrast if needed */}
                    <div className="absolute inset-0 bg-[#2b4266]/10 mix-blend-multiply"></div>
                    
                    {/* Glassmorphism Frame */}
                    <div className="relative w-[65%] max-w-[420px] aspect-[4/5] bg-white/20 backdrop-blur-md rounded-[40px] p-7 shadow-2xl border border-white/50 flex items-center justify-center z-10">
                        
                        {/* Sharp Inner Image */}
                        <img 
                            src="/jantung_login_image_2.png" 
                            alt="Sharp Heart Anatomy" 
                            className="w-full h-full object-cover rounded-[28px] shadow-lg"
                        />
                        
                        {/* Top Right White Pill */}
                        <div className="absolute top-0 right-[10%] w-[160px] h-[56px] bg-white rounded-full shadow-lg -translate-y-1/2"></div>
                        
                        {/* Bottom Left White Pill */}
                        <div className="absolute bottom-[10%] left-0 w-[160px] h-[56px] bg-white rounded-full shadow-lg -translate-x-1/2"></div>
                    </div>
                </div>
                
                {/* Right Column - Form */}
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
                            <h2 className="text-5xl leading-tight font-bold text-[#355178] mb-8">Login</h2>

                            {status && (
                                <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-base text-[#466993]">Username</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="h-11 border-[#b5c7e1] text-[#466993] focus:border-[#355178] focus:ring-[#355178] rounded-md px-3"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-base text-[#466993]">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm font-medium text-[#466993] hover:text-[#355178]"
                                        >
                                            Lupa password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="h-11 border-[#b5c7e1] text-[#466993] focus:border-[#355178] focus:ring-[#355178] rounded-md px-3"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center pt-1 pb-1">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                        className="border-[#b5c7e1] rounded-[4px] data-[state=checked]:bg-[#355178] data-[state=checked]:border-[#355178]"
                                    />
                                    <Label htmlFor="remember" className="ml-2 text-sm font-normal text-[#466993]">
                                        Remember me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-12 mt-4 bg-[#3a5883] hover:bg-[#2c4467] text-white font-medium text-lg rounded-[6px]"
                                >
                                    {processing ? 'Loading...' : 'Login'}
                                </Button>
                            </form>

                            <div className="mt-6 flex items-center justify-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 48 48" className="flex-shrink-0">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                </svg>
                                <p className="text-sm text-[#587399]">
                                    Belum punya akun?{' '}
                                    <Link href={registerRoute()} className="text-[#648ebd] hover:text-[#355178] transition-colors">
                                        Daftar
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}
