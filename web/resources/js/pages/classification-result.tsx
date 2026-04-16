import { Head, Link } from '@inertiajs/react';
import { User, AlertTriangle, Check, FileText, Home, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
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
    prediction_id?: number;
    patient?: Patient;
    result?: Result;
}

export default function ClassificationResult({ prediction_id, patient, result }: Props) {
    const [saved, setSaved] = useState(false);

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'HIGH': return 'text-red-500';
            case 'MODERATE': return 'text-amber-500';
            case 'LOW': return 'text-emerald-500';
            default: return 'text-slate-500';
        }
    };

    const getRiskBg = (level: string) => {
        switch (level) {
            case 'HIGH': return 'from-red-50 to-red-100/50 border-red-200';
            case 'MODERATE': return 'from-amber-50 to-yellow-100/50 border-amber-200';
            case 'LOW': return 'from-emerald-50 to-green-100/50 border-emerald-200';
            default: return 'from-slate-50 to-slate-100/50 border-slate-200';
        }
    };

    const getRiskIcon = (level: string) => {
        switch (level) {
            case 'HIGH': return 'bg-red-100 text-red-500';
            case 'MODERATE': return 'bg-amber-100 text-amber-500';
            case 'LOW': return 'bg-emerald-100 text-emerald-500';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    const getResultLabel = (prediction: string) => {
        return prediction === 'Angina Pektoris'
            ? 'Pasien Terklasifikasi Angina Pektoris'
            : 'Pasien Terklasifikasi Bukan Angina Pektoris';
    };

    if (!patient || !result) {
        return (
            <AppLayout>
                <Head title="Hasil Klasifikasi" />
                <div className="w-full max-w-5xl mx-auto py-8">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-lg p-12 text-center">
                        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-700 mb-2">Data Tidak Tersedia</h2>
                        <p className="text-slate-500 mb-6">Tidak ada data hasil klasifikasi untuk ditampilkan.</p>
                        <Link href="/classify">
                            <Button className="bg-[#3d4f6f] hover:bg-[#2e3d56] text-white rounded-lg px-10 h-12">
                                Mulai Klasifikasi
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Hasil Klasifikasi" />

            <div className="w-full max-w-5xl mx-auto py-4 space-y-8">
                {/* Patient Info Card */}
                <div className="bg-gradient-to-br from-white to-blue-50/80 rounded-2xl shadow-md border border-slate-100 px-8 pt-6 pb-6">
                    {/* Name row */}
                    <div className="flex items-center gap-4 mb-1">
                        <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{patient.nama}</h1>
                    </div>

                    {/* Blue accent line */}
                    <div className="h-[2px] bg-gradient-to-r from-blue-400 via-blue-300 to-transparent rounded-full mb-5 mt-3" />

                    {/* Patient details grid */}
                    <div className="grid grid-cols-2 gap-x-16 gap-y-3 px-2">
                        <div className="flex items-baseline justify-between">
                            <span className="text-slate-500 text-[15px]">Umur</span>
                            <span className="text-slate-800 font-medium text-[15px]">{patient.umur} Tahun</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-slate-500 text-[15px]">Durasi Nyeri</span>
                            <span className="text-slate-800 font-medium text-[15px]">{patient.durasi_nyeri}</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-slate-500 text-[15px]">Jenis Kelamin</span>
                            <span className="text-slate-800 font-medium text-[15px]">{patient.jenis_kelamin}</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-slate-500 text-[15px]">Tekanan Darah</span>
                            <span className="text-slate-800 font-medium text-[15px]">{patient.tekanan_darah}</span>
                        </div>
                    </div>
                </div>

                {/* Classification Result Card */}
                <div className={`bg-gradient-to-br ${getRiskBg(result.risk_level)} rounded-2xl border shadow-md px-8 py-8`}>
                    <div className="text-center space-y-5">
                        {/* Risk icon badge */}
                        <div className={`w-16 h-16 rounded-full ${getRiskIcon(result.risk_level)} flex items-center justify-center mx-auto`}>
                            <ShieldAlert className="w-8 h-8" />
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-slate-400 font-medium tracking-widest uppercase">Hasil Klasifikasi</p>
                            <h3 className="text-3xl font-bold text-[#3d4f6f] leading-snug">
                                {getResultLabel(result.prediction)}
                            </h3>
                        </div>

                        {/* Risk & Confidence */}
                        <div className="flex items-center justify-center gap-8 pt-2">
                            <div className="text-center">
                                <p className="text-sm text-slate-500 mb-1">Tingkat Risiko</p>
                                <p className={`text-2xl font-bold ${getRiskColor(result.risk_level)}`}>
                                    {result.risk_text}
                                </p>
                            </div>
                            <div className="w-px h-12 bg-slate-300" />
                            <div className="text-center">
                                <p className="text-sm text-slate-500 mb-1">Confidence</p>
                                <p className="text-2xl font-bold text-slate-700">
                                    {result.confidence}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-5 py-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-amber-800 text-sm">Penting: Bukan Diagnosis Medis</p>
                            <p className="text-amber-700/80 text-sm mt-1 leading-relaxed">
                                Hasil ini dihasilkan oleh algoritma machine learning dan hanya untuk tujuan riset.
                                Selalu konsultasikan dengan dokter spesialis jantung untuk evaluasi medis yang tepat.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-5 pt-2 pb-8">
                    <Button
                        onClick={() => setSaved(true)}
                        disabled={saved}
                        className={`rounded-lg px-10 h-12 text-[15px] font-medium shadow-sm transition-all ${
                            saved
                                ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                                : 'bg-[#3d4f6f] hover:bg-[#2e3d56] text-white'
                        }`}
                    >
                        {saved ? (<><Check className="w-4 h-4 mr-2" />Tersimpan</>) : 'Simpan'}
                    </Button>
                    {prediction_id ? (
                        <Link href={`/predictions/${prediction_id}/print`} target="_blank">
                            <Button className="bg-[#3d4f6f] hover:bg-[#2e3d56] text-white rounded-lg px-10 h-12 text-[15px] font-medium shadow-sm">
                                <FileText className="w-4 h-4 mr-2" />
                                Cetak PDF
                            </Button>
                        </Link>
                    ) : (
                        <Button disabled className="bg-slate-400 text-white rounded-lg px-10 h-12 text-[15px] font-medium shadow-sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Cetak PDF
                        </Button>
                    )}
                    <Link href="/">
                        <Button className="bg-[#3d4f6f] hover:bg-[#2e3d56] text-white rounded-lg px-10 h-12 text-[15px] font-medium shadow-sm">
                            <Home className="w-4 h-4 mr-2" />
                            Kembali ke Beranda
                        </Button>
                    </Link>
                </div>

                {/* Footer */}
                <footer className="text-center text-slate-400 text-sm pb-4">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved.
                </footer>
            </div>
        </AppLayout>
    );
}
