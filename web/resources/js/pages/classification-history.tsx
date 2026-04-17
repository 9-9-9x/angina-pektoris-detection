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
                <h1 className="text-2xl font-bold text-foreground mb-6">Kasus Pasien</h1>

                {/* Table Card */}
                <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-4 p-4 bg-muted text-foreground font-medium">
                        <div>Nama Pasien</div>
                        <div>Usia</div>
                        <div>Hasil</div>
                        <div className="text-center">Action</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-border">
                        {classifications?.length > 0 ? (
                            classifications.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`grid grid-cols-4 gap-4 p-4 items-center ${
                                        index % 2 === 0 ? 'bg-primary/5' : 'bg-card'
                                    }`}
                                >
                                    <div className="text-foreground font-medium">{item.nama}</div>
                                    <div className="text-foreground">{item.umur} Th</div>
                                    <div className="text-foreground">{item.hasil}</div>
                                    <div className="flex justify-center">
                                        <Link href={`/predictions/${item.id}`}>
                                            <Button
                                                variant="secondary"
                                                className="bg-primary/10 hover:bg-primary/20 text-primary px-8"
                                            >
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
                                <p className="text-muted-foreground mb-6">Mulai klasifikasi pasien untuk melihat riwayat di sini.</p>
                                <Link href="/classify">
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        Mulai Klasifikasi
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center text-muted-foreground text-sm">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                </footer>
            </div>
        </AppLayout>
    );
}
