import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/layouts/app-layout';
import { Search, Eye, Activity } from 'lucide-react';
import { useState } from 'react';

interface Prediction {
  id: number;
  created_at: string;
  prediction_result: string;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH';
  probability_angina: number;
  patient: {
    id: number;
    nama: string;
    no_rm: string;
  };
}

interface Props {
  predictions: {
    data: Prediction[];
    links: any[];
    from: number;
    to: number;
    total: number;
  };
}

export default function PredictionsIndex({ predictions }: Props) {
  const [search, setSearch] = useState('');

  const filteredPredictions = predictions.data.filter(
    (pred) =>
      pred.patient.nama.toLowerCase().includes(search.toLowerCase()) ||
      pred.patient.no_rm.toLowerCase().includes(search.toLowerCase())
  );

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'HIGH':
        return <Badge className="bg-red-500">Tinggi</Badge>;
      case 'MODERATE':
        return <Badge className="bg-yellow-500">Sedang</Badge>;
      case 'LOW':
        return <Badge className="bg-green-500">Rendah</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <AppLayout>
      <Head title="Riwayat Prediksi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Riwayat Prediksi</h1>
            <p className="text-muted-foreground">
              Semua hasil prediksi Angina Pektoris
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Prediksi ({predictions.total})</CardTitle>
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
                    <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                    <th className="px-4 py-3 text-left font-medium">Pasien</th>
                    <th className="px-4 py-3 text-left font-medium">No. RM</th>
                    <th className="px-4 py-3 text-left font-medium">Hasil</th>
                    <th className="px-4 py-3 text-left font-medium">Risiko</th>
                    <th className="px-4 py-3 text-left font-medium">Probabilitas</th>
                    <th className="px-4 py-3 text-left font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPredictions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        Tidak ada prediksi ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredPredictions.map((prediction) => (
                      <tr key={prediction.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          {new Date(prediction.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-4 py-3 font-medium">{prediction.patient.nama}</td>
                        <td className="px-4 py-3">{prediction.patient.no_rm}</td>
                        <td className="px-4 py-3">{prediction.prediction_result}</td>
                        <td className="px-4 py-3">{getRiskBadge(prediction.risk_level)}</td>
                        <td className="px-4 py-3">
                          {(prediction.probability_angina * 100).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3">
                          <Link href={route('predictions.show', prediction.id)}>
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-1 h-4 w-4" />
                              Detail
                            </Button>
                          </Link>
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
