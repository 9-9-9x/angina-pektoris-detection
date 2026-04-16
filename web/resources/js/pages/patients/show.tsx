import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Activity, User, MapPin, Phone, Trash2, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import patientsRoute from '@/routes/patients';
import predictionsRoute from '@/routes/predictions';

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
  umur: number;
  jenis_kelamin: 'L' | 'P';
  alamat: string | null;
  telepon: string | null;
  predictions: Prediction[];
}

interface Props {
  patient: Patient;
}

export default function PatientsShow({ patient }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { delete: destroy, processing } = useForm();

  const handleDelete = () => {
    destroy(patientsRoute.destroy(patient.id), {
      onSuccess: () => setShowDeleteDialog(false),
    });
  };
  
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

      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href={patientsRoute.index()}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{patient.nama}</h1>
              <p className="text-slate-600">No. RM: {patient.no_rm}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={predictionsRoute.create(patient.id)}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Activity className="mr-2 h-4 w-4" />
                Prediksi Baru
              </Button>
            </Link>
            <Link href={patientsRoute.edit(patient.id)}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="text-red-600 hover:text-red-700"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pasien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Jenis Kelamin</p>
                  <p className="font-medium">{patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Umur</p>
                  <p className="font-medium">{patient.umur} tahun</p>
                </div>
              </div>
              {patient.alamat && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Alamat</p>
                    <p className="font-medium">{patient.alamat}</p>
                  </div>
                </div>
              )}
              {patient.telepon && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Telepon</p>
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
                <p className="text-center text-slate-500 py-4">
                  Belum ada riwayat prediksi
                </p>
              ) : (
                <div className="space-y-3">
                  {patient.predictions.map((prediction) => (
                    <Link
                      key={prediction.id}
                      href={predictionsRoute.show(prediction.id)}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-sm text-slate-500">
                          {new Date(prediction.created_at).toLocaleDateString('id-ID')}
                        </p>
                        <p className="font-medium">{prediction.prediction_result}</p>
                      </div>
                      <div className="text-right">
                        {getRiskBadge(prediction.risk_level)}
                        <p className="text-sm text-slate-500 mt-1">
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

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-500 text-sm">
            2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
        </footer>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Pasien</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus pasien <strong>{patient.nama}</strong>? 
                Tindakan ini tidak dapat dibatalkan dan semua riwayat prediksi juga akan dihapus.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Batal
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={processing}
              >
                {processing ? 'Menghapus...' : 'Hapus Pasien'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
