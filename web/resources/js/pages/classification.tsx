import { Head, useForm } from '@inertiajs/react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

export default function Classification() {
    const { data, setData, post, processing, errors, reset } = useForm({
        // Patient data
        nama: '',
        umur: '',
        jenis_kelamin: 'L',
        
        // Clinical data
        nyeri_dada: 'Ya',
        durasi_nyeri: '',
        durasi_unit: 'Menit',
        sesak_napas: 'Ya',
        keringat_dingin: 'Ya',
        mual: 'Ya',
        muntah: 'Ya',
        tekanan_darah: '',
        hipertensi: 'Ya',
        riwayat_dm: 'Ya',
        riwayat_pjk: 'Ya',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/classify');
    };

    const handleReset = () => {
        reset();
    };

    const RadioGroup = ({ 
        name, 
        value, 
        onChange, 
        options 
    }: { 
        name: string; 
        value: string; 
        onChange: (val: string) => void;
        options: { value: string; label: string }[];
    }) => (
        <div className="flex items-center gap-8">
            {options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                        <input
                            type="radio"
                            name={name}
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={(e) => onChange(e.target.value)}
                            className="peer sr-only"
                        />
                        <div className="w-5 h-5 rounded-full border-2 border-slate-400 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                        </div>
                    </div>
                    <span className="text-slate-700">{opt.label}</span>
                </label>
            ))}
        </div>
    );

    return (
        <AppLayout>
            <Head title="Mulai Klasifikasi" />
            
            <div className="w-full max-w-6xl">
                {/* Form Card */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-slate-700 mb-6 border-b border-slate-300 pb-4">
                        Input Data Pasien
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-0">
                        {/* Nama Pasien */}
                        <div className="py-4 border-b border-slate-300">
                            <Label className="text-slate-700 mb-2 block">Nama Pasien</Label>
                            <Input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="bg-white border-slate-300 h-11"
                                placeholder="Masukkan nama pasien"
                            />
                            {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
                        </div>

                        {/* Umur Pasien */}
                        <div className="py-4 border-b border-slate-300">
                            <div className="flex items-center gap-4">
                                <Label className="text-slate-700 w-32">Umur Pasien</Label>
                                <div className="relative flex-1 max-w-xs">
                                    <Input
                                        type="number"
                                        value={data.umur}
                                        onChange={(e) => setData('umur', e.target.value)}
                                        className="bg-white border-slate-300 h-11 pr-10"
                                        placeholder="Umur"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                            {errors.umur && <p className="text-red-500 text-sm mt-1">{errors.umur}</p>}
                        </div>

                        {/* Jenis Kelamin */}
                        <div className="py-4 border-b border-slate-300">
                            <div className="flex items-center gap-4">
                                <Label className="text-slate-700 w-32">Jenis Kelamin</Label>
                                <RadioGroup
                                    name="jenis_kelamin"
                                    value={data.jenis_kelamin}
                                    onChange={(val) => setData('jenis_kelamin', val)}
                                    options={[
                                        { value: 'L', label: 'Laki-laki' },
                                        { value: 'P', label: 'Perempuan' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Nyeri Dada */}
                        <div className="py-4 border-b border-slate-300">
                            <div className="flex items-center gap-4">
                                <Label className="text-slate-700 w-32">Nyeri Dada</Label>
                                <RadioGroup
                                    name="nyeri_dada"
                                    value={data.nyeri_dada}
                                    onChange={(val) => {
                                        setData((prev) => ({
                                            ...prev,
                                            nyeri_dada: val,
                                            ...(val === 'Tidak' ? { durasi_nyeri: '0', durasi_unit: 'Menit' } : {}),
                                        }));
                                    }}
                                    options={[
                                        { value: 'Ya', label: 'Ya' },
                                        { value: 'Tidak', label: 'Tidak' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Durasi Nyeri - only shown when nyeri_dada is Ya */}
                        {data.nyeri_dada === 'Ya' && (
                            <div className="py-4 border-b border-slate-300">
                                <div className="flex items-center gap-4">
                                    <Label className="text-slate-700 w-32">Durasi Nyeri</Label>
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="relative w-32">
                                            <Input
                                                type="number"
                                                value={data.durasi_nyeri}
                                                onChange={(e) => setData('durasi_nyeri', e.target.value)}
                                                className="bg-white border-slate-300 h-11 pr-8"
                                            />
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        </div>
                                        <RadioGroup
                                            name="durasi_unit"
                                            value={data.durasi_unit}
                                            onChange={(val) => setData('durasi_unit', val)}
                                            options={[
                                                { value: 'Menit', label: 'Menit' },
                                                { value: 'Jam', label: 'Jam' },
                                                { value: 'Hari', label: 'Hari' },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sesak Napas */}
                        <div className="py-4 border-b border-slate-300">
                            <div className="flex items-center gap-4">
                                <Label className="text-slate-700 w-32">Sesak Napas</Label>
                                <RadioGroup
                                    name="sesak_napas"
                                    value={data.sesak_napas}
                                    onChange={(val) => setData('sesak_napas', val)}
                                    options={[
                                        { value: 'Ya', label: 'Ya' },
                                        { value: 'Tidak', label: 'Tidak' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Keringat Dingin */}
                        <div className="py-4 border-b border-slate-300">
                            <div className="flex items-center gap-4">
                                <Label className="text-slate-700 w-32">Keringat Dingin</Label>
                                <RadioGroup
                                    name="keringat_dingin"
                                    value={data.keringat_dingin}
                                    onChange={(val) => setData('keringat_dingin', val)}
                                    options={[
                                        { value: 'Ya', label: 'Ya' },
                                        { value: 'Tidak', label: 'Tidak' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Mual */}
                        <div className="py-4 border-b border-slate-300">
                            <div className="flex items-center gap-4">
                                <Label className="text-slate-700 w-32">Mual</Label>
                                <RadioGroup
                                    name="mual"
                                    value={data.mual}
                                    onChange={(val) => setData('mual', val)}
                                    options={[
                                        { value: 'Ya', label: 'Ya' },
                                        { value: 'Tidak', label: 'Tidak' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Muntah */}
                        <div className="py-4 border-b border-slate-300">
                            <div className="flex items-center gap-4">
                                <Label className="text-slate-700 w-32">Muntah</Label>
                                <RadioGroup
                                    name="muntah"
                                    value={data.muntah}
                                    onChange={(val) => setData('muntah', val)}
                                    options={[
                                        { value: 'Ya', label: 'Ya' },
                                        { value: 'Tidak', label: 'Tidak' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Tekanan Darah */}
                        <div className="py-4 border-b border-slate-300">
                            <div className="flex items-center gap-4">
                                <Label className="text-slate-700 w-32">Tekanan Darah</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        value={data.tekanan_darah}
                                        onChange={(e) => setData('tekanan_darah', e.target.value)}
                                        className="bg-white border-slate-300 h-11 w-32 text-center"
                                        placeholder="120"
                                    />
                                    <span className="text-slate-600">mmHg</span>
                                </div>
                            </div>
                        </div>

                        {/* Riwayat Hipertensi */}
                        <div className="py-4 border-b border-slate-300">
                            <div className="flex items-center gap-4">
                                <Label className="text-slate-700 w-32">Riwayat Hipertensi</Label>
                                <RadioGroup
                                    name="hipertensi"
                                    value={data.hipertensi}
                                    onChange={(val) => setData('hipertensi', val)}
                                    options={[
                                        { value: 'Ya', label: 'Ya' },
                                        { value: 'Tidak', label: 'Tidak' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Riwayat DM */}
                        <div className="py-4 border-b border-slate-300">
                            <div className="flex items-center gap-4">
                                <Label className="text-slate-700 w-32">Riwayat DM</Label>
                                <RadioGroup
                                    name="riwayat_dm"
                                    value={data.riwayat_dm}
                                    onChange={(val) => setData('riwayat_dm', val)}
                                    options={[
                                        { value: 'Ya', label: 'Ya' },
                                        { value: 'Tidak', label: 'Tidak' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Riwayat PJK Terdahulu */}
                        <div className="py-4 border-b border-slate-300">
                            <div className="flex items-center gap-4">
                                <Label className="text-slate-700 w-40">Riwayat PJK Terdahulu</Label>
                                <RadioGroup
                                    name="riwayat_pjk"
                                    value={data.riwayat_pjk}
                                    onChange={(val) => setData('riwayat_pjk', val)}
                                    options={[
                                        { value: 'Ya', label: 'Ya' },
                                        { value: 'Tidak', label: 'Tidak' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center gap-4 pt-6">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-slate-700 hover:bg-slate-800 text-white px-12 py-2 h-11"
                            >
                                {processing ? 'Loading...' : 'Klasifikasikan'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                className="border-slate-400 text-slate-700 hover:bg-slate-100 px-12 py-2 h-11"
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <footer className="mt-8 text-center text-slate-500 text-sm">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                </footer>
            </div>
        </AppLayout>
    );
}
