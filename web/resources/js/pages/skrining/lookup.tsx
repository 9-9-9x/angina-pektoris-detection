import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { KeyRound, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

interface Props {
    error?: string;
}

export default function SkriningLookup({ error: serverError }: Props) {
    const [kode, setKode] = useState('');
    const [clientError, setClientError] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!kode.trim()) return;
        setClientError(false);
        router.visit(`/skrining/${kode.trim().toUpperCase()}`);
    };

    const errorMsg = serverError ?? (clientError ? 'Kode tidak ditemukan. Periksa kembali kode Anda.' : null);

    return (
        <AppLayout>
            <Head title="Cek Hasil Skrining" />

            <div className="w-full max-w-lg mx-auto">
                <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center">
                            <KeyRound className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">Cek Hasil Skrining</h1>
                            <p className="text-sm text-muted-foreground">Masukkan kode unik dari hasil skrining Anda</p>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <Input
                                value={kode}
                                onChange={(e) => { setKode(e.target.value.toUpperCase()); setClientError(false); }}
                                placeholder="Contoh: ABC-DEFG-HIJ"
                                className="font-mono text-lg h-12 tracking-widest text-center uppercase"
                                maxLength={12}
                            />
                            {errorMsg && (
                                <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 flex gap-2">
                                    <span className="text-red-400 text-lg leading-none mt-0.5">⚠</span>
                                    <p className="text-red-400 text-sm">{errorMsg}</p>
                                </div>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={!kode.trim()}
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Cari Hasil Skrining
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
