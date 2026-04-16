import { Head, Link, usePage } from '@inertiajs/react';
import { ClipboardList, History, LayoutDashboard, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';

export default function Home() {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user.role;

    return (
        <AppLayout>
            <Head title="Home" />

            <div className="w-full max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[#4a6fa5] mb-6 leading-tight">
                        Selamat Datang di Sistem Klasifikasi<br />
                        Angina Pektoris Berbasis AI
                    </h1>

                    <p className="text-lg text-slate-600 mb-8 max-w-3xl leading-relaxed">
                        Sistem Klasifikasi Angina Pektoris berbasis AI adalah sistem yang membantu tenaga
                        kesehatan dalam mengklasifikasikan angina pektoris pada pasien secara cepat dan
                        akurat berdasarkan data klinis.
                    </p>

                    <div className="flex gap-4 mb-10">
                        {(role === 'patient' || role === 'doctor') && (
                            <>
                                <Link href="/classify">
                                    <Button
                                        size="lg"
                                        className="bg-[#4a6fa5] hover:bg-[#3d5d8a] text-white px-6 py-6 text-base rounded-md flex items-center gap-2"
                                    >
                                        <ClipboardList className="w-5 h-5" />
                                        Mulai Klasifikasi Angina Pektoris
                                    </Button>
                                </Link>

                                <Link href="/history">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 px-6 py-6 text-base rounded-md flex items-center gap-2"
                                    >
                                        <History className="w-5 h-5" />
                                        Lihat Riwayat Klasifikasi
                                    </Button>
                                </Link>
                            </>
                        )}

                        {role === 'admin' && (
                            <>
                                <Link href="/dashboard">
                                    <Button
                                        size="lg"
                                        className="bg-[#4a6fa5] hover:bg-[#3d5d8a] text-white px-6 py-6 text-base rounded-md flex items-center gap-2"
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        Lihat Dashboard
                                    </Button>
                                </Link>

                                <Link href="/admin/users">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 px-6 py-6 text-base rounded-md flex items-center gap-2"
                                    >
                                        <UserCog className="w-5 h-5" />
                                        Manajemen Pengguna
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-[#e8eef7] rounded-xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#4a6fa5] text-center mb-6">
                        Tentang Angina Pektoris
                    </h2>

                    <p className="text-base text-slate-700 leading-relaxed mb-6 max-w-4xl mx-auto">
                        Angina pektoris adalah nyeri dada atau rasa tidak nyaman akibat otot jantung
                        tidak mendapat cukup darah kaya oksigen, biasanya karena penyempitan arteri koroner
                    </p>

                    <div className="flex justify-center">
                        <Link href="/about">
                            <Button
                                className="bg-[#4a6fa5] hover:bg-[#3d5d8a] text-white px-8 py-2 h-10 rounded-md"
                            >
                                Pelajari Lebih Lanjut
                            </Button>
                        </Link>
                    </div>
                </div>

                <footer className="mt-12 text-center text-slate-400 text-sm">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved.
                </footer>
            </div>
        </AppLayout>
    );
}
