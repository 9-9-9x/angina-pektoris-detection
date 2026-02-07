import { Head, Link } from '@inertiajs/react';
import { User, FileText, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface Patient {
    nama: string;
    umur: number;
    jenis_kelamin: string;
    durasi_nyeri: string;
    tekanan_darah: string;
}

interface Result {
    prediction: string;
    risk_level: 'HIGH' | 'MODERATE' | 'LOW';
    confidence: number;
    risk_text: string;
}

interface Props {
    patient: Patient;
    result: Result;
}

export default function ClassificationResult({ patient, result }: Props) {
    const getRiskColor = (level: string) => {
        switch (level) {
            case 'HIGH': return 'text-red-600';
            case 'MODERATE': return 'text-yellow-600';
            case 'LOW': return 'text-green-600';
            default: return 'text-slate-600';
        }
    };

    const getRiskText = (level: string) => {
        switch (level) {
            case 'HIGH': return 'Tinggi';
            case 'MODERATE': return 'Sedang';
            case 'LOW': return 'Rendah';
            default: return level;
        }
    };

    return (
        <AppLayout>
            <Head title="Hasil Klasifikasi" />
            
            <div className="w-full max-w-6xl">
                {/* Patient Info Card */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-700">{patient?.nama || 'Tn. Muhammad Taufiq'}</h1>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Umur</span>
                            <span className="text-slate-800 font-medium">{patient?.umur || 75} Tahun</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Durasi Nyeri</span>
                            <span className="text-slate-800 font-medium">{patient?.durasi_nyeri || '45 Menit'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Jenis Kelamin</span>
                            <span className="text-slate-800 font-medium">{patient?.jenis_kelamin || 'Laki-Laki'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Tekanan Darah</span>
                            <span className="text-slate-800 font-medium">{patient?.tekanan_darah || '177/40 mmHg'}</span>
                        </div>
                    </div>
                </div>

                {/* Classification Result */}
                <div className="text-center mb-10">
                    <h2 className="text-xl text-slate-600 mb-4">Hasil Klasifikasi</h2>
                    <h3 className="text-3xl font-bold text-blue-600 mb-6">
                        {result?.prediction || 'Pasien Terklasifikasi Angina Pektoris'}
                    </h3>
                    
                    <p className="text-lg text-slate-700 mb-2">
                        Tingkat Risiko : <span className={`font-bold ${getRiskColor(result?.risk_level || 'HIGH')}`}>
                            {getRiskText(result?.risk_level || 'HIGH')}
                        </span>
                    </p>
                    <p className="text-slate-600">
                        Confidence : {result?.confidence || 95}%
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-6">
                    <Button 
                        className="bg-slate-700 hover:bg-slate-800 text-white px-10 py-3 h-12"
                    >
                        Simpan
                    </Button>
                    <Button 
                        className="bg-slate-700 hover:bg-slate-800 text-white px-10 py-3 h-12 flex items-center gap-2"
                    >
                        <FileText className="w-5 h-5" />
                        Cetak PDF
                    </Button>
                    <Link href="/dashboard">
                        <Button 
                            className="bg-slate-700 hover:bg-slate-800 text-white px-10 py-3 h-12 flex items-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Kembali Ke Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center text-slate-500 text-sm">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                </footer>
            </div>
        </AppLayout>
    );
}
