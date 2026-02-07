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
  nyeri_menjalar: string;
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

export default function PredictionsPrint({ prediction }: Props) {
  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'HIGH':
        return { color: '#dc2626', title: 'RISIKO TINGGI', bgColor: '#fef2f2' };
      case 'MODERATE':
        return { color: '#d97706', title: 'RISIKO SEDANG', bgColor: '#fffbeb' };
      case 'LOW':
        return { color: '#16a34a', title: 'RISIKO RENDAH', bgColor: '#f0fdf4' };
      default:
        return { color: '#6b7280', title: 'UNKNOWN', bgColor: '#f3f4f6' };
    }
  };

  const riskConfig = getRiskConfig(prediction.risk_level);

  const formatValue = (value: string) => {
    if (value === 'Ya') return <span style={{ color: '#dc2626', fontWeight: 600 }}>Ya</span>;
    if (value === 'Tidak') return <span style={{ color: '#16a34a' }}>Tidak</span>;
    return value;
  };

  return (
    <>
      <Head title="Cetak Hasil Prediksi" />
      
      <div className="print-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}>
            HASIL ANALISIS ANGINA PEKTORIS
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Sistem Prediksi Berbasis Machine Learning
          </p>
        </div>

        {/* Document Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '14px' }}>
          <div>
            <p><strong>No. Dokumen:</strong> AP-{String(prediction.id).padStart(5, '0')}</p>
            <p><strong>Tanggal:</strong> {format(new Date(prediction.created_at), 'dd MMMM yyyy HH:mm', { locale: id })}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p><strong>Dokter/Analis:</strong> {prediction.user.name}</p>
          </div>
        </div>

        {/* Patient Info */}
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#374151' }}>
            DATA PASIEN
          </h2>
          <table style={{ width: '100%', fontSize: '14px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 0', width: '150px', color: '#6b7280' }}>Nama Lengkap</td>
                <td style={{ padding: '6px 0', fontWeight: 500 }}>: {prediction.patient.nama}</td>
                <td style={{ padding: '6px 0', width: '150px', color: '#6b7280' }}>No. Rekam Medis</td>
                <td style={{ padding: '6px 0', fontWeight: 500 }}>: {prediction.patient.no_rm}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: '#6b7280' }}>Jenis Kelamin</td>
                <td style={{ padding: '6px 0' }}>: {prediction.patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                <td style={{ padding: '6px 0', color: '#6b7280' }}>Umur</td>
                <td style={{ padding: '6px 0' }}>: {prediction.usia} tahun</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: '#6b7280' }}>Tanggal Lahir</td>
                <td style={{ padding: '6px 0' }}>: {prediction.patient.tanggal_lahir}</td>
                <td style={{ padding: '6px 0', color: '#6b7280' }}>Tekanan Darah</td>
                <td style={{ padding: '6px 0' }}>: {prediction.tekanan_darah} mmHg</td>
              </tr>
              {prediction.patient.alamat && (
                <tr>
                  <td style={{ padding: '6px 0', color: '#6b7280' }}>Alamat</td>
                  <td style={{ padding: '6px 0' }} colSpan={3}>: {prediction.patient.alamat}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Prediction Result */}
        <div style={{ 
          marginBottom: '30px', 
          padding: '30px', 
          backgroundColor: riskConfig.bgColor, 
          borderRadius: '8px',
          border: `2px solid ${riskConfig.color}`,
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: riskConfig.color }}>
            {riskConfig.title}
          </h2>
          <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>
            {prediction.prediction_result}
          </p>
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '48px', fontWeight: 'bold', color: riskConfig.color }}>
              {prediction.risk_percentage}%
            </p>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Probabilitas Angina Pektoris</p>
          </div>
          <p style={{ marginTop: '15px', fontSize: '14px', color: '#6b7280' }}>
            Confidence: {prediction.confidence}
          </p>
        </div>

        {/* Clinical Data */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#374151' }}>
            DATA KLINIS
          </h2>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Parameter</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Nilai</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Parameter</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>Riwayat Diabetes</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{formatValue(prediction.riwayat_dm)}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>Nyeri Menjalar</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{formatValue(prediction.nyeri_menjalar)}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>Hipertensi</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{formatValue(prediction.hipertensi)}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>Durasi Nyeri</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{prediction.durasi_nyeri}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>Riwayat PJK</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{formatValue(prediction.riwayat_pjk)}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>Sesak Napas</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{formatValue(prediction.sesak_napas)}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>Mual</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{formatValue(prediction.mual)}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>Muntah</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{formatValue(prediction.muntah)}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>Keringat Dingin</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }} colSpan={3}>{formatValue(prediction.keringat_dingin)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <div style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          backgroundColor: '#fef2f2', 
          borderRadius: '8px',
          border: '1px solid #fecaca'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#991b1b' }}>
            ⚠️ PENTING - DISCLAIMER
          </h3>
          <p style={{ fontSize: '12px', color: '#7f1d1d', lineHeight: '1.6' }}>
            Hasil analisis ini dihasilkan oleh sistem berbasis Machine Learning dan hanya untuk tujuan 
            riset serta edukasi. <strong>HASIL INI BUKAN DIAGNOSIS MEDIS</strong> dan tidak boleh 
            digunakan sebagai satu-satunya dasar untuk pengobatan atau keputusan klinis. 
            Selalu konsultasikan dengan dokter spesialis jantung untuk evaluasi medis yang tepat.
          </p>
        </div>

        {/* Signature */}
        <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center', width: '200px' }}>
            <p style={{ marginBottom: '80px', fontSize: '14px' }}>Pasien/Wali</p>
            <p style={{ borderTop: '1px solid #000', paddingTop: '10px', fontSize: '14px' }}>
              ({prediction.patient.nama})
            </p>
          </div>
          <div style={{ textAlign: 'center', width: '200px' }}>
            <p style={{ marginBottom: '80px', fontSize: '14px' }}>Dokter/Analis</p>
            <p style={{ borderTop: '1px solid #000', paddingTop: '10px', fontSize: '14px' }}>
              ({prediction.user.name})
            </p>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
              {format(new Date(prediction.created_at), 'dd MMMM yyyy', { locale: id })}
            </p>
          </div>
        </div>
      </div>

      {/* Print Button (hidden when printing) */}
      <div className="no-print" style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px',
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={() => window.print()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          🖨️ Cetak / Save PDF
        </button>
        <button
          onClick={() => window.close()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          Tutup
        </button>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}
