import { Head, useForm } from '@inertiajs/react';
import { Zap, X, ArrowLeft, Check, CornerDownLeft } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

// ─── Quick Mode Step Definitions ─────────────────────────────────────────────

interface StepDef {
    key: string;
    label: string;
    description: string;
    type: 'text' | 'number' | 'yesno' | 'choice' | 'duration';
    placeholder?: string;
    suffix?: string;
    options?: { value: string; label: string; shortcut: string }[];
    skip?: (data: Record<string, string>) => boolean;
}

const STEPS: StepDef[] = [
    {
        key: 'untuk',
        label: 'Skrining untuk siapa?',
        description: 'Pilih apakah skrining ini untuk diri sendiri atau orang lain',
        type: 'choice',
        options: [
            { value: 'diri_sendiri', label: 'Diri Sendiri', shortcut: '1' },
            { value: 'orang_lain', label: 'Orang Lain', shortcut: '2' },
        ],
    },
    {
        key: 'nama',
        label: 'Nama Lengkap',
        description: 'Masukkan nama lengkap pasien',
        type: 'text',
        placeholder: 'Ketik nama lengkap...',
    },
    {
        key: 'umur',
        label: 'Umur Pasien',
        description: 'Masukkan umur pasien dalam tahun',
        type: 'number',
        placeholder: 'Contoh: 65',
        suffix: 'Tahun',
    },
    {
        key: 'jenis_kelamin',
        label: 'Jenis Kelamin',
        description: 'Pilih jenis kelamin pasien',
        type: 'choice',
        options: [
            { value: 'L', label: 'Laki-laki', shortcut: 'L' },
            { value: 'P', label: 'Perempuan', shortcut: 'P' },
        ],
    },
    {
        key: 'nyeri_dada',
        label: 'Nyeri Dada',
        description: 'Apakah pasien mengalami nyeri dada?',
        type: 'yesno',
    },
    {
        key: 'durasi_nyeri',
        label: 'Durasi Nyeri',
        description: 'Berapa lama nyeri berlangsung?',
        type: 'choice',
        options: [
            { value: '<15 menit', label: '< 15 menit', shortcut: '1' },
            { value: '>15 menit', label: '> 15 menit', shortcut: '2' },
        ],
        skip: (data) => data.nyeri_dada === 'Tidak',
    },
    {
        key: 'sesak_napas',
        label: 'Sesak Napas',
        description: 'Apakah pasien mengalami sesak napas?',
        type: 'yesno',
    },
    {
        key: 'mual',
        label: 'Mual',
        description: 'Apakah pasien mengalami mual?',
        type: 'yesno',
    },
    {
        key: 'muntah',
        label: 'Muntah',
        description: 'Apakah pasien mengalami muntah?',
        type: 'yesno',
    },
    {
        key: 'hipertensi',
        label: 'Riwayat Hipertensi',
        description: 'Apakah pasien memiliki riwayat hipertensi?',
        type: 'yesno',
    },
    {
        key: 'riwayat_dm',
        label: 'Riwayat DM',
        description: 'Apakah pasien memiliki riwayat diabetes mellitus?',
        type: 'yesno',
    },
    {
        key: 'riwayat_pjk',
        label: 'Riwayat PJK',
        description: 'Apakah pasien memiliki riwayat penyakit jantung koroner?',
        type: 'yesno',
    },
];

// ─── Quick Mode Modal Component ──────────────────────────────────────────────

function QuickModeModal({
    open,
    onClose,
    data,
    setData,
    onSubmit,
    processing,
}: {
    open: boolean;
    onClose: () => void;
    data: Record<string, string>;
    setData: (key: string, value: string) => void;
    onSubmit: () => void;
    processing: boolean;
}) {
    const [stepIndex, setStepIndex] = useState(0);
    const [isConfirm, setIsConfirm] = useState(false);
    const [flash, setFlash] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get active steps (filter skipped)
    const activeSteps = STEPS.filter((s) => !s.skip || !s.skip(data));
    const totalSteps = activeSteps.length;
    const currentStep = activeSteps[stepIndex];
    const progress = isConfirm ? 100 : ((stepIndex) / totalSteps) * 100;

    // Reset step when opening
    useEffect(() => {
        if (open) {
            setStepIndex(0);
            setIsConfirm(false);
        }
    }, [open]);

    // Auto-focus input on step change
    useEffect(() => {
        if (open && !isConfirm) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [stepIndex, open, isConfirm]);

    const showFlash = useCallback((value: string) => {
        setFlash(value);
        setTimeout(() => setFlash(null), 200);
    }, []);

    const goNext = useCallback(() => {
        if (stepIndex < totalSteps - 1) {
            setStepIndex((i) => i + 1);
        } else {
            setIsConfirm(true);
        }
    }, [stepIndex, totalSteps]);

    const goPrev = useCallback(() => {
        if (isConfirm) {
            setIsConfirm(false);
        } else if (stepIndex > 0) {
            setStepIndex((i) => i - 1);
        }
    }, [isConfirm, stepIndex]);

    const selectAndAdvance = useCallback((key: string, value: string, label: string) => {
        setData(key, value);
        // Handle nyeri_dada → reset durasi
        if (key === 'nyeri_dada' && value === 'Tidak') {
            setData('durasi_nyeri', '');
        }
        showFlash(label);
        setTimeout(goNext, 180);
    }, [setData, showFlash, goNext]);

    // ─── Keyboard handler ────────────────────────────────────────────────

    useEffect(() => {
        if (!open) return;

        const handler = (e: KeyboardEvent) => {
            // Global shortcuts
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }

            // Confirm screen
            if (isConfirm) {
                if (e.key === 'Enter' && !processing) {
                    e.preventDefault();
                    onSubmit();
                }
                if (e.key === 'Backspace' && !(document.activeElement instanceof HTMLInputElement)) {
                    e.preventDefault();
                    goPrev();
                }
                return;
            }

            if (!currentStep) return;

            // Yes/No steps
            if (currentStep.type === 'yesno') {
                const k = e.key.toLowerCase();
                if (k === 'y' || k === '1') {
                    e.preventDefault();
                    selectAndAdvance(currentStep.key, 'Ya', 'Ya');
                } else if (k === 't' || k === '2') {
                    e.preventDefault();
                    selectAndAdvance(currentStep.key, 'Tidak', 'Tidak');
                } else if (k === 'backspace') {
                    e.preventDefault();
                    goPrev();
                }
                return;
            }

            // Choice steps (gender)
            if (currentStep.type === 'choice' && currentStep.options) {
                const k = e.key.toUpperCase();
                const match = currentStep.options.find((o) => o.shortcut === k);
                if (match) {
                    e.preventDefault();
                    selectAndAdvance(currentStep.key, match.value, match.label);
                } else if (e.key === 'Backspace' && !(document.activeElement instanceof HTMLInputElement)) {
                    e.preventDefault();
                    goPrev();
                }
                return;
            }

            // Text / Number steps
            if (['text', 'number'].includes(currentStep.type)) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = (document.activeElement as HTMLInputElement)?.value || data[currentStep.key];
                    if (val) {
                        setData(currentStep.key, val);
                        goNext();
                    }
                } else if (e.key === 'Backspace' && !data[currentStep.key]) {
                    e.preventDefault();
                    goPrev();
                }
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, isConfirm, currentStep, stepIndex, data, processing, goNext, goPrev, selectAndAdvance, onClose, onSubmit, setData]);

    if (!open) return null;

    // ─── Keyboard Hint Badge ─────────────────────────────────────────────

    const Kbd = ({ children }: { children: React.ReactNode }) => (
        <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md bg-muted border border-input text-xs font-mono font-semibold text-muted-foreground shadow-[0_1px_0_1px_rgba(0,0,0,0.05)]">
            {children}
        </kbd>
    );

    // ─── Render ──────────────────────────────────────────────────────────

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
                    {/* Progress bar */}
                    <div className="h-1 bg-muted">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-primary transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 pt-5 pb-2">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mode Cepat</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {!isConfirm && (
                                <span className="text-xs text-muted-foreground font-medium">
                                    {stepIndex + 1} / {totalSteps}
                                </span>
                            )}
                            <button
                                onClick={onClose}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-muted-foreground hover:bg-muted transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6 pt-2 min-h-[240px] flex flex-col">
                        {isConfirm ? (
                            /* ─── Confirm Screen ─────────────────────────────── */
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-foreground mb-1">Konfirmasi Data</h2>
                                <p className="text-sm text-muted-foreground mb-5">Periksa data sebelum mengirim</p>

                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm max-h-[280px] overflow-y-auto pr-2">
                                    <div className="flex justify-between py-1.5 border-b border-border">
                                        <span className="text-muted-foreground">Untuk</span>
                                        <span className="font-medium text-foreground">{data.untuk === 'diri_sendiri' ? 'Diri Sendiri' : 'Orang Lain'}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-border">
                                        <span className="text-muted-foreground">Nama</span>
                                        <span className="font-medium text-foreground">{data.nama}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-border">
                                        <span className="text-muted-foreground">Umur</span>
                                        <span className="font-medium text-foreground">{data.umur} th</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-border">
                                        <span className="text-muted-foreground">Kelamin</span>
                                        <span className="font-medium text-foreground">{data.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-border">
                                        <span className="text-muted-foreground">Nyeri Dada</span>
                                        <span className={`font-medium ${data.nyeri_dada === 'Ya' ? 'text-red-600' : 'text-emerald-600'}`}>{data.nyeri_dada}</span>
                                    </div>
                                    {data.nyeri_dada === 'Ya' && (
                                        <div className="flex justify-between py-1.5 border-b border-border">
                                            <span className="text-muted-foreground">Durasi</span>
                                            <span className="font-medium text-foreground">{data.durasi_nyeri}</span>
                                        </div>
                                    )}
                                    {['sesak_napas', 'mual', 'muntah', 'hipertensi', 'riwayat_dm', 'riwayat_pjk'].map((key) => {
                                        const labels: Record<string, string> = {
                                            sesak_napas: 'Sesak Napas',
                                            mual: 'Mual',
                                            muntah: 'Muntah',
                                            hipertensi: 'Hipertensi',
                                            riwayat_dm: 'Riwayat DM',
                                            riwayat_pjk: 'Riwayat PJK',
                                        };
                                        return (
                                            <div key={key} className="flex justify-between py-1.5 border-b border-border">
                                                <span className="text-muted-foreground">{labels[key]}</span>
                                                <span className={`font-medium ${data[key] === 'Ya' ? 'text-red-600' : 'text-emerald-600'}`}>{data[key]}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Confirm actions */}
                                <div className="flex items-center justify-between mt-6">
                                    <button
                                        onClick={goPrev}
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Kembali
                                    </button>
                                    <Button
                                        onClick={onSubmit}
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-11 text-sm font-semibold shadow-lg shadow-blue-600/20"
                                    >
                                        {processing ? 'Memproses...' : (
                                            <span className="flex items-center gap-2">
                                                <Check className="w-4 h-4" />
                                                Klasifikasikan
                                            </span>
                                        )}
                                    </Button>
                                </div>

                                {/* Keyboard hint */}
                                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Kbd>Enter</Kbd> Kirim
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Kbd>←</Kbd> Kembali
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Kbd>Esc</Kbd> Tutup
                                    </span>
                                </div>
                            </div>
                        ) : currentStep ? (
                            /* ─── Step Content ──────────────────────────────── */
                            <div className="flex-1 flex flex-col">
                                {/* Step label */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-foreground mb-1">{currentStep.label}</h2>
                                    <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                                </div>

                                {/* Flash feedback */}
                                {flash && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-lg font-bold px-6 py-3 rounded-xl shadow-xl animate-in zoom-in-75 duration-150 pointer-events-none z-10">
                                        {flash}
                                    </div>
                                )}

                                {/* Input area */}
                                <div className="flex-1 flex flex-col justify-center">
                                    {/* Text input */}
                                    {currentStep.type === 'text' && (
                                        <div>
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={data[currentStep.key] || ''}
                                                onChange={(e) => setData(currentStep.key, e.target.value)}
                                                placeholder={currentStep.placeholder}
                                                className="w-full text-xl font-medium text-foreground bg-transparent border-0 border-b-2 border-border focus:border-blue-500 focus:ring-0 outline-none pb-3 placeholder:text-border transition-colors"
                                                autoFocus
                                            />
                                        </div>
                                    )}

                                    {/* Number input */}
                                    {currentStep.type === 'number' && (
                                        <div className="flex items-end gap-3">
                                            <input
                                                ref={inputRef}
                                                type="number"
                                                value={data[currentStep.key] || ''}
                                                onChange={(e) => setData(currentStep.key, e.target.value)}
                                                placeholder={currentStep.placeholder}
                                                className="w-40 text-3xl font-bold text-foreground bg-transparent border-0 border-b-2 border-border focus:border-blue-500 focus:ring-0 outline-none pb-2 placeholder:text-border transition-colors text-center"
                                                autoFocus
                                            />
                                            {currentStep.suffix && (
                                                <span className="text-lg text-muted-foreground pb-3">{currentStep.suffix}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Yes/No selection */}
                                    {currentStep.type === 'yesno' && (
                                        <div className="flex gap-4">
                                            {[
                                                { value: 'Ya', label: 'Ya', shortcut: 'Y', color: 'red' },
                                                { value: 'Tidak', label: 'Tidak', shortcut: 'T', color: 'emerald' },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => selectAndAdvance(currentStep.key, opt.value, opt.label)}
                                                    className={`flex-1 relative rounded-xl border-2 py-6 text-center transition-all hover:shadow-md active:scale-95 ${
                                                        data[currentStep.key] === opt.value
                                                            ? opt.color === 'red'
                                                                ? 'border-red-400 bg-red-50 text-red-700'
                                                                : 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                                            : 'border-border bg-background text-muted-foreground hover:border-input'
                                                    }`}
                                                >
                                                    <span className="text-lg font-semibold">{opt.label}</span>
                                                    <span className="absolute top-2.5 right-3">
                                                        <Kbd>{opt.shortcut}</Kbd>
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Choice selection (gender) */}
                                    {currentStep.type === 'choice' && currentStep.options && (
                                        <div className="flex gap-4">
                                            {currentStep.options.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => selectAndAdvance(currentStep.key, opt.value, opt.label)}
                                                    className={`flex-1 relative rounded-xl border-2 py-6 text-center transition-all hover:shadow-md active:scale-95 ${
                                                        data[currentStep.key] === opt.value
                                                            ? 'border-blue-400 bg-blue-50 text-blue-700'
                                                            : 'border-border bg-background text-muted-foreground hover:border-input'
                                                    }`}
                                                >
                                                    <span className="text-lg font-semibold">{opt.label}</span>
                                                    <span className="absolute top-2.5 right-3">
                                                        <Kbd>{opt.shortcut}</Kbd>
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                </div>

                                {/* Navigation + keyboard hints */}
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                                    <button
                                        onClick={goPrev}
                                        disabled={stepIndex === 0}
                                        className={`flex items-center gap-1.5 text-sm transition-colors ${
                                            stepIndex === 0 ? 'text-border cursor-not-allowed' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Kembali
                                    </button>

                                    <div className="flex items-center gap-4">
                                        {(['text', 'number'] as const).includes(currentStep.type as 'text' | 'number') && (
                                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Kbd><CornerDownLeft className="w-3 h-3" /></Kbd> Lanjut
                                            </span>
                                        )}
                                        {currentStep.type === 'yesno' && (
                                            <>
                                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Kbd>Y</Kbd> Ya
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Kbd>T</Kbd> Tidak
                                                </span>
                                            </>
                                        )}
                                        {currentStep.type === 'choice' && currentStep.options?.map((o) => (
                                            <span key={o.shortcut} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Kbd>{o.shortcut}</Kbd> {o.label}
                                            </span>
                                        ))}
                                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Kbd>Esc</Kbd> Tutup
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Classification Page ────────────────────────────────────────────────

export default function Classification() {
    const [quickMode, setQuickMode] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        untuk: '',
        nama: '',
        umur: '',
        jenis_kelamin: '',
        nyeri_dada: '',
        durasi_nyeri: '',
        sesak_napas: '',
        mual: '',
        muntah: '',
        hipertensi: '',
        riwayat_dm: '',
        riwayat_pjk: '',
    });

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        post('/classify');
    };

    const handleQuickSubmit = () => {
        post('/classify', {
            onSuccess: () => setQuickMode(false),
        });
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
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground peer-checked:border-primary peer-checked:bg-primary transition-all" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                        </div>
                    </div>
                    <span className="text-foreground">{opt.label}</span>
                </label>
            ))}
        </div>
    );

    return (
        <AppLayout>
            <Head title="Mulai Klasifikasi" />

            <div className="w-full max-w-6xl">
                {/* Form Card */}
                <div className="bg-gradient-to-br bg-muted rounded-2xl shadow-lg p-8">
                    <div className="flex items-center justify-between mb-6 border-b border-input pb-4">
                        <h1 className="text-2xl font-bold text-foreground">
                            Input Data Pasien
                        </h1>
                        <button
                            type="button"
                            onClick={() => { handleReset(); setQuickMode(true); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-all text-sm font-semibold"
                        >
                            <Zap className="w-4 h-4" />
                            Mode Cepat
                        </button>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 flex gap-3">
                            <span className="text-red-400 mt-0.5 text-lg leading-none">⚠</span>
                            <div className="text-sm">
                                <p className="font-semibold text-red-300 mb-1">Form belum lengkap</p>
                                <ul className="text-red-400 space-y-0.5 list-disc list-inside">
                                    {Object.values(errors).map((msg, i) => (
                                        <li key={i}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-0">
                        {/* Untuk */}
                        <div className="py-4 border-b border-input">
                            <Label className="text-foreground w-36 shrink-0 mb-2 block">Skrining Untuk</Label>
                            <RadioGroup
                                name="untuk"
                                value={data.untuk}
                                onChange={(val) => setData('untuk', val)}
                                options={[
                                    { value: 'diri_sendiri', label: 'Diri Sendiri' },
                                    { value: 'orang_lain', label: 'Orang Lain' },
                                ]}
                            />
                            {errors.untuk && <p className="text-red-500 text-sm mt-1">{errors.untuk}</p>}
                        </div>

                        {/* Nama Pasien */}
                        <div className="py-4 border-b border-input">
                            <Label className="text-foreground mb-2 block">Nama Lengkap</Label>
                            <Input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="bg-background border-input h-11"
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
                        </div>

                        {/* Umur Pasien */}
                        <div className="py-4 border-b border-input">
                            <Label className="text-foreground mb-2 block">Umur Pasien</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 max-w-xs">
                                    <input
                                        type="date"
                                        max={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => {
                                            if (!e.target.value) return;
                                            const birth = new Date(e.target.value);
                                            const today = new Date();
                                            let age = today.getFullYear() - birth.getFullYear();
                                            const m = today.getMonth() - birth.getMonth();
                                            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
                                            setData('umur', String(age));
                                        }}
                                        className="w-full h-11 rounded-md border border-input bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors [color-scheme:dark] cursor-pointer"
                                    />
                                </div>
                                {data.umur && (
                                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2">
                                        <span className="text-2xl font-bold text-primary">{data.umur}</span>
                                        <span className="text-sm text-muted-foreground">Tahun</span>
                                    </div>
                                )}
                            </div>
                            {errors.umur && <p className="text-red-500 text-sm mt-1">{errors.umur}</p>}
                        </div>

                        {/* Jenis Kelamin */}
                        <div className="py-4 border-b border-input">
                            <div className="flex items-center gap-4">
                                <Label className="text-foreground w-36 shrink-0">Jenis Kelamin</Label>
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
                            {errors.jenis_kelamin && <p className="text-red-500 text-sm mt-1">{errors.jenis_kelamin}</p>}
                        </div>

                        {/* Nyeri Dada */}
                        <div className="py-4 border-b border-input">
                            <div className="flex items-center gap-4">
                                <Label className="text-foreground w-36 shrink-0">Nyeri Dada</Label>
                                <RadioGroup
                                    name="nyeri_dada"
                                    value={data.nyeri_dada}
                                    onChange={(val) => {
                                        setData((prev) => ({
                                            ...prev,
                                            nyeri_dada: val,
                                            ...(val === 'Tidak' ? { durasi_nyeri: '' } : {}),
                                        }));
                                    }}
                                    options={[
                                        { value: 'Ya', label: 'Ya' },
                                        { value: 'Tidak', label: 'Tidak' },
                                    ]}
                                />
                            </div>
                            {errors.nyeri_dada && <p className="text-red-500 text-sm mt-1">{errors.nyeri_dada}</p>}
                        </div>

                        {/* Durasi Nyeri - only shown when nyeri_dada is Ya */}
                        {data.nyeri_dada === 'Ya' && (
                            <div className="py-4 border-b border-input">
                                <div className="flex items-center gap-4">
                                    <Label className="text-foreground w-36 shrink-0">Durasi Nyeri</Label>
                                    <RadioGroup
                                        name="durasi_nyeri"
                                        value={data.durasi_nyeri}
                                        onChange={(val) => setData('durasi_nyeri', val)}
                                        options={[
                                            { value: '<15 menit', label: '< 15 menit' },
                                            { value: '>15 menit', label: '> 15 menit' },
                                        ]}
                                    />
                                </div>
                                {errors.durasi_nyeri && <p className="text-red-500 text-sm mt-1">{errors.durasi_nyeri}</p>}
                            </div>
                        )}

                        {/* Sesak Napas */}
                        <div className="py-4 border-b border-input">
                            <div className="flex items-center gap-4">
                                <Label className="text-foreground w-36 shrink-0">Sesak Napas</Label>
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
                            {errors.sesak_napas && <p className="text-red-500 text-sm mt-1">{errors.sesak_napas}</p>}
                        </div>

                        {/* Mual */}
                        <div className="py-4 border-b border-input">
                            <div className="flex items-center gap-4">
                                <Label className="text-foreground w-36 shrink-0">Mual</Label>
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
                            {errors.mual && <p className="text-red-500 text-sm mt-1">{errors.mual}</p>}
                        </div>

                        {/* Muntah */}
                        <div className="py-4 border-b border-input">
                            <div className="flex items-center gap-4">
                                <Label className="text-foreground w-36 shrink-0">Muntah</Label>
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
                            {errors.muntah && <p className="text-red-500 text-sm mt-1">{errors.muntah}</p>}
                        </div>

                        {/* Riwayat Hipertensi */}
                        <div className="py-4 border-b border-input">
                            <div className="flex items-center gap-4">
                                <Label className="text-foreground w-36 shrink-0">Riwayat Hipertensi</Label>
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
                            {errors.hipertensi && <p className="text-red-500 text-sm mt-1">{errors.hipertensi}</p>}
                        </div>

                        {/* Riwayat DM */}
                        <div className="py-4 border-b border-input">
                            <div className="flex items-center gap-4">
                                <Label className="text-foreground w-36 shrink-0">Riwayat DM</Label>
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
                            {errors.riwayat_dm && <p className="text-red-500 text-sm mt-1">{errors.riwayat_dm}</p>}
                        </div>

                        {/* Riwayat PJK Terdahulu */}
                        <div className="py-4 border-b border-input">
                            <div className="flex items-center gap-4">
                                <Label className="text-foreground w-36 shrink-0">Riwayat PJK Terdahulu</Label>
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
                            {errors.riwayat_pjk && <p className="text-red-500 text-sm mt-1">{errors.riwayat_pjk}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center gap-4 pt-6">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-primary hover:bg-primary/90 text-white px-12 py-2 h-11"
                            >
                                {processing ? 'Loading...' : 'Klasifikasikan'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                className="border-muted-foreground text-foreground hover:bg-muted px-12 py-2 h-11"
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <footer className="mt-8 text-center text-muted-foreground text-sm">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                </footer>
            </div>

            {/* Quick Mode Modal */}
            <QuickModeModal
                open={quickMode}
                onClose={() => setQuickMode(false)}
                data={data}
                setData={setData}
                onSubmit={handleQuickSubmit}
                processing={processing}
            />
        </AppLayout>
    );
}
