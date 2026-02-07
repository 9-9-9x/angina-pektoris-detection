import { Head, Link } from '@inertiajs/react';
import { Plus, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

interface Patient {
    id: number;
    nama: string;
    no_rm: string;
    umur: number;
    jenis_kelamin: 'L' | 'P';
    predictions_count: number;
    created_at: string;
}

interface Props {
    patients: {
        data: Patient[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function PatientsIndex({ patients }: Props) {
    const data = patients?.data || [];

    return (
        <AppLayout>
            <Head title="Data Pasien" />
            
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Data Pasien</h1>
                        <p className="text-slate-600 mt-1">Kelola data pasien dan riwayat klasifikasi</p>
                    </div>
                    <Link href="/patients/create">
                        <Button className="bg-slate-700 hover:bg-slate-800 text-white flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Tambah Pasien
                        </Button>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Cari pasien berdasarkan nama atau nomor RM..."
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline" className="border-slate-300">
                            Filter
                        </Button>
                    </div>
                </div>

                {/* Patients Table */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-6 gap-4 p-4 bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
                        <div>No. RM</div>
                        <div>Nama Pasien</div>
                        <div>Umur</div>
                        <div>Jenis Kelamin</div>
                        <div>Jumlah Klasifikasi</div>
                        <div className="text-center">Aksi</div>
                    </div>

                    <div className="divide-y divide-slate-200">
                        {data.length > 0 ? (
                            data.map((patient) => (
                                <div 
                                    key={patient.id} 
                                    className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-slate-50"
                                >
                                    <div className="text-slate-600 font-mono">{patient.no_rm}</div>
                                    <div className="text-slate-800 font-medium">{patient.nama}</div>
                                    <div className="text-slate-600">{patient.umur} Tahun</div>
                                    <div className="text-slate-600">
                                        {patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                    </div>
                                    <div className="text-slate-600">
                                        <span className="inline-flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {patient.predictions_count || 0} klasifikasi
                                        </span>
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        <Link href={`/patients/${patient.id}`}>
                                            <Button 
                                                variant="secondary"
                                                size="sm"
                                                className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                                            >
                                                Detail
                                            </Button>
                                        </Link>
                                        <Link href={`/patients/${patient.id}/predict`}>
                                            <Button 
                                                variant="secondary"
                                                size="sm"
                                                className="bg-green-100 hover:bg-green-200 text-green-700"
                                            >
                                                Klasifikasi
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-6 text-center py-12 text-slate-500">
                                <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                <p>Belum ada data pasien</p>
                                <Link href="/patients/create" className="text-blue-600 hover:underline mt-2 inline-block">
                                    Tambah pasien baru
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {patients?.last_page > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                        {Array.from({ length: patients.last_page }, (_, i) => i + 1).map((page) => (
                            <Link
                                key={page}
                                href={`/patients?page=${page}`}
                                className={`px-4 py-2 rounded-lg ${
                                    page === patients.current_page
                                        ? 'bg-slate-700 text-white'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                                }`}
                            >
                                {page}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <footer className="mt-8 text-center text-slate-500 text-sm">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                </footer>
            </div>
        </AppLayout>
    );
}
