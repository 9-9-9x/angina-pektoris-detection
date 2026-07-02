import { Head, Link } from '@inertiajs/react';
import { User, AlertTriangle, FileText, Home, Activity, CheckCircle, Copy, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface Patient {
    nama: string;
    umur: number;
    jenis_kelamin: string;
    durasi_nyeri?: string;
    tekanan_darah?: string;
    tgl_skrining?: string;
    jam_skrining?: string;
    untuk?: string;
}

interface Result {
    prediction: string;
    risk_level: 'HIGH' | 'MODERATE' | 'LOW';
    confidence: number;
    risk_text: string;
}

interface Props {
    prediction_id?: number;
    kode_unik?: string;
    patient?: Patient;
    result?: Result;
}

// ─── Risk category by percentage ───────────────────────────────────────────────

function riskCategory(percentage: number): string {
    if (percentage <= 39) return 'Risiko Rendah';
    if (percentage <= 69) return 'Risiko Sedang';
    return 'Risiko Tinggi';
}

// ─── Risk config ──────────────────────────────────────────────────────────────

const riskConfigs = {
    HIGH: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        iconBg: 'bg-red-500/15',
        iconColor: 'text-red-400',
        textColor: 'text-red-400',
        icon: AlertTriangle,
        label: 'Risiko Tinggi',
    },
    MODERATE: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        iconBg: 'bg-yellow-500/15',
        iconColor: 'text-yellow-400',
        textColor: 'text-yellow-400',
        icon: Activity,
        label: 'Risiko Sedang',
    },
    LOW: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        iconBg: 'bg-green-500/15',
        iconColor: 'text-green-400',
        textColor: 'text-green-400',
        icon: CheckCircle,
        label: 'Risiko Rendah',
    },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ClassificationResult({ prediction_id, kode_unik, patient, result }: Props) {
    const [copied, setCopied] = useState(false);

    const copyKode = () => {
        if (!kode_unik) return;
        navigator.clipboard.writeText(kode_unik);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!patient || !result) {
        return (
            <AppLayout>
                <Head title="Hasil Klasifikasi" />
                <div className="w-full max-w-4xl">
                    <div className="bg-muted rounded-xl border border-border p-12 text-center">
                        <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-lg font-bold text-foreground mb-2">Data Tidak Tersedia</h2>
                        <p className="text-muted-foreground mb-6">Tidak ada data hasil klasifikasi untuk ditampilkan.</p>
                        <Link href="/classify">
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-11">
                                Mulai Klasifikasi
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const risk = riskConfigs[result.risk_level] ?? riskConfigs.LOW;
    const RiskIcon = risk.icon;

    return (
        <AppLayout>
            <Head title="Hasil Klasifikasi" />

            <div className="w-full max-w-4xl space-y-6">
                {/* Patient Info */}
                <div className="bg-card rounded-xl border border-border shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-foreground">{patient.nama}</h1>
                            <p className="text-xs text-muted-foreground">Data Pasien</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Umur</span>
                            <span className="font-medium text-foreground">{patient.umur} Tahun</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Jenis Kelamin</span>
                            <span className="font-medium text-foreground">{patient.jenis_kelamin}</span>
                        </div>
                        {patient.tgl_skrining && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tanggal Skrining</span>
                                <span className="font-medium text-foreground">
                                    {patient.tgl_skrining.includes('-')
                                        ? patient.tgl_skrining.split('-').reverse().join('/')
                                        : patient.tgl_skrining}
                                </span>
                            </div>
                        )}
                        {patient.jam_skrining && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Jam Skrining</span>
                                <span className="font-medium text-foreground">{patient.jam_skrining}</span>
                            </div>
                        )}
                        {patient.durasi_nyeri && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Durasi Nyeri</span>
                                <span className="font-medium text-foreground">{patient.durasi_nyeri}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Kode Unik */}
                {kode_unik && (
                    <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <KeyRound className="w-5 h-5 text-blue-400" />
                            <p className="font-semibold text-blue-300">Kode Unik Skrining</p>
                        </div>
                        <p className="text-xs text-blue-400 mb-3">Simpan kode ini untuk melihat riwayat hasil skrining Anda kapan saja.</p>
                        <div className="flex items-center gap-3">
                            <span className="flex-1 font-mono text-2xl font-bold text-blue-300 tracking-widest bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2 text-center">
                                {kode_unik}
                            </span>
                            <button
                                onClick={copyKode}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                                {copied ? 'Disalin!' : 'Salin'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Classification Result */}
                <div className={`rounded-xl border-2 p-6 ${risk.bg} ${risk.border}`}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className={`p-4 rounded-full ${risk.iconBg} flex-shrink-0`}>
                            <RiskIcon className={`h-10 w-10 ${risk.iconColor}`} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Hasil Klasifikasi</p>
                            <p className={`text-xl font-bold ${risk.textColor}`}>{risk.label}</p>
                            <p className="text-muted-foreground text-sm mt-1">{result.prediction}</p>
                            <div className="flex items-center gap-3 mt-3 justify-center md:justify-start">
                                <p className={`text-4xl font-bold ${risk.textColor}`}>{result.confidence}%</p>
                                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full border ${risk.border} ${risk.textColor}`}>{riskCategory(result.confidence)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Probabilitas Angina Pektoris</p>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="font-semibold text-amber-300">Bukan Diagnosis Medis</p>
                        <p className="text-amber-400 mt-0.5">
                            Hasil ini dihasilkan algoritma machine learning, hanya untuk tujuan riset.
                            Selalu konsultasikan dengan dokter spesialis jantung.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                    {prediction_id ? (
                        <Link href={`/predictions/${prediction_id}/print`} target="_blank">
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-11">
                                <FileText className="w-4 h-4 mr-2" />
                                Cetak PDF
                            </Button>
                        </Link>
                    ) : (
                        <Button disabled className="bg-muted text-muted-foreground px-8 h-11">
                            <FileText className="w-4 h-4 mr-2" />
                            Cetak PDF
                        </Button>
                    )}
                    <Link href="/">
                        <Button variant="outline" className="px-8 h-11">
                            <Home className="w-4 h-4 mr-2" />
                            Beranda
                        </Button>
                    </Link>
                </div>

                <footer className="text-center text-muted-foreground text-sm pb-4">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved.
                </footer>
            </div>
        </AppLayout>
    );
}
