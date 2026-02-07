import { Head, Link, useForm } from '@inertiajs/react';
import patientsRoute from '@/routes/patients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Save } from 'lucide-react';

export default function PatientsCreate() {
  const { data, setData, post, processing, errors } = useForm({
    nama: '',
    umur: '',
    jenis_kelamin: '',
    alamat: '',
    telepon: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(patientsRoute.store());
  };

  return (
    <AppLayout>
      <Head title="Tambah Pasien" />

      <div className="w-full max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href={patientsRoute.index()}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tambah Pasien</h1>
            <p className="text-slate-600">Tambahkan data pasien baru</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Informasi Pasien</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    value={data.nama}
                    onChange={(e) => setData('nama', e.target.value)}
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="umur">Umur (Tahun) *</Label>
                  <Input
                    id="umur"
                    type="number"
                    min="0"
                    max="120"
                    value={data.umur}
                    onChange={(e) => setData('umur', e.target.value)}
                    placeholder="Masukkan umur"
                  />
                  {errors.umur && <p className="text-sm text-red-500">{errors.umur}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                  <Select value={data.jenis_kelamin} onValueChange={(value) => setData('jenis_kelamin', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.jenis_kelamin && <p className="text-sm text-red-500">{errors.jenis_kelamin}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Input
                    id="alamat"
                    value={data.alamat}
                    onChange={(e) => setData('alamat', e.target.value)}
                    placeholder="Masukkan alamat lengkap"
                  />
                  {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="telepon">Nomor Telepon</Label>
                  <Input
                    id="telepon"
                    value={data.telepon}
                    onChange={(e) => setData('telepon', e.target.value)}
                    placeholder="Contoh: 08123456789"
                  />
                  {errors.telepon && <p className="text-sm text-red-500">{errors.telepon}</p>}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={processing} className="bg-slate-700 hover:bg-slate-800">
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </Button>
                <Link href={patientsRoute.index()}>
                  <Button variant="outline" type="button">
                    Batal
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-500 text-sm">
            2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
        </footer>
      </div>
    </AppLayout>
  );
}
