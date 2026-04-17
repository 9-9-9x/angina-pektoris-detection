import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Activity, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import patientsRoute from '@/routes/patients';
import predictionsRoute from '@/routes/predictions';

interface Patient {
    id: number;
    nama: string;
    no_rm: string;
}

interface Props {
    patient: Patient;
    mlStatus: { status: string; error?: string };
}

const yesNoOptions = [
    { value: 'Ya', label: 'Ya' },
    { value: 'Tidak', label: 'Tidak' },
];

const durasiOptions = [
    '2 menit', '5 menit', '10 menit', '15 menit', '30 menit',
    '1 jam', '2 jam', '1 hari', '2 hari', '3 hari',
];

function SelectField({
    label,
    value,
    onChange,
    options,
    error,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    error?: string;
}) {
    return (
        <div className="grid gap-1.5">
            <Label className="text-slate-700">{label}</Label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                required
            >
                <option value="">Pilih...</option>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default function PredictionsCreate({ patient, mlStatus }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        tekanan_darah: '',
        riwayat_dm: '',
        hipertensi: '',
        riwayat_pjk: '',
        nyeri_dada: '',
        durasi_nyeri: '',
        sesak_napas: '',
        mual: '',
        muntah: '',
        keringat_dingin: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(predictionsRoute.store(patient.id));
    };

    return (
        <AppLayout>
            <Head title="Prediksi Angina" />

            <div className="w-full max-w-3xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={patientsRoute.show(patient.id)}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Prediksi Angina Pektoris</h1>
                        <p className="text-slate-500 text-sm mt-0.5">
                            Pasien: <strong className="text-slate-700">{patient.nama}</strong> &middot; {patient.no_rm}
                        </p>
                    </div>
                </div>

                {/* ML Warning */}
                {mlStatus.status !== 'healthy' && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                            <p className="font-semibold text-amber-800">ML Service Tidak Tersedia</p>
                            <p className="text-amber-700 mt-0.5">
                                {mlStatus.error || 'Tidak dapat terhubung ke layanan prediksi.'} Prediksi menggunakan metode estimasi sebagai pengganti.
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tekanan Darah */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4">Data Klinis</h2>
                        <div className="max-w-xs grid gap-1.5">
                            <Label htmlFor="tekanan_darah" className="text-slate-700">Tekanan Darah Sistolik (mmHg)</Label>
                            <Input
                                id="tekanan_darah"
                                type="number"
                                min="60"
                                max="300"
                                value={data.tekanan_darah}
                                onChange={(e) => setData('tekanan_darah', e.target.value)}
                                placeholder="Contoh: 150"
                                required
                            />
                            {errors.tekanan_darah && <p className="text-xs text-red-500">{errors.tekanan_darah}</p>}
                        </div>
                    </div>

                    {/* Faktor Risiko */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4">Faktor Risiko</h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            <SelectField
                                label="Riwayat Diabetes"
                                value={data.riwayat_dm}
                                onChange={(v) => setData('riwayat_dm', v)}
                                options={yesNoOptions}
                                error={errors.riwayat_dm}
                            />
                            <SelectField
                                label="Hipertensi"
                                value={data.hipertensi}
                                onChange={(v) => setData('hipertensi', v)}
                                options={yesNoOptions}
                                error={errors.hipertensi}
                            />
                            <SelectField
                                label="Riwayat PJK"
                                value={data.riwayat_pjk}
                                onChange={(v) => setData('riwayat_pjk', v)}
                                options={yesNoOptions}
                                error={errors.riwayat_pjk}
                            />
                        </div>
                    </div>

                    {/* Gejala */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 mb-4">Gejala Klinis</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <SelectField
                                label="Nyeri Dada Menjalar ke Lengan"
                                value={data.nyeri_dada}
                                onChange={(v) => setData('nyeri_dada', v)}
                                options={yesNoOptions}
                                error={errors.nyeri_dada}
                            />
                            <SelectField
                                label="Durasi Nyeri"
                                value={data.durasi_nyeri}
                                onChange={(v) => setData('durasi_nyeri', v)}
                                options={durasiOptions.map((o) => ({ value: o, label: o }))}
                                error={errors.durasi_nyeri}
                            />
                            <SelectField
                                label="Sesak Napas"
                                value={data.sesak_napas}
                                onChange={(v) => setData('sesak_napas', v)}
                                options={yesNoOptions}
                                error={errors.sesak_napas}
                            />
                            <SelectField
                                label="Mual"
                                value={data.mual}
                                onChange={(v) => setData('mual', v)}
                                options={yesNoOptions}
                                error={errors.mual}
                            />
                            <SelectField
                                label="Muntah"
                                value={data.muntah}
                                onChange={(v) => setData('muntah', v)}
                                options={yesNoOptions}
                                error={errors.muntah}
                            />
                            <SelectField
                                label="Keringat Dingin"
                                value={data.keringat_dingin}
                                onChange={(v) => setData('keringat_dingin', v)}
                                options={yesNoOptions}
                                error={errors.keringat_dingin}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#4a6fa5] hover:bg-[#3d5d8a] text-white px-6"
                        >
                            <Activity className="mr-2 h-4 w-4" />
                            Analisis Risiko
                        </Button>
                        <Link href={patientsRoute.show(patient.id)}>
                            <Button variant="outline" type="button">Batal</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
