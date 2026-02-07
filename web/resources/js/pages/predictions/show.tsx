import { Head, Link } from '@inertiajs/react';
import patientsRoute from '@/routes/patients';
import predictionsRoute from '@/routes/predictions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Activity, AlertTriangle, CheckCircle, User, Calendar, Printer } from 'lucide-react';

interface Patient {
  id: number;
  nama: string;
  no_rm: string;
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
}

interface Props {
  prediction: Prediction;
}

export default function PredictionsShow({ prediction }: Props) {
  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'HIGH':
        return {
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: AlertTriangle,
          title: 'Risiko Tinggi',
          description: 'Terdeteksi kemungkinan besar Angina Pektoris',
        };
      case 'MODERATE':
        return {
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: Activity,
          title: 'Risiko Sedang',
          description: 'Diperlukan pemeriksaan lanjutan',
        };
      case 'LOW':
        return {
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle,
          title: 'Risiko Rendah',
          description: 'Kemungkinan Angina Pektoris rendah',
        };
      default:
        return {
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: Activity,
          title: 'Unknown',
          description: '',
        };
    }
  };

  const riskConfig = getRiskConfig(prediction.risk_level);
  const RiskIcon = riskConfig.icon;

  const formatValue = (value: string | number) => {
    if (value === 'Ya') return <span className="text-red-600 font-medium">Ya</span>;
    if (value === 'Tidak') return <span className="text-green-600">Tidak</span>;
    return value;
  };

  return (
    <AppLayout>
      <Head title="Hasil Prediksi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={patientsRoute.show(prediction.patient.id)}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Hasil Prediksi</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                {prediction.patient.nama} ({prediction.patient.no_rm})
                <span className="text-gray-300">|</span>
                <Calendar className="h-4 w-4" />
                {new Date(prediction.created_at).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <Card className={`${riskConfig.bgColor} ${riskConfig.borderColor} border-2`}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className={`p-4 rounded-full bg-${riskConfig.color}-100`}>
                <RiskIcon className={`h-12 w-12 text-${riskConfig.color}-600`} />
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold">{riskConfig.title}</h2>
                <p className="text-muted-foreground">{riskConfig.description}</p>
                <div className="mt-4">
                  <p className="text-4xl font-bold">{prediction.risk_percentage}%</p>
                  <p className="text-sm text-muted-foreground">Probabilitas Angina Pektoris</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {prediction.prediction_result}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Confidence: {prediction.confidence}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Penting: Bukan Diagnosis Medis</p>
              <p className="text-red-700/80 mt-1">
                Hasil ini dihasilkan oleh algoritma machine learning dan hanya untuk tujuan riset.
                <strong> JANGAN</strong> digunakan sebagai satu-satunya dasar untuk diagnosis atau
                pengobatan. Selalu konsultasikan dengan dokter spesialis jantung untuk evaluasi medis.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Clinical Data */}
          <Card>
            <CardHeader>
              <CardTitle>Data Klinis</CardTitle>
              <CardDescription>Data yang digunakan untuk prediksi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Usia</p>
                  <p className="font-medium">{prediction.usia} tahun</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tekanan Darah</p>
                  <p className="font-medium">{prediction.tekanan_darah} mmHg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Riwayat Diabetes</p>
                  <p>{formatValue(prediction.riwayat_dm)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hipertensi</p>
                  <p>{formatValue(prediction.hipertensi)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Riwayat PJK</p>
                  <p>{formatValue(prediction.riwayat_pjk)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Durasi Nyeri</p>
                  <p className="font-medium">{prediction.durasi_nyeri}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptoms */}
          <Card>
            <CardHeader>
              <CardTitle>Gejala</CardTitle>
              <CardDescription>Keluhan yang dilaporkan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nyeri Menjalar</p>
                  <p>{formatValue(prediction.nyeri_dada)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sesak Napas</p>
                  <p>{formatValue(prediction.sesak_napas)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mual</p>
                  <p>{formatValue(prediction.mual)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Muntah</p>
                  <p>{formatValue(prediction.muntah)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Keringat Dingin</p>
                  <p>{formatValue(prediction.keringat_dingin)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href={predictionsRoute.print(prediction.id)} target="_blank">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Cetak / PDF
            </Button>
          </Link>
          <Link href={predictionsRoute.create(prediction.patient.id)}>
            <Button variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Prediksi Ulang
            </Button>
          </Link>
          <Link href={patientsRoute.show(prediction.patient.id)}>
            <Button variant="ghost">Kembali ke Detail Pasien</Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
