import { Head } from '@inertiajs/react';
import { Heart, Activity, Brain, Shield, Users, FileText, Stethoscope, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function About() {
    return (
        <AppLayout>
            <Head title="About" />
            
            <div className="w-full max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="relative">
                            <Heart className="w-12 h-12 text-red-500 fill-red-500" />
                            <Activity className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-700">Tentang Sistem Kami</h1>
                    </div>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Sistem Klasifikasi Angina Pektoris Berbasis AI adalah solusi modern 
                        untuk membantu tenaga medis dalam deteksi dini penyakit jantung koroner.
                    </p>
                </div>

                {/* What is Angina Pektoris */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Stethoscope className="w-8 h-8 text-blue-600" />
                        <h2 className="text-2xl font-bold text-slate-700">Apa itu Angina Pektoris?</h2>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        <strong>Angina Pektoris</strong> adalah kondisi medis yang ditandai dengan nyeri dada 
                        atau rasa tidak nyaman akibat otot jantung yang tidak mendapatkan cukup darah kaya oksigen. 
                        Kondisi ini biasanya disebabkan oleh penyempitan arteri koroner akibat penumpukan plak (aterosklerosis).
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                            <p className="font-semibold text-blue-700">Nyeri Dada</p>
                            <p className="text-sm text-slate-600">Gejala utama</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                            <p className="font-semibold text-blue-700">Sesak Napas</p>
                            <p className="text-sm text-slate-600">Saat aktivitas</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                            <p className="font-semibold text-blue-700">Kelelahan</p>
                            <p className="text-sm text-slate-600">Mudah lelah</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                            <p className="font-semibold text-blue-700">Keringat Dingin</p>
                            <p className="text-sm text-slate-600">Tiba-tiba</p>
                        </div>
                    </div>
                </div>

                {/* How AI Works */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Brain className="w-8 h-8 text-indigo-600" />
                        <h2 className="text-2xl font-bold text-slate-700">Bagaimana AI Bekerja?</h2>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        Sistem kami menggunakan algoritma <strong>Random Forest</strong>, sebuah metode machine learning 
                        yang menganalisis data klinis pasien untuk memprediksi kemungkinan Angina Pektoris. 
                        Model ini telah dilatih menggunakan dataset medis yang relevan.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <span className="font-bold text-blue-600">1</span>
                            </div>
                            <h3 className="font-semibold text-slate-700 mb-2">Input Data</h3>
                            <p className="text-sm text-slate-600">Masukkan data klinis pasien seperti umur, tekanan darah, gejala, dan riwayat medis.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <span className="font-bold text-blue-600">2</span>
                            </div>
                            <h3 className="font-semibold text-slate-700 mb-2">Analisis AI</h3>
                            <p className="text-sm text-slate-600">Sistem menganalisis 12 parameter klinis menggunakan model Random Forest.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <span className="font-bold text-blue-600">3</span>
                            </div>
                            <h3 className="font-semibold text-slate-700 mb-2">Hasil Prediksi</h3>
                            <p className="text-sm text-slate-600">Dapatkan hasil klasifikasi dengan tingkat risiko dan confidence score.</p>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="w-8 h-8 text-green-600" />
                        <h2 className="text-2xl font-bold text-slate-700">Fitur Utama</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Activity className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-700 mb-1">Klasifikasi Cepat</h3>
                                <p className="text-sm text-slate-600">Proses analisis data pasien dalam hitungan detik dengan akurasi tinggi.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-700 mb-1">Privasi Terjamin</h3>
                                <p className="text-sm text-slate-600">Data pasien disimpan dengan aman dan hanya dapat diakses oleh tenaga medis yang berwenang.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-700 mb-1">Manajemen Pasien</h3>
                                <p className="text-sm text-slate-600">Kelola data pasien dan riwayat klasifikasi dengan mudah dalam satu sistem.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-700 mb-1">Laporan PDF</h3>
                                <p className="text-sm text-slate-600">Cetak hasil klasifikasi dalam format PDF untuk dokumentasi medis.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technology Stack */}
                <div className="bg-slate-50 rounded-2xl p-8 mb-8">
                    <h2 className="text-xl font-bold text-slate-700 mb-6 text-center">Teknologi yang Digunakan</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <span className="px-4 py-2 bg-white rounded-full shadow-sm text-slate-600 font-medium">Laravel 11</span>
                        <span className="px-4 py-2 bg-white rounded-full shadow-sm text-slate-600 font-medium">React 18</span>
                        <span className="px-4 py-2 bg-white rounded-full shadow-sm text-slate-600 font-medium">Python</span>
                        <span className="px-4 py-2 bg-white rounded-full shadow-sm text-slate-600 font-medium">FastAPI</span>
                        <span className="px-4 py-2 bg-white rounded-full shadow-sm text-slate-600 font-medium">scikit-learn</span>
                        <span className="px-4 py-2 bg-white rounded-full shadow-sm text-slate-600 font-medium">Tailwind CSS</span>
                        <span className="px-4 py-2 bg-white rounded-full shadow-sm text-slate-600 font-medium">Random Forest</span>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-8">
                    <h2 className="text-xl font-bold text-amber-800 mb-4">⚠️ Peringatan Penting</h2>
                    <p className="text-amber-700 leading-relaxed mb-4">
                        Sistem ini dirancang sebagai <strong>alat bantu diagnostic</strong> dan tidak dimaksudkan 
                        untuk menggantikan penilaian medis profesional. Hasil klasifikasi yang dihasilkan oleh 
                        sistem ini harus selalu dikonfirmasi oleh dokter atau tenaga medis yang berwenang.
                    </p>
                    <ul className="list-disc list-inside text-amber-700 space-y-2">
                        <li>Jangan gunakan hasil sistem ini sebagai satu-satunya dasar untuk diagnosis.</li>
                        <li>Selalu konsultasikan dengan dokter untuk interpretasi hasil yang akurat.</li>
                        <li>Sistem ini tidak dapat mendeteksi semua kondisi medis.</li>
                        <li>Keakuratan sistem bergantung pada kualitas data yang dimasukkan.</li>
                    </ul>
                </div>

                {/* CTA */}
                <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">Siap Menggunakan Sistem?</h2>
                    <p className="mb-6 text-blue-100">Mulai klasifikasi pasien Anda sekarang dan dapatkan hasil analisis AI.</p>
                    <Link href="/classify">
                        <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 h-12 font-semibold">
                            Mulai Klasifikasi
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center text-slate-500 text-sm">
                    <p>2026 Sistem Klasifikasi Angina Pektoris | All rights reserved</p>
                    <p className="mt-1">Dikembangkan untuk membantu tenaga medis dalam deteksi dini penyakit jantung.</p>
                </footer>
            </div>
        </AppLayout>
    );
}
