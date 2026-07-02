import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Activity, AlertTriangle, CheckCircle, User, Calendar, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TreesSection, VotingSection, type VotingDetails } from '@/components/decision-tree';
import AppLayout from '@/layouts/app-layout';
import patientsRoute from '@/routes/patients';
import predictionsRoute from '@/routes/predictions';

interface Patient {
    id: number;
    nama: string;
    no_rm: string;
}

interface Prediction {
    id: number;
    created_at: string;
    prediction_result: string;
    prediction_code: number;
    probability_angina: number;
    probability_non_angina: number;
    risk_level: 'LOW' | 'MODERATE' | 'HIGH';
    risk_percentage: number;
    confidence: string;
    usia: number;
    riwayat_dm: string;
    hipertensi: string;
    riwayat_pjk: string;
    nyeri_dada: string;
    durasi_nyeri: string;
    sesak_napas: string;
    mual: string;
    muntah: string;
    patient: Patient;
    doctor_verdict: string | null;
    doctor_notes: string | null;
    verdict_by: number | null;
    verdict_at: string | null;
    verdict_by_user?: { id: number; name: string } | null;
    voting_details: VotingDetails | null;
}

interface Props {
    prediction: Prediction;
    auth: { user: { role: string } };
}

const riskConfigs = {
    HIGH: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        iconBg: 'bg-red-500/15',
        iconColor: 'text-red-400',
        textColor: 'text-red-400',
        icon: AlertTriangle,
        label: 'Risiko Tinggi',
        desc: 'Terdeteksi kemungkinan besar Angina Pektoris',
    },
    MODERATE: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        iconBg: 'bg-yellow-500/15',
        iconColor: 'text-yellow-400',
        textColor: 'text-yellow-400',
        icon: Activity,
        label: 'Risiko Sedang',
        desc: 'Diperlukan pemeriksaan lanjutan',
    },
    LOW: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        iconBg: 'bg-green-500/15',
        iconColor: 'text-green-400',
        textColor: 'text-green-400',
        icon: CheckCircle,
        label: 'Risiko Rendah',
        desc: 'Kemungkinan Angina Pektoris rendah',
    },
};

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
            <p className="text-sm font-medium text-foreground">{value}</p>
        </div>
    );
}

function formatYesNo(val: string) {
    if (val === 'Ya') return <span className="text-red-400 font-semibold">Ya</span>;
    if (val === 'Tidak') return <span className="text-green-400">Tidak</span>;
    return val;
}

export default function PredictionsShow({ prediction, auth }: Props) {
    const risk = riskConfigs[prediction.risk_level] ?? riskConfigs.LOW;
    const RiskIcon = risk.icon;

    const { data, setData, post, processing } = useForm({
        doctor_verdict: '',
        doctor_notes: '',
    });

    const submitVerdict = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/predictions/${prediction.id}/verdict`);
    };

    return (
        <AppLayout>
            <Head title="Hasil Prediksi" />

            <div className="w-full max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={patientsRoute.show(prediction.patient.id)}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Hasil Prediksi</h1>
                        <p className="text-muted-foreground text-sm flex items-center gap-2 mt-0.5">
                            <User className="h-3.5 w-3.5" />
                            {prediction.patient.nama} &middot; {prediction.patient.no_rm}
                            <span className="text-border">|</span>
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(prediction.created_at).toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>

                {/* Risk Result Card */}
                <div className={`rounded-xl border-2 p-6 ${risk.bg} ${risk.border}`}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className={`p-4 rounded-full ${risk.iconBg} flex-shrink-0`}>
                            <RiskIcon className={`h-10 w-10 ${risk.iconColor}`} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <p className={`text-xl font-bold ${risk.textColor}`}>{risk.label}</p>
                            <p className="text-muted-foreground text-sm mt-1">{risk.desc}</p>
                            <p className={`text-4xl font-bold mt-3 ${risk.textColor}`}>{prediction.risk_percentage}%</p>
                            <p className="text-xs text-muted-foreground mt-1">Probabilitas Angina Pektoris</p>
                        </div>
                        <div className="text-center">
                            <span className={`inline-block px-4 py-2 rounded-lg border-2 font-semibold text-sm ${risk.border} ${risk.textColor}`}>
                                {prediction.prediction_result}
                            </span>
                            <p className="text-xs text-muted-foreground mt-2">Confidence: {prediction.confidence}</p>
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

                {/* Voting Section */}
                {prediction.voting_details && <VotingSection voting={prediction.voting_details} />}

                {/* Tree Visualization */}
                {prediction.voting_details?.sample_trees && prediction.voting_details.sample_trees.length > 0 && (
                    <TreesSection trees={prediction.voting_details.sample_trees} />
                )}

                {/* Data Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Clinical Data */}
                    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
                        <h2 className="font-semibold text-foreground mb-4">Data Klinis</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <DataRow label="Usia" value={`${prediction.usia} tahun`} />
                            <DataRow label="Riwayat Diabetes" value={formatYesNo(prediction.riwayat_dm)} />
                            <DataRow label="Hipertensi" value={formatYesNo(prediction.hipertensi)} />
                            <DataRow label="Riwayat PJK" value={formatYesNo(prediction.riwayat_pjk)} />
                            <DataRow label="Durasi Nyeri" value={prediction.durasi_nyeri} />
                        </div>
                    </div>

                    {/* Symptoms */}
                    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
                        <h2 className="font-semibold text-foreground mb-4">Gejala</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <DataRow label="Nyeri Dada" value={formatYesNo(prediction.nyeri_dada)} />
                            <DataRow label="Sesak Napas" value={formatYesNo(prediction.sesak_napas)} />
                            <DataRow label="Mual" value={formatYesNo(prediction.mual)} />
                            <DataRow label="Muntah" value={formatYesNo(prediction.muntah)} />
                        </div>
                    </div>
                </div>

                {/* Doctor Verdict Form */}
                {auth.user.role === 'doctor' && !prediction.doctor_verdict && (
                    <div className="bg-card rounded-xl border border-[#4a6fa5]/30 shadow-sm p-5">
                        <h2 className="font-semibold text-foreground mb-1">Verdict Dokter</h2>
                        <p className="text-sm text-muted-foreground mb-4">Berikan verdict Anda untuk prediksi ini</p>
                        <form onSubmit={submitVerdict} className="space-y-4">
                            <div className="grid gap-1.5">
                                <label className="text-sm font-medium text-foreground">Verdict</label>
                                <select
                                    value={data.doctor_verdict}
                                    onChange={(e) => setData('doctor_verdict', e.target.value)}
                                    className="rounded-lg border border-input bg-card px-3 py-2 text-sm"
                                    required
                                >
                                    <option value="">Pilih verdict...</option>
                                    <option value="Angina Pektoris">Angina Pektoris</option>
                                    <option value="Bukan Angina Pektoris">Bukan Angina Pektoris</option>
                                    <option value="Perlu Pemeriksaan Lanjut">Perlu Pemeriksaan Lanjut</option>
                                </select>
                            </div>
                            <div className="grid gap-1.5">
                                <label className="text-sm font-medium text-foreground">Catatan (opsional)</label>
                                <textarea
                                    value={data.doctor_notes}
                                    onChange={(e) => setData('doctor_notes', e.target.value)}
                                    className="rounded-lg border border-input bg-card px-3 py-2 text-sm"
                                    rows={3}
                                    placeholder="Tambahkan catatan..."
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={processing || !data.doctor_verdict}
                                className="bg-[#4a6fa5] hover:bg-[#3d5d8a] text-white"
                            >
                                Simpan Verdict
                            </Button>
                        </form>
                    </div>
                )}

                {/* Waiting for doctor verdict (admin, view-only) */}
                {auth.user.role === 'admin' && !prediction.doctor_verdict && (
                    <div className="bg-muted rounded-xl border border-border p-5">
                        <h2 className="font-semibold text-foreground mb-1">Verdict Dokter</h2>
                        <p className="text-sm text-muted-foreground">Menunggu verdict dari dokter.</p>
                    </div>
                )}

                {/* Existing Verdict */}
                {prediction.doctor_verdict && (
                    <div className="bg-green-500/10 rounded-xl border border-green-500/30 p-5">
                        <h2 className="font-semibold text-green-400 mb-3">Verdict Dokter</h2>
                        <span className="inline-block px-4 py-1.5 rounded-lg border border-green-500/30 text-green-400 font-semibold text-sm">
                            {prediction.doctor_verdict}
                        </span>
                        {prediction.doctor_notes && (
                            <p className="text-foreground mt-3 text-sm">{prediction.doctor_notes}</p>
                        )}
                        {prediction.verdict_by_user && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Oleh: {prediction.verdict_by_user.name}
                                {prediction.verdict_at && <> &middot; {new Date(prediction.verdict_at).toLocaleString('id-ID')}</>}
                            </p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                    <Link href={predictionsRoute.print(prediction.id)} target="_blank">
                        <Button className="bg-[#4a6fa5] hover:bg-[#3d5d8a] text-white">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak / PDF
                        </Button>
                    </Link>
                    <Link className='hidden' href={predictionsRoute.create(prediction.patient.id)}>
                        <Button variant="outline">
                            <Activity className="mr-2 h-4 w-4" />
                            Prediksi Ulang
                        </Button>
                    </Link>
                    <Link className='hidden' href={patientsRoute.show(prediction.patient.id)}>
                        <Button variant="ghost">Kembali ke Detail Pasien</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
