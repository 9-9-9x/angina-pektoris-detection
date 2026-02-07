import { Head, Link } from '@inertiajs/react';
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
    // Sample data if none provided
    const data = classifications?.length > 0 ? classifications : [
        { id: 1, nama: 'Tn. Rudi Santoso', umur: 60, hasil: 'Angina Pektoris' },
        { id: 2, nama: 'Ny. Husnul Awaliyah', umur: 78, hasil: 'Angina Pektoris' },
        { id: 3, nama: 'Ny. Ngatemi', umur: 80, hasil: 'Angina Pektoris' },
        { id: 4, nama: 'Nn. Rini Amalia', umur: 19, hasil: 'Bukan Angina' },
        { id: 5, nama: 'Tn. Suroso', umur: 65, hasil: 'Angina Pektoris' },
        { id: 6, nama: 'Tn. Rudi Santoso', umur: 60, hasil: 'Angina Pektoris' },
        { id: 7, nama: 'Ny. Sutinah', umur: 75, hasil: 'Bukan Angina' },
        { id: 8, nama: 'Tn. Darma Zakaria', umur: 60, hasil: 'Bukan Angina' },
    ];

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
                        {data.map((item, index) => (
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
                        ))}
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
