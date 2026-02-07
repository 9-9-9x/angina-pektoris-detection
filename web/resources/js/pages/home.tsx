import { Head, Link, usePage } from '@inertiajs/react';
import { ClipboardList, History, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

export default function Home() {
    return (
        <AppLayout>
            <Head title="Home" />
            
            <div className="w-full max-w-6xl">
                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">
                        Selamat Datang di Sistem Klasifikasi
                    </h1>
                    <h2 className="text-4xl font-bold text-blue-600 mb-6">
                        Angina Pektoris Berbasis AI
                    </h2>
                    
                    <p className="text-lg text-slate-600 mb-8 max-w-3xl leading-relaxed">
                        Sistem Klasifikasi Angina Pektoris berbasis AI adalah sistem yang membantu tenaga 
                        kesehatan dalam mengklasifikasikan angina pektoris pada pasien secara cepat dan 
                        akurat berdasarkan data klinis.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-12">
                        <Link href="/classify">
                            <Button 
                                size="lg" 
                                className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-6 text-lg rounded-lg flex items-center gap-3"
                            >
                                <ClipboardList className="w-6 h-6" />
                                Mulai Klasifikasi Angina Pektoris
                            </Button>
                        </Link>
                        
                        <Link href="/history">
                            <Button 
                                variant="outline"
                                size="lg" 
                                className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 px-6 py-6 text-lg rounded-lg flex items-center gap-3"
                            >
                                <History className="w-6 h-6" />
                                Lihat Riwayat Klasifikasi
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* About Section */}
                <div id="about" className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
                        Tentang Angina Pektoris
                    </h2>
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-sm">
                        <p className="text-lg text-slate-700 leading-relaxed mb-6">
                            Angina pektoris adalah nyeri dada atau rasa tidak nyaman akibat otot jantung 
                            tidak mendapat cukup darah kaya oksigen, biasanya karena penyempitan arteri koroner
                        </p>
                        
                        <div className="flex justify-center">
                            <Button 
                                className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-lg flex items-center gap-2"
                            >
                                Pelajari Lebih Lanjut
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center text-slate-500 text-sm">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                </footer>
            </div>
        </AppLayout>
    );
}
