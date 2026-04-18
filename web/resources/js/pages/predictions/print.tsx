import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Patient {
    id: number;
    nama: string;
    no_rm: string;
    tanggal_lahir: string;
    jenis_kelamin: 'L' | 'P';
    umur: number;
    alamat: string | null;
    telepon: string | null;
}

interface User { name: string; }

interface Prediction {
    id: number;
    created_at: string;
    prediction_result: string;
    probability_angina: number;
    probability_non_angina: number;
    risk_level: 'LOW' | 'MODERATE' | 'HIGH';
    risk_percentage: number;
    confidence: string;
    usia: number;
    tekanan_darah: number;
    riwayat_dm: string;
    hipertensi: string;
    riwayat_pjk: string;
    nyeri_dada: string;
    durasi_nyeri: string;
    sesak_napas: string;
    mual: string;
    muntah: string;
    keringat_dingin: string;
    patient: Patient;
    user: User;
}

export default function PredictionsPrint({ prediction }: { prediction: Prediction }) {
    const riskLabel = { HIGH: 'TINGGI', MODERATE: 'SEDANG', LOW: 'RENDAH' }[prediction.risk_level] ?? '-';
    const tanggal = format(new Date(prediction.created_at), 'dd MMMM yyyy', { locale: id });
    const waktu = format(new Date(prediction.created_at), 'HH:mm', { locale: id });
    const noDoc = `AP-${String(prediction.id).padStart(5, '0')}`;

    const clinical: [string, string][] = [
        ['Riwayat Diabetes Melitus', prediction.riwayat_dm],
        ['Hipertensi', prediction.hipertensi],
        ['Riwayat Penyakit Jantung Koroner', prediction.riwayat_pjk],
        ['Nyeri Dada Menjalar', prediction.nyeri_dada],
        ['Durasi Nyeri', prediction.durasi_nyeri],
        ['Sesak Napas', prediction.sesak_napas],
        ['Mual', prediction.mual],
        ['Muntah', prediction.muntah],
        ['Keringat Dingin', prediction.keringat_dingin],
    ];

    const p: React.CSSProperties = {
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '11.5pt',
        color: '#111',
        lineHeight: '1.4',
        padding: '0',
        margin: '0',
    };

    const th: React.CSSProperties = {
        padding: '4px 8px',
        backgroundColor: '#ececec',
        border: '1px solid #bbb',
        fontWeight: 'bold',
        fontSize: '10.5pt',
        textAlign: 'left',
    };

    const td: React.CSSProperties = {
        padding: '4px 8px',
        border: '1px solid #bbb',
        fontSize: '10.5pt',
    };

    const label: React.CSSProperties = { color: '#444', width: '42%', padding: '3px 0', verticalAlign: 'top' };
    const colon: React.CSSProperties = { padding: '3px 5px', verticalAlign: 'top', width: '8px' };
    const val: React.CSSProperties = { fontWeight: 500, padding: '3px 0', verticalAlign: 'top' };

    const sec: React.CSSProperties = {
        fontWeight: 'bold',
        fontSize: '10pt',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        borderBottom: '1.5px solid #111',
        paddingBottom: '2px',
        marginBottom: '6px',
        marginTop: '12px',
    };

    return (
        <>
            <Head title={`Hasil Analisis - ${prediction.patient.nama}`} />

            <div style={p}>
                {/* ── Letterhead ── */}
                <div style={{ textAlign: 'center', borderBottom: '3px double #111', paddingBottom: '10px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '14pt', fontWeight: 'bold', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        Sistem Klasifikasi Angina Pektoris
                    </div>
                    <div style={{ fontSize: '10pt', color: '#444', marginTop: '2px' }}>
                        Laporan Hasil Analisis Klinis Berbasis Kecerdasan Buatan
                    </div>
                </div>

                {/* ── Meta ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', color: '#333', marginBottom: '10px' }}>
                    <span>No. Dokumen: <strong>{noDoc}</strong></span>
                    <span>Tanggal: <strong>{tanggal}</strong> &nbsp;|&nbsp; Pukul: <strong>{waktu} WIB</strong></span>
                    <span>Analis: <strong>{prediction.user.name}</strong></span>
                </div>

                {/* ── Top: Patient + Result side by side ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Patient */}
                    <div>
                        <div style={sec}>I. Data Pasien</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5pt' }}>
                            <tbody>
                                {[
                                    ['Nama Lengkap', prediction.patient.nama],
                                    ['No. Urut', prediction.patient.no_rm],
                                    ['Umur', `${prediction.usia} tahun`],
                                    ['Jenis Kelamin', prediction.patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'],
                                    ['Tekanan Darah', `${prediction.tekanan_darah} mmHg`],
                                    ['Tanggal Lahir', prediction.patient.tanggal_lahir ?? '-'],
                                    ...(prediction.patient.alamat ? [['Alamat', prediction.patient.alamat]] : []),
                                ].map(([l, v]) => (
                                    <tr key={l}>
                                        <td style={label}>{l}</td>
                                        <td style={colon}>:</td>
                                        <td style={val}>{v}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Result */}
                    <div>
                        <div style={sec}>II. Hasil Analisis</div>
                        <div style={{ border: '1.5px solid #111', padding: '10px 12px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5pt' }}>
                                <tbody>
                                    {[
                                        ['Hasil Klasifikasi', <strong key="r" style={{ fontSize: '11pt' }}>{prediction.prediction_result}</strong>],
                                        ['Tingkat Risiko', riskLabel],
                                        ['Probabilitas Angina', `${prediction.risk_percentage}%`],
                                        ['Probabilitas Bukan Angina', `${(prediction.probability_non_angina * 100).toFixed(1)}%`],
                                        ['Tingkat Kepercayaan', prediction.confidence],
                                    ].map(([l, v]) => (
                                        <tr key={String(l)}>
                                            <td style={label}>{l}</td>
                                            <td style={colon}>:</td>
                                            <td style={val}>{v}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ── Clinical Data ── */}
                <div style={sec}>III. Data Klinis</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ ...th, width: '36px', textAlign: 'center' }}>No.</th>
                            <th style={th}>Parameter</th>
                            <th style={{ ...th, width: '80px' }}>Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clinical.map(([param, v], i) => (
                            <tr key={i}>
                                <td style={{ ...td, textAlign: 'center' }}>{i + 1}.</td>
                                <td style={td}>{param}</td>
                                <td style={td}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ── Disclaimer ── */}
                <div style={{ border: '1px solid #999', padding: '7px 12px', marginTop: '10px', fontSize: '9.5pt', color: '#333', lineHeight: '1.5' }}>
                    <strong>Catatan Penting:</strong> Hasil ini dihasilkan sistem kecerdasan buatan (Random Forest) sebagai alat bantu
                    diagnosis dan <strong>bukan diagnosis medis definitif</strong>. Selalu konsultasikan kepada dokter spesialis jantung.
                </div>

                {/* ── Signature ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div style={{ textAlign: 'center', width: '180px', fontSize: '10.5pt' }}>
                        <div>Pasien / Wali</div>
                        <div style={{ marginTop: '36px', borderTop: '1px solid #111', paddingTop: '4px' }}>
                            ( {prediction.patient.nama} )
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', width: '180px', fontSize: '10.5pt' }}>
                        <div>{tanggal}</div>
                        <div style={{ marginTop: '2px' }}>Dokter / Analis</div>
                        <div style={{ marginTop: '36px', borderTop: '1px solid #111', paddingTop: '4px' }}>
                            ( {prediction.user.name} )
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div style={{ borderTop: '1px solid #999', marginTop: '14px', paddingTop: '5px', fontSize: '9pt', color: '#555', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Sistem Klasifikasi Angina Pektoris &mdash; Dicetak: {tanggal}, {waktu} WIB</span>
                    <span>{noDoc}</span>
                </div>
            </div>

            {/* Print button */}
            <div className="no-print" style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', gap: '8px' }}>
                <button
                    onClick={() => window.print()}
                    style={{ padding: '10px 20px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                >
                    Cetak / Simpan PDF
                </button>
                <button
                    onClick={() => window.history.back()}
                    style={{ padding: '10px 20px', background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                    Kembali
                </button>
            </div>

            <style>{`
                @page {
                    size: A4 portrait;
                    margin: 18mm 20mm;
                }
                html, body {
                    margin: 0;
                    padding: 0;
                }
                body {
                    padding: 20px 28px;
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                }
                @media print {
                    .no-print { display: none !important; }
                    body { padding: 0; }
                }
            `}</style>
        </>
    );
}
