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

interface User {
    name: string;
}

interface Prediction {
    id: number;
    created_at: string;
    prediction_result: string;
    prediction_code: number;
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

interface Props {
    prediction: Prediction;
}

const s: Record<string, React.CSSProperties> = {
    page: {
        maxWidth: '780px',
        margin: '0 auto',
        padding: '48px 56px',
        fontFamily: '"Times New Roman", Times, serif',
        color: '#1a1a1a',
        fontSize: '13px',
        lineHeight: '1.5',
    },
    header: {
        textAlign: 'center',
        borderBottom: '3px double #1a1a1a',
        paddingBottom: '16px',
        marginBottom: '20px',
    },
    headerTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        margin: '0 0 4px 0',
        textTransform: 'uppercase' as const,
    },
    headerSub: {
        fontSize: '12px',
        margin: '0',
        color: '#444',
    },
    docInfoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        marginBottom: '24px',
        color: '#333',
    },
    sectionTitle: {
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
        borderBottom: '1px solid #1a1a1a',
        paddingBottom: '4px',
        marginBottom: '10px',
        marginTop: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        fontSize: '13px',
    },
    tdLabel: {
        padding: '5px 8px 5px 0',
        width: '38%',
        verticalAlign: 'top' as const,
        color: '#333',
    },
    tdColon: {
        padding: '5px 6px',
        verticalAlign: 'top' as const,
        width: '4px',
    },
    tdValue: {
        padding: '5px 0',
        verticalAlign: 'top' as const,
        fontWeight: 500,
    },
    clinicalTable: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        fontSize: '13px',
        marginTop: '8px',
    },
    clinicalTh: {
        padding: '7px 10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        fontWeight: 'bold',
        textAlign: 'left' as const,
        fontSize: '12px',
    },
    clinicalTd: {
        padding: '7px 10px',
        border: '1px solid #ccc',
        verticalAlign: 'top' as const,
    },
    resultBox: {
        border: '2px solid #1a1a1a',
        padding: '16px 20px',
        marginTop: '20px',
        marginBottom: '20px',
    },
    resultRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
    },
    disclaimer: {
        border: '1px solid #999',
        padding: '12px 16px',
        marginTop: '20px',
        fontSize: '11px',
        color: '#333',
        lineHeight: '1.6',
    },
    signatureRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '56px',
    },
    signatureBlock: {
        textAlign: 'center' as const,
        width: '200px',
    },
    signatureLine: {
        borderTop: '1px solid #1a1a1a',
        paddingTop: '6px',
        marginTop: '64px',
        fontSize: '12px',
    },
    footer: {
        borderTop: '1px solid #999',
        marginTop: '32px',
        paddingTop: '8px',
        fontSize: '11px',
        color: '#555',
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default function PredictionsPrint({ prediction }: Props) {
    const riskLabel = { HIGH: 'TINGGI', MODERATE: 'SEDANG', LOW: 'RENDAH' }[prediction.risk_level] ?? prediction.risk_level;
    const tanggal = format(new Date(prediction.created_at), 'dd MMMM yyyy', { locale: id });
    const waktu = format(new Date(prediction.created_at), 'HH:mm', { locale: id });
    const noDoc = `AP-${String(prediction.id).padStart(5, '0')}`;

    const clinical = [
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

    return (
        <>
            <Head title={`Hasil Analisis - ${prediction.patient.nama}`} />

            <div style={s.page}>
                {/* Letterhead */}
                <div style={s.header}>
                    <p style={s.headerTitle}>Sistem Klasifikasi Angina Pektoris</p>
                    <p style={s.headerSub}>Laporan Hasil Analisis Klinis Berbasis Kecerdasan Buatan</p>
                </div>

                {/* Doc meta */}
                <div style={s.docInfoRow}>
                    <span>No. Dokumen: <strong>{noDoc}</strong></span>
                    <span>Tanggal: <strong>{tanggal}</strong> &nbsp;|&nbsp; Pukul: <strong>{waktu} WIB</strong></span>
                    <span>Analis: <strong>{prediction.user.name}</strong></span>
                </div>

                {/* Patient data */}
                <div style={s.sectionTitle}>I. Data Pasien</div>
                <table style={s.table}>
                    <tbody>
                        <tr>
                            <td style={s.tdLabel}>Nama Lengkap</td>
                            <td style={s.tdColon}>:</td>
                            <td style={s.tdValue}>{prediction.patient.nama}</td>
                            <td style={s.tdLabel}>No. Rekam Medis</td>
                            <td style={s.tdColon}>:</td>
                            <td style={s.tdValue}>{prediction.patient.no_rm}</td>
                        </tr>
                        <tr>
                            <td style={s.tdLabel}>Umur</td>
                            <td style={s.tdColon}>:</td>
                            <td style={s.tdValue}>{prediction.usia} tahun</td>
                            <td style={s.tdLabel}>Jenis Kelamin</td>
                            <td style={s.tdColon}>:</td>
                            <td style={s.tdValue}>{prediction.patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                        </tr>
                        <tr>
                            <td style={s.tdLabel}>Tekanan Darah</td>
                            <td style={s.tdColon}>:</td>
                            <td style={s.tdValue}>{prediction.tekanan_darah} mmHg</td>
                            <td style={s.tdLabel}>Tanggal Lahir</td>
                            <td style={s.tdColon}>:</td>
                            <td style={s.tdValue}>{prediction.patient.tanggal_lahir ?? '-'}</td>
                        </tr>
                        {prediction.patient.alamat && (
                            <tr>
                                <td style={s.tdLabel}>Alamat</td>
                                <td style={s.tdColon}>:</td>
                                <td style={{ ...s.tdValue, ...{ colSpan: 3 } }} colSpan={3}>{prediction.patient.alamat}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Clinical data */}
                <div style={s.sectionTitle}>II. Data Klinis</div>
                <table style={s.clinicalTable}>
                    <thead>
                        <tr>
                            <th style={s.clinicalTh}>No.</th>
                            <th style={s.clinicalTh}>Parameter</th>
                            <th style={s.clinicalTh}>Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clinical.map(([param, val], i) => (
                            <tr key={i}>
                                <td style={{ ...s.clinicalTd, width: '40px', textAlign: 'center' }}>{i + 1}.</td>
                                <td style={s.clinicalTd}>{param}</td>
                                <td style={s.clinicalTd}>{val}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Result */}
                <div style={s.sectionTitle}>III. Hasil Analisis</div>
                <div style={s.resultBox}>
                    <table style={{ ...s.table, fontSize: '13px' }}>
                        <tbody>
                            <tr>
                                <td style={s.tdLabel}>Hasil Klasifikasi</td>
                                <td style={s.tdColon}>:</td>
                                <td style={{ ...s.tdValue, fontWeight: 'bold', fontSize: '14px' }}>{prediction.prediction_result}</td>
                            </tr>
                            <tr>
                                <td style={s.tdLabel}>Tingkat Risiko</td>
                                <td style={s.tdColon}>:</td>
                                <td style={s.tdValue}>{riskLabel}</td>
                            </tr>
                            <tr>
                                <td style={s.tdLabel}>Probabilitas Angina Pektoris</td>
                                <td style={s.tdColon}>:</td>
                                <td style={s.tdValue}>{prediction.risk_percentage}%</td>
                            </tr>
                            <tr>
                                <td style={s.tdLabel}>Probabilitas Bukan Angina</td>
                                <td style={s.tdColon}>:</td>
                                <td style={s.tdValue}>{(prediction.probability_non_angina * 100).toFixed(1)}%</td>
                            </tr>
                            <tr>
                                <td style={s.tdLabel}>Tingkat Kepercayaan</td>
                                <td style={s.tdColon}>:</td>
                                <td style={s.tdValue}>{prediction.confidence}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Disclaimer */}
                <div style={s.disclaimer}>
                    <strong>Catatan Penting:</strong> Hasil analisis ini dihasilkan oleh sistem berbasis kecerdasan buatan
                    (Machine Learning — Random Forest) dan bersifat sebagai alat bantu diagnosis. Hasil ini <strong>bukan merupakan
                    diagnosis medis definitif</strong> dan tidak dapat menggantikan penilaian klinis dari tenaga medis yang
                    berwenang. Selalu konsultasikan hasil ini kepada dokter spesialis jantung untuk evaluasi dan penanganan lebih lanjut.
                </div>

                {/* Signature */}
                <div style={s.signatureRow}>
                    <div style={s.signatureBlock}>
                        <div style={{ fontSize: '13px' }}>Pasien / Wali</div>
                        <div style={s.signatureLine}>( {prediction.patient.nama} )</div>
                    </div>
                    <div style={s.signatureBlock}>
                        <div style={{ fontSize: '13px' }}>{tanggal}</div>
                        <div style={{ fontSize: '13px', marginTop: '2px' }}>Dokter / Analis</div>
                        <div style={s.signatureLine}>( {prediction.user.name} )</div>
                    </div>
                </div>

                {/* Footer */}
                <div style={s.footer}>
                    <span>Sistem Klasifikasi Angina Pektoris &mdash; Dicetak: {tanggal} {waktu} WIB</span>
                    <span>{noDoc}</span>
                </div>
            </div>

            {/* Print controls */}
            <div className="no-print" style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => window.print()}
                    style={{ padding: '10px 22px', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                >
                    Cetak / Simpan PDF
                </button>
                <button
                    onClick={() => window.history.back()}
                    style={{ padding: '10px 22px', backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                    Kembali
                </button>
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                }
                @page { margin: 20mm; }
            `}</style>
        </>
    );
}
