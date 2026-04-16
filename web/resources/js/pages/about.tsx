import { Head } from '@inertiajs/react';
import { Stethoscope, Ban, Wine, Scale, Dumbbell, Brain, Apple, ArrowRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

function PPKButton() {
    return (
        <div className="flex justify-end mt-6">
            <div className="flex rounded-full overflow-hidden text-sm font-semibold shadow-sm">
                <span className="bg-[#c5cae9] text-[#1a237e] px-6 py-2">PPK Angina Pektoris</span>
                <span className="bg-[#e8eaf6] text-[#3949ab] px-5 py-2">Detail</span>
            </div>
        </div>
    );
}

export default function About() {
    return (
        <AppLayout>
            <Head title="About" />
            <div className="w-full space-y-5 py-4">

                {/* Card 1: Apa itu Angina Pektoris? */}
                <div className="bg-white rounded-2xl p-7 shadow-sm">
                    <h2 className="text-lg font-bold text-[#1a237e] mb-5">Apa itu Angina Pektoris?</h2>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 flex justify-center">
                            <img
                                src="/jantung_login_image.png"
                                alt="Jantung"
                                className="max-h-40 object-contain"
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <ArrowRight className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3">
                            <p className="text-center text-xs font-bold text-gray-700 mb-3 tracking-wide">ATHEROSCLEROSIS</p>
                            <div className="flex gap-2">
                                <div className="flex-1 text-center">
                                    <div className="relative h-14 bg-[#f8b4b4] rounded-lg mx-1 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-4 bg-[#f472b6]/40 absolute" />
                                        <div className="w-3 h-full bg-[#f87171]/60 absolute rounded-full" />
                                    </div>
                                    <p className="text-[9px] text-gray-500 mt-1 font-medium">NORMAL ARTERY</p>
                                    <p className="text-[8px] text-gray-400">BLOOD FLOW</p>
                                </div>
                                <div className="flex-1 text-center">
                                    <div className="relative h-14 bg-[#f8b4b4] rounded-lg mx-1 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-4 bg-[#fbbf24]/50 absolute" />
                                        <div className="w-5 h-5 bg-[#d97706] absolute rounded-full top-1 right-2 opacity-70" />
                                        <div className="w-2 h-full bg-[#f87171]/60 absolute rounded-full" />
                                    </div>
                                    <p className="text-[9px] text-gray-500 mt-1 font-medium">ARTERY NARROWED</p>
                                    <p className="text-[8px] text-gray-400">BY PLAQUE</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-[#1a237e] text-center leading-relaxed text-sm">
                        Angina pektoris adalah nyeri dada akibat otot jantung kekurangan darah dan oksigen, biasanya
                        karena penyempitan pembuluh darah koroner (PJK) akibat plak. Angina Pektoris bisa terjadi kapan
                        saja dan pada siapa saja. Nyeri akibat Angina Pektoris ini sering disalahartikan sebagai gejala dari
                        kondisi lain seperti naiknya asam lambung (PPK Angina Pektoris, 2023).
                    </p>
                    <PPKButton />
                </div>

                {/* Card 2: Gejala */}
                <div className="bg-white rounded-2xl p-7 shadow-sm">
                    <h2 className="text-lg font-bold text-[#1a237e] mb-4">Apa sih gejala Angina Pektoris?</h2>
                    <p className="text-[#1a237e] mb-5 ml-2">Gejala utama pada Angina Pektoris berupa nyeri dada yang khas meliputi :</p>
                    <ol className="space-y-5 text-[#1a237e] ml-2">
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
                    <div className="mt-8 text-center text-xs text-gray-400">
                        2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                    </div>
                </div>

                {/* Card 3: Faktor Risiko */}
                <div className="bg-white rounded-2xl p-7 shadow-sm">
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
                            <h2 className="text-lg font-bold text-[#1a237e]">Kenali Faktor Risiko Angina Pektoris</h2>
                            <p className="text-[#1a237e] mt-1 text-sm leading-relaxed">
                                Faktor risiko adalah karakteristik, kondisi, atau perilaku yang
                                meningkatkan kemungkinan seseorang terkena penyakit.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-[#1a237e] text-sm">
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
                <div className="bg-white rounded-2xl p-7 shadow-sm">
                    <h2 className="text-lg font-bold text-[#1a237e] mb-6">Tips Pencegahan dengan gaya hidup sehat</h2>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-[#1a237e] text-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#5c6bc0]">
                                <Stethoscope className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Melakukan pemeriksaan kesehatan secara rutin</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#5c6bc0]">
                                <Apple className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Mengonsumsi makanan dengan gizi seimbang</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#5c6bc0]">
                                <Ban className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Tidak merokok</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#5c6bc0]">
                                <Dumbbell className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Rutin berolahraga</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#5c6bc0]">
                                <Wine className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Tidak mengonsumsi minuman beralkohol</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#5c6bc0]">
                                <Brain className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <span className="leading-snug">Mengolah stress</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#5c6bc0]">
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
