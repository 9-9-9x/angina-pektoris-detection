import { Head, Link } from '@inertiajs/react';
import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface Classification {
    id: number;
    nama: string;
    umur: number;
    hasil: string;
}

interface Props {
    classifications: Classification[];
}

export default function ClassificationHistory({ classifications }: Props) {
    return (
        <AppLayout>
            <Head title="Riwayat Klasifikasi" />

            <div className="w-full max-w-6xl">
                {/* Title */}
                <h1 className="text-2xl font-bold text-slate-700 mb-6">Kasus Pasien</h1>

                {/* Table Card */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-4 p-4 bg-slate-100/50 text-slate-700 font-medium">
                        <div>Nama Pasien</div>
                        <div>Usia</div>
                        <div>Hasil</div>
                        <div className="text-center">Action</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-slate-200">
                        {classifications?.length > 0 ? (
                            classifications.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`grid grid-cols-4 gap-4 p-4 items-center ${
                                        index % 2 === 0 ? 'bg-blue-100/50' : 'bg-slate-50/50'
                                    }`}
                                >
                                    <div className="text-slate-700 font-medium">{item.nama}</div>
                                    <div className="text-slate-700">{item.umur} Th</div>
                                    <div className="text-slate-700">{item.hasil}</div>
                                    <div className="flex justify-center">
                                        <Link href={`/predictions/${item.id}`}>
                                            <Button
                                                variant="secondary"
                                                className="bg-blue-200 hover:bg-blue-300 text-slate-700 px-8"
                                            >
                                                Detail
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <FileX className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600 font-medium text-lg mb-2">Belum ada data klasifikasi</p>
                                <p className="text-slate-500 mb-6">Mulai klasifikasi pasien untuk melihat riwayat di sini.</p>
                                <Link href="/classify">
                                    <Button className="bg-slate-700 hover:bg-slate-800 text-white">
                                        Mulai Klasifikasi
                                    </Button>
                                </Link>
                            </div>
                        )}
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
