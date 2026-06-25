import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Activity, CheckCircle, User, KeyRound, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface Patient {
    nama: string;
    umur: number;
    jenis_kelamin: string;
    untuk: string;
    jam_skrining: string;
    tgl_skrining: string;
}

interface Result {
    prediction: string;
    risk_level: 'HIGH' | 'MODERATE' | 'LOW';
    confidence: number;
    risk_text: string;
}

interface Props {
    prediction_id: number;
    kode_unik: string;
    patient: Patient;
    result: Result;
    doctor_verdict: string | null;
    doctor_notes: string | null;
}

const riskConfigs = {
    HIGH: { bg: 'bg-red-500/10', border: 'border-red-500/30', iconBg: 'bg-red-500/15', iconColor: 'text-red-400', textColor: 'text-red-400', icon: AlertTriangle, label: 'Risiko Tinggi' },
    MODERATE: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', iconBg: 'bg-yellow-500/15', iconColor: 'text-yellow-400', textColor: 'text-yellow-400', icon: Activity, label: 'Risiko Sedang' },
    LOW: { bg: 'bg-green-500/10', border: 'border-green-500/30', iconBg: 'bg-green-500/15', iconColor: 'text-green-400', textColor: 'text-green-400', icon: CheckCircle, label: 'Risiko Rendah' },
};

export default function SkriningShow({ prediction_id, kode_unik, patient, result, doctor_verdict, doctor_notes }: Props) {
    const risk = riskConfigs[result.risk_level] ?? riskConfigs.LOW;
    const RiskIcon = risk.icon;

    return (
        <AppLayout>
            <Head title={`Hasil Skrining — ${kode_unik}`} />

            <div className="w-full max-w-2xl mx-auto space-y-5">
                {/* Kode */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-300 font-medium">Kode Skrining</span>
                    </div>
                    <span className="font-mono font-bold text-blue-300 tracking-widest">{kode_unik}</span>
                </div>

                {/* Patient info */}
                <div className="bg-card rounded-xl border border-border shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-bold text-foreground">{patient.nama}</h2>
                            <p className="text-xs text-muted-foreground">Data Pasien</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Umur</span><span className="font-medium">{patient.umur} Tahun</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Jenis Kelamin</span><span className="font-medium">{patient.jenis_kelamin}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Skrining Untuk</span><span className="font-medium">{patient.untuk === 'diri_sendiri' ? 'Diri Sendiri' : 'Orang Lain'}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Tanggal</span><span className="font-medium">{patient.tgl_skrining?.includes('-') ? patient.tgl_skrining.split('-').reverse().join('/') : patient.tgl_skrining}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Jam</span><span className="font-medium">{patient.jam_skrining}</span></div>
                    </div>
                </div>

                {/* Result */}
                <div className={`rounded-xl border-2 p-6 ${risk.bg} ${risk.border}`}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className={`p-4 rounded-full ${risk.iconBg} flex-shrink-0`}>
                            <RiskIcon className={`h-10 w-10 ${risk.iconColor}`} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Hasil Skrining</p>
                            <p className={`text-xl font-bold ${risk.textColor}`}>{risk.label}</p>
                            <p className="text-muted-foreground text-sm mt-1">{result.prediction}</p>
                            <p className={`text-4xl font-bold mt-3 ${risk.textColor}`}>{result.confidence}%</p>
                            <p className="text-xs text-muted-foreground mt-1">Probabilitas Angina Pektoris</p>
                        </div>
                    </div>
                </div>

                {/* Doctor verdict */}
                {doctor_verdict && (
                    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
                        <h3 className="font-semibold text-foreground mb-3">Keterangan Dokter</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                doctor_verdict === 'Perlu Pemeriksaan Lebih Lanjut'
                                    ? 'bg-red-500/15 text-red-400'
                                    : 'bg-green-500/15 text-green-400'
                            }`}>
                                {doctor_verdict}
                            </span>
                        </div>
                        {doctor_notes && <p className="text-sm text-muted-foreground">{doctor_notes}</p>}
                    </div>
                )}

                {/* Disclaimer */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-400">
                        Hasil ini dihasilkan algoritma machine learning, hanya untuk tujuan riset.
                        Selalu konsultasikan dengan dokter spesialis jantung.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                    <Link href={`/predictions/${prediction_id}/print`} target="_blank">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-11">
                            <FileText className="w-4 h-4 mr-2" />
                            Cetak PDF
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="px-8 h-11">
                            <Home className="w-4 h-4 mr-2" />
                            Beranda
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
