import { Head } from '@inertiajs/react';
import { Stethoscope, Ban, Wine, Scale, Dumbbell, Brain, Apple, ArrowRight, ExternalLink, FileText, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';

function PPKButton() {
    return (
        <div className="flex justify-end mt-6">
            <Dialog>
                <DialogTrigger asChild>
                    <button className="flex rounded-full overflow-hidden text-sm font-semibold shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <span className="bg-primary/20 text-primary px-6 py-2">PPK Angina Pektoris</span>
                        <span className="bg-primary text-primary-foreground px-5 py-2 hover:bg-primary/90 transition-colors">Detail</span>
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl w-full h-[92vh] flex flex-col p-0 gap-0 overflow-hidden [&>button:last-child]:hidden">
                    {/* header */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b bg-muted/40 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground leading-none">PPK Angina Pektoris</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Panduan Praktik Klinis · 2023</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href="/PPK-ANGINA-PECTORIS.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Buka di tab baru
                            </a>
                            <div className="w-px h-4 bg-border" />
                            <DialogClose className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <X className="w-4 h-4" />
                            </DialogClose>
                        </div>
                    </div>

                    {/* pdf viewer */}
                    <iframe
                        src="/PPK-ANGINA-PECTORIS.pdf"
                        className="flex-1 w-full"
                        title="PPK Angina Pektoris"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function About() {
    return (
        <AppLayout>
            <Head title="About" />
            <div className="w-full space-y-5 py-4">

                {/* Card 1: Apa itu Angina Pektoris? */}
                <div className="bg-primary/5 rounded-2xl p-7 shadow-sm border border-primary/10">
                    <h2 className="text-lg font-bold text-foreground mb-5">Apa itu Angina Pektoris?</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-5">
                        <div className="w-full md:w-auto flex justify-center">
                            <img
                                src="/images/about/heart-anatomy.png"
                                alt="Ilustrasi anatomi jantung"
                                className="w-full max-w-[280px] md:max-w-[360px] h-auto object-contain"
                            />
                        </div>
                        <div className="flex items-center justify-center shrink-0 px-2">
                            <div className="hidden md:block h-1 w-16 bg-red-600 rounded-full" />
                            <ArrowRight className="w-10 h-10 text-red-600" strokeWidth={2.5} />
                        </div>
                        <div className="w-full md:w-auto flex justify-center">
                            <img
                                src="/images/about/atherosclerosis-diagram.png"
                                alt="Ilustrasi penyempitan pembuluh darah akibat plak"
                                className="w-full max-w-[320px] md:max-w-[420px] h-auto object-contain"
                            />
                        </div>
                    </div>
                    <p className="text-foreground text-center leading-relaxed text-sm">
                        Angina pektoris adalah nyeri dada akibat otot jantung kekurangan darah dan oksigen, biasanya
                        karena penyempitan pembuluh darah koroner (PJK) akibat plak. Angina Pektoris bisa terjadi kapan
                        saja dan pada siapa saja. Nyeri akibat Angina Pektoris ini sering disalahartikan sebagai gejala dari
                        kondisi lain seperti naiknya asam lambung (PPK Angina Pektoris, 2023).
                    </p>
                    <PPKButton />
                </div>

                {/* Card 2: Gejala */}
                <div className="bg-primary/5 rounded-2xl p-7 shadow-sm border border-primary/10">
                    <h2 className="text-lg font-bold text-foreground mb-4">Apa sih gejala Angina Pektoris?</h2>
                    <p className="text-foreground mb-5 ml-2">Gejala utama pada Angina Pektoris berupa nyeri dada yang khas meliputi :</p>
                    <ol className="space-y-5 text-foreground ml-2">
                        <li className="flex gap-3">
                            <span className="font-medium flex-shrink-0">1.</span>
                            <span className="leading-relaxed">
                                Lokasi nyeri dada (nyeri dada yang menjalar ke leher, bahu, rahang kiri
                                hingga jari-jari, bahkan sampai ke punggung atau pundak kiri).
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-medium flex-shrink-0">2.</span>
                            <span className="leading-relaxed">
                                Jenis nyeri dada (biasanya berupa nyeri tumpul seperti rasa tertindih /
                                berat di dada, rasa tekanan yang kuat dari dalam atau dibawah diagfragma)
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-medium flex-shrink-0">3.</span>
                            <span className="leading-relaxed">
                                Timbulnya nyeri (kenali rasa nyeri dada timbul saat beraktivitas seperti
                                berlari, jalan tergesah-gesah, maupun saat menaiki tangga atau saat tidak
                                beraktivitas seperti tertidur)
                            </span>
                        </li>
                    </ol>
                    <div className="mt-8 text-center text-xs text-muted-foreground">
                        2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                    </div>
                </div>

                {/* Card 3: Faktor Risiko */}
                <div className="bg-primary/5 rounded-2xl p-7 shadow-sm border border-primary/10">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                            <svg viewBox="0 0 80 80" className="w-16 h-16">
                                <polygon points="40,8 76,72 4,72" fill="#f87171" stroke="#ef4444" strokeWidth="2" />
                                <text x="40" y="55" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">!</text>
                                <rect x="18" y="68" width="44" height="14" rx="7" fill="#fbbf24" />
                                <text x="40" y="79" textAnchor="middle" fill="#1a237e" fontSize="9" fontWeight="bold">RISK</text>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Kenali Faktor Risiko Angina Pektoris</h2>
                            <p className="text-foreground mt-1 text-sm leading-relaxed">
                                Faktor risiko adalah karakteristik, kondisi, atau perilaku yang
                                meningkatkan kemungkinan seseorang terkena penyakit.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-foreground text-sm">
                        <div>
                            <p className="font-semibold mb-3">Faktor risiko yang dapat diubah :</p>
                            <ol className="space-y-2">
                                <li>1. Merokok</li>
                                <li>2. Tekanan Hipertensi</li>
                                <li>3. Stress</li>
                                <li>4. Obesitas</li>
                                <li>5. Kadar Kolesterol</li>
                                <li>6. Kadar Gula Darah pada<br />penderita DM</li>
                                <li>7. Aktivitas Fisik</li>
                            </ol>
                        </div>
                        <div>
                            <p className="font-semibold mb-3">Faktor risiko yang tidak dapat diubah :</p>
                            <ol className="space-y-2">
                                <li>1. Usia</li>
                                <li>2. Jenis Kelamin</li>
                                <li>3. Riwayat Keluarga</li>
                            </ol>
                        </div>
                    </div>
                    <PPKButton />
                </div>

                {/* Card 4: Tips Pencegahan */}
                <div className="bg-primary/5 rounded-2xl p-7 shadow-sm border border-primary/10">
                    <h2 className="text-lg font-bold text-foreground mb-6">Tips Pencegahan dengan gaya hidup sehat</h2>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-foreground text-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-primary">
                                <Stethoscope className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Melakukan pemeriksaan kesehatan secara rutin</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-primary">
                                <Apple className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Mengonsumsi makanan dengan gizi seimbang</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-primary">
                                <Ban className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Tidak merokok</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-primary">
                                <Dumbbell className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Rutin berolahraga</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-primary">
                                <Wine className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Tidak mengonsumsi minuman beralkohol</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-primary">
                                <Brain className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Mengolah stress</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-primary">
                                <Scale className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Menjaga berat badan ideal</span>
                        </div>
                    </div>
                    <PPKButton />
                </div>

            </div>
        </AppLayout>
    );
}
