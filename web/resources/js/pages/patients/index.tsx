import { Head, Link, router } from '@inertiajs/react';
import patientsRoute from '@/routes/patients';
import predictionsRoute from '@/routes/predictions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { UserPlus, Search, Eye, Activity } from 'lucide-react';
import { useState } from 'react';

interface Patient {
  id: number;
  nama: string;
  no_rm: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  umur: number;
  predictions_count?: number;
}

interface Props {
  patients: {
    data: Patient[];
    links: any[];
    from: number;
    to: number;
    total: number;
  };
}

export default function PatientsIndex({ patients }: Props) {
  const [search, setSearch] = useState('');

  const filteredPatients = patients.data.filter(
    (patient) =>
      patient.nama.toLowerCase().includes(search.toLowerCase()) ||
      patient.no_rm.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <Head title="Daftar Pasien" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daftar Pasien</h1>
            <p className="text-muted-foreground">
              Kelola data pasien dan lakukan prediksi Angina Pektoris
            </p>
          </div>
          <Link href={patientsRoute.create()}>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Pasien
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Semua Pasien ({patients.total})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau No. RM..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">No. RM</th>
                    <th className="px-4 py-3 text-left font-medium">Nama</th>
                    <th className="px-4 py-3 text-left font-medium">Umur</th>
                    <th className="px-4 py-3 text-left font-medium">Jenis Kelamin</th>
                    <th className="px-4 py-3 text-left font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        Tidak ada pasien ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr key={patient.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3 font-medium">{patient.no_rm}</td>
                        <td className="px-4 py-3">{patient.nama}</td>
                        <td className="px-4 py-3">{patient.umur} tahun</td>
                        <td className="px-4 py-3">
                          <Badge variant={patient.jenis_kelamin === 'L' ? 'default' : 'secondary'}>
                            {patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Link href={patientsRoute.show(patient.id)}>
                              <Button variant="ghost" size="sm">
                                <Eye className="mr-1 h-4 w-4" />
                                Detail
                              </Button>
                            </Link>
                            <Link href={predictionsRoute.create(patient.id)}>
                              <Button variant="outline" size="sm">
                                <Activity className="mr-1 h-4 w-4" />
                                Prediksi
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
