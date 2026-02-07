import { Head, Link, useForm } from '@inertiajs/react';
import patientsRoute from '@/routes/patients';
import predictionsRoute from '@/routes/predictions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Activity, AlertTriangle } from 'lucide-react';

interface Patient {
  id: number;
  nama: string;
  no_rm: string;
}

interface Props {
  patient: Patient;
  mlStatus: {
    status: string;
    error?: string;
  };
}

export default function PredictionsCreate({ patient, mlStatus }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    tekanan_darah: '',
    riwayat_dm: 'Tidak',
    hipertensi: 'Tidak',
    riwayat_pjk: 'Tidak',
    nyeri_dada: 'Tidak',
    durasi_nyeri: '5 menit',
    sesak_napas: 'Tidak',
    mual: 'Tidak',
    muntah: 'Tidak',
    keringat_dingin: 'Tidak',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(predictionsRoute.store(patient.id));
  };

  const yesNoOptions = [
    { value: 'Ya', label: 'Ya' },
    { value: 'Tidak', label: 'Tidak' },
  ];

  const durasiOptions = [
    '2 menit',
    '5 menit',
    '10 menit',
    '15 menit',
    '30 menit',
    '1 jam',
    '2 jam',
    '1 hari',
    '2 hari',
    '3 hari',
  ];

  return (
    <AppLayout>
      <Head title="Prediksi Angina" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={patientsRoute.show(patient.id)}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prediksi Angina Pektoris</h1>
            <p className="text-muted-foreground">
              Pasien: <strong>{patient.nama}</strong> ({patient.no_rm})
            </p>
          </div>
        </div>

        {mlStatus.status !== 'healthy' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>ML Service Tidak Tersedia</AlertTitle>
            <AlertDescription>
              {mlStatus.error || 'Tidak dapat terhubung ke layanan prediksi.'} Prediksi akan menggunakan metode estimasi (mock) sebagai pengganti.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Klinis</CardTitle>
              <CardDescription>Masukkan data klinis pasien untuk analisis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tekanan_darah">Tekanan Darah Sistolik (mmHg) *</Label>
                  <Input
                    id="tekanan_darah"
                    type="number"
                    min="60"
                    max="300"
                    value={data.tekanan_darah}
                    onChange={(e) => setData('tekanan_darah', e.target.value)}
                    placeholder="Contoh: 150"
                  />
                  {errors.tekanan_darah && <p className="text-sm text-red-500">{errors.tekanan_darah}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Faktor Risiko</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Riwayat Diabetes</Label>
                  <Select value={data.riwayat_dm} onValueChange={(value) => setData('riwayat_dm', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yesNoOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Hipertensi</Label>
                  <Select value={data.hipertensi} onValueChange={(value) => setData('hipertensi', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yesNoOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Riwayat PJK</Label>
                  <Select value={data.riwayat_pjk} onValueChange={(value) => setData('riwayat_pjk', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yesNoOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gejala Klinis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nyeri Dada Menjalar ke Lengan</Label>
                  <Select value={data.nyeri_dada} onValueChange={(value) => setData('nyeri_dada', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yesNoOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Durasi Nyeri</Label>
                  <Select value={data.durasi_nyeri} onValueChange={(value) => setData('durasi_nyeri', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durasiOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sesak Napas</Label>
                  <Select value={data.sesak_napas} onValueChange={(value) => setData('sesak_napas', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yesNoOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mual</Label>
                  <Select value={data.mual} onValueChange={(value) => setData('mual', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yesNoOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Muntah</Label>
                  <Select value={data.muntah} onValueChange={(value) => setData('muntah', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yesNoOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Keringat Dingin</Label>
                  <Select value={data.keringat_dingin} onValueChange={(value) => setData('keringat_dingin', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yesNoOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={processing}
              size="lg"
            >
              <Activity className="mr-2 h-4 w-4" />
              Analisis Risiko
            </Button>
            <Link href={patientsRoute.show(patient.id)}>
              <Button variant="outline" size="lg" type="button">
                Batal
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
