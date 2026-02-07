import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/layouts/app-layout';
import { ArrowLeft, Edit, Activity, Calendar, User, MapPin, Phone } from 'lucide-react';

interface Prediction {
  id: number;
  created_at: string;
  prediction_result: string;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH';
  probability_angina: number;
}

interface Patient {
  id: number;
  nama: string;
  no_rm: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  umur: number;
  alamat: string | null;
  telepon: string | null;
  predictions: Prediction[];
}

interface Props {
  patient: Patient;
}

export default function PatientsShow({ patient }: Props) {
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'HIGH':
        return <Badge className="bg-red-500">Risiko Tinggi</Badge>;
      case 'MODERATE':
        return <Badge className="bg-yellow-500">Risiko Sedang</Badge>;
      case 'LOW':
        return <Badge className="bg-green-500">Risiko Rendah</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <AppLayout>
      <Head title={`Pasien: ${patient.nama}`} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={route('patients.index')}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{patient.nama}</h1>
              <p className="text-muted-foreground">No. RM: {patient.no_rm}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={route('predictions.create', patient.id)}>
              <Button>
                <Activity className="mr-2 h-4 w-4" />
                Prediksi Baru
              </Button>
            </Link>
            <Link href={route('patients.edit', patient.id)}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pasien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                  <p className="font-medium">{patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Lahir</p>
                  <p className="font-medium">{patient.tanggal_lahir} ({patient.umur} tahun)</p>
                </div>
              </div>
              {patient.alamat && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Alamat</p>
                    <p className="font-medium">{patient.alamat}</p>
                  </div>
                </div>
              )}
              {patient.telepon && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telepon</p>
                    <p className="font-medium">{patient.telepon}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Riwayat Prediksi ({patient.predictions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.predictions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Belum ada riwayat prediksi
                </p>
              ) : (
                <div className="space-y-3">
                  {patient.predictions.map((prediction) => (
                    <Link
                      key={prediction.id}
                      href={route('predictions.show', prediction.id)}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                    >
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(prediction.created_at).toLocaleDateString('id-ID')}
                        </p>
                        <p className="font-medium">{prediction.prediction_result}</p>
                      </div>
                      <div className="text-right">
                        {getRiskBadge(prediction.risk_level)}
                        <p className="text-sm text-muted-foreground mt-1">
                          {(prediction.probability_angina * 100).toFixed(2)}%
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
