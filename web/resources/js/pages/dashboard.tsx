import { Head, Link } from '@inertiajs/react';
import { Users, Heart, X, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface Prediction {
    id: number;
    patient: {
        nama: string;
        umur: number;
    };
    prediction_result: string;
    created_at: string;
    risk_level: string;
}

interface Stats {
    total_patients: number;
    angina_count: number;
    non_angina_count: number;
}

interface Props {
    stats: Stats;
    recentPredictions: Prediction[];
}

export default function Dashboard({ stats, recentPredictions }: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        Update 5 menit yang lalu
                    </Badge>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    {/* Total Patients */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
                        <div className="flex items-center gap-3 mb-3">
                            <Users className="w-6 h-6 text-slate-600" />
                            <span className="text-slate-600 font-medium">Total Pasien Masuk</span>
                        </div>
                        <p className="text-4xl font-bold text-slate-700">{stats?.total_patients || 0}</p>
                    </div>

                    {/* Angina Patients */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
                        <div className="flex items-center gap-3 mb-3">
                            <Heart className="w-6 h-6 text-red-500" />
                            <span className="text-slate-600 font-medium">Pasien Angina Pektoris</span>
                        </div>
                        <p className="text-4xl font-bold text-slate-700">{stats?.angina_count || 0}</p>
                    </div>

                    {/* Non-Angina Patients */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
                        <div className="flex items-center gap-3 mb-3">
                            <X className="w-6 h-6 text-slate-600" />
                            <span className="text-slate-600 font-medium">Bukan Pasien Angina</span>
                        </div>
                        <p className="text-4xl font-bold text-slate-700">{stats?.non_angina_count || 0}</p>
                    </div>
                </div>

                {/* Recent Classifications */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Hasil Klasifikasi Terakhir</h2>
                        <Link 
                            href="/predictions" 
                            className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"
                        >
                            Lihat Klasifikasi
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {recentPredictions?.length > 0 ? (
                            recentPredictions.slice(0, 2).map((prediction) => (
                                <div 
                                    key={prediction.id} 
                                    className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-xl font-bold text-blue-600">
                                                {prediction.patient.nama.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800">
                                                {prediction.patient.nama}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                {prediction.prediction_result}, {prediction.patient.umur} Th
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">
                                            {new Date(prediction.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <Link href={`/predictions/${prediction.id}`}>
                                            <Button 
                                                variant="secondary" 
                                                size="sm"
                                                className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                                            >
                                                Detail
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8 text-slate-500">
                                Belum ada data klasifikasi
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-8 text-center text-slate-500 text-sm">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                </footer>
            </div>
        </AppLayout>
    );
}
