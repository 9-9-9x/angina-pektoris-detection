import { Head, Link } from '@inertiajs/react';
import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface Classification {
    id: number;
    kode_unik: string | null;
    nama: string;
    umur: number;
    hasil: string;
    risk_level: string;
    doctor_verdict: string | null;
    created_at: string;
}

interface Props {
    classifications: Classification[];
}

const riskColors: Record<string, string> = {
    HIGH: 'text-red-600',
    MODERATE: 'text-yellow-600',
    LOW: 'text-green-600',
};

export default function ClassificationHistory({ classifications }: Props) {
    return (
        <AppLayout>
            <Head title="Riwayat Klasifikasi" />

            <div className="w-full max-w-6xl">
                <h1 className="text-2xl font-bold text-foreground mb-6">Kasus Pasien</h1>

                <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
                    <div className="grid grid-cols-5 gap-4 p-4 bg-muted text-foreground font-medium text-sm">
                        <div>Nama Pasien</div>
                        <div>Kode Unik</div>
                        <div>Usia</div>
                        <div>Hasil</div>
                        <div className="text-center">Action</div>
                    </div>

                    <div className="divide-y divide-border">
                        {classifications?.length > 0 ? (
                            classifications.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`grid grid-cols-5 gap-4 p-4 items-center ${index % 2 === 0 ? 'bg-primary/5' : 'bg-card'}`}
                                >
                                    <div>
                                        <p className="text-foreground font-medium">{item.nama}</p>
                                        {item.doctor_verdict && (
                                            <span className="text-xs text-blue-600 font-medium">✓ Di-acc dokter</span>
                                        )}
                                    </div>
                                    <div className="font-mono text-xs text-blue-600">
                                        {item.kode_unik ?? '-'}
                                    </div>
                                    <div className="text-foreground">{item.umur} Th</div>
                                    <div className={`font-medium ${riskColors[item.risk_level] ?? 'text-foreground'}`}>
                                        {item.hasil}
                                    </div>
                                    <div className="flex justify-center">
                                        <Link href={`/predictions/${item.id}`}>
                                            <Button variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary px-8">
                                                Detail
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <FileX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-foreground font-medium text-lg mb-2">Belum ada data klasifikasi</p>
                                <p className="text-muted-foreground mb-6">Riwayat klasifikasi yang telah di-acc dokter akan muncul di sini.</p>
                            </div>
                        )}
                    </div>
                </div>

                <footer className="mt-12 text-center text-muted-foreground text-sm">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                </footer>
            </div>
        </AppLayout>
    );
}
