import { Head, Link, router } from '@inertiajs/react';
import { Users, Heart, X, ChevronRight, Search, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

interface Prediction {
    id: number;
    kode_unik: string | null;
    patient: { nama: string; umur: number };
    prediction_result: string;
    created_at: string;
    risk_level: string;
}

interface SearchResult {
    id: number;
    kode_unik: string;
    patient: { nama: string; umur: number; jenis_kelamin: string };
    prediction_result: string;
    risk_level: string;
    risk_text: string;
    doctor_verdict: string | null;
    created_at: string;
}

interface Stats {
    total_patients: number;
    angina_count: number;
    non_angina_count: number;
}

interface Props {
    stats: Stats;
    recentPredictions: Prediction[];
    searchResult?: SearchResult | null;
    searchKode?: string;
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    if (diffHour < 24) return `${diffHour} jam yang lalu`;
    if (diffDay === 1) return 'Kemarin';
    return `${diffDay} hari yang lalu`;
}

const riskColors: Record<string, string> = {
    HIGH: 'bg-red-100 text-red-700',
    MODERATE: 'bg-yellow-100 text-yellow-700',
    LOW: 'bg-green-100 text-green-700',
};

export default function Dashboard({ stats, recentPredictions, searchResult, searchKode }: Props) {
    const [kode, setKode] = useState(searchKode ?? '');
    const lastUpdate = recentPredictions?.length > 0 ? timeAgo(recentPredictions[0].created_at) : null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!kode.trim()) return;
        router.get('/dashboard', { kode: kode.trim().toUpperCase() }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    {lastUpdate && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                            Update {lastUpdate}
                        </Badge>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                        <div className="flex items-center gap-3 mb-3">
                            <Users className="w-6 h-6 text-muted-foreground" />
                            <span className="text-muted-foreground font-medium">Total Pasien Masuk</span>
                        </div>
                        <p className="text-4xl font-bold text-foreground">{stats?.total_patients || 0}</p>
                    </div>
                    <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                        <div className="flex items-center gap-3 mb-3">
                            <Heart className="w-6 h-6 text-red-500" />
                            <span className="text-muted-foreground font-medium">Pasien Angina Pektoris</span>
                        </div>
                        <p className="text-4xl font-bold text-foreground">{stats?.angina_count || 0}</p>
                    </div>
                    <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                        <div className="flex items-center gap-3 mb-3">
                            <X className="w-6 h-6 text-muted-foreground" />
                            <span className="text-muted-foreground font-medium">Bukan Pasien Angina</span>
                        </div>
                        <p className="text-4xl font-bold text-foreground">{stats?.non_angina_count || 0}</p>
                    </div>
                </div>

                {/* Search by Kode Unik */}
                <div className="bg-card rounded-xl shadow-md border border-border p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <KeyRound className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-foreground">Cari Hasil Skrining Pasien</h2>
                    </div>
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <Input
                            value={kode}
                            onChange={(e) => setKode(e.target.value.toUpperCase())}
                            placeholder="Masukkan kode unik pasien (contoh: ABC-DEFG-HIJ)"
                            className="font-mono tracking-widest uppercase flex-1 h-11"
                            maxLength={12}
                        />
                        <Button type="submit" className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Search className="w-4 h-4 mr-2" />
                            Cari
                        </Button>
                    </form>

                    {searchKode && !searchResult && (
                        <p className="text-sm text-red-500 mt-3">Kode <strong>{searchKode}</strong> tidak ditemukan.</p>
                    )}

                    {searchResult && (
                        <div className="mt-4 border border-border rounded-xl p-4 bg-muted/40">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-foreground">{searchResult.patient.nama}</p>
                                    <p className="text-sm text-muted-foreground">{searchResult.patient.umur} Tahun &middot; {searchResult.patient.jenis_kelamin}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{searchResult.prediction_result}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${riskColors[searchResult.risk_level] ?? 'bg-gray-100 text-gray-700'}`}>
                                            Risiko {searchResult.risk_text}
                                        </span>
                                        {searchResult.doctor_verdict && (
                                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700">
                                                {searchResult.doctor_verdict}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Link href={`/predictions/${searchResult.id}`}>
                                    <Button size="sm" className="bg-primary/10 hover:bg-primary/20 text-primary">
                                        Lihat Detail
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Classifications */}
                <div className="bg-card rounded-xl shadow-md border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-foreground">Hasil Klasifikasi Terakhir</h2>
                        <Link href="/predictions" className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1">
                            Lihat Semua
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {recentPredictions?.length > 0 ? (
                            recentPredictions.slice(0, 2).map((prediction) => (
                                <div key={prediction.id} className="bg-muted rounded-xl p-4 border border-border">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-xl font-bold text-primary">
                                                {prediction.patient.nama.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{prediction.patient.nama}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {prediction.prediction_result}, {prediction.patient.umur} Th
                                            </p>
                                            {prediction.kode_unik && (
                                                <p className="text-xs font-mono text-blue-600">{prediction.kode_unik}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(prediction.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                        <Link href={`/predictions/${prediction.id}`}>
                                            <Button variant="secondary" size="sm" className="bg-primary/10 hover:bg-primary/20 text-primary">
                                                Detail
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8 text-muted-foreground">
                                Belum ada data klasifikasi
                            </div>
                        )}
                    </div>
                </div>

                <footer className="mt-8 text-center text-muted-foreground text-sm">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                </footer>
            </div>
        </AppLayout>
    );
}
