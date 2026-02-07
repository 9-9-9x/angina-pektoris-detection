import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/layouts/app-layout';
import { Users, Activity, Calendar, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';

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

interface Stats {
  total_patients: number;
  total_predictions: number;
  today_predictions: number;
  high_risk_count: number;
}

interface Props {
  stats: Stats;
  recentPredictions: Prediction[];
  riskDistribution: Record<string, number>;
}

export default function Dashboard({ stats, recentPredictions, riskDistribution }: Props) {
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'HIGH':
        return <Badge className="bg-red-500">Tinggi</Badge>;
      case 'MODERATE':
        return <Badge className="bg-yellow-500 text-black">Sedang</Badge>;
      case 'LOW':
        return <Badge className="bg-green-500">Rendah</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <AppLayout>
      <Head title="Dashboard" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Ringkasan data dan aktivitas prediksi Angina Pektoris
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_patients}</div>
              <p className="text-xs text-muted-foreground">
                Pasien terdaftar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prediksi</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_predictions}</div>
              <p className="text-xs text-muted-foreground">
                Analisis telah dilakukan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prediksi Hari Ini</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today_predictions}</div>
              <p className="text-xs text-muted-foreground">
                Analisis hari ini
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risiko Tinggi</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.high_risk_count}</div>
              <p className="text-xs text-muted-foreground">
                Pasien dengan risiko tinggi
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Predictions */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Prediksi Terbaru</CardTitle>
              <Link href={route('predictions.index')}>
                <Button variant="ghost" size="sm">
                  Lihat Semua
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentPredictions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Belum ada prediksi
                </p>
              ) : (
                <div className="space-y-3">
                  {recentPredictions.map((prediction) => (
                    <Link
                      key={prediction.id}
                      href={route('predictions.show', prediction.id)}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{prediction.patient.nama}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(prediction.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right">
                        {getRiskBadge(prediction.risk_level)}
                        <p className="text-sm text-muted-foreground mt-1">
                          {(prediction.probability_angina * 100).toFixed(1)}%
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Risiko</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(riskDistribution).length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Belum ada data
                </p>
              ) : (
                <div className="space-y-4">
                  {riskDistribution.HIGH > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>Risiko Tinggi</span>
                      </div>
                      <span className="font-bold">{riskDistribution.HIGH}</span>
                    </div>
                  )}
                  {riskDistribution.MODERATE > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span>Risiko Sedang</span>
                      </div>
                      <span className="font-bold">{riskDistribution.MODERATE}</span>
                    </div>
                  )}
                  {riskDistribution.LOW > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Risiko Rendah</span>
                      </div>
                      <span className="font-bold">{riskDistribution.LOW}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Link href={route('patients.create')}>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Tambah Pasien Baru
              </Button>
            </Link>
            <Link href={route('patients.index')}>
              <Button variant="outline">
                <Activity className="mr-2 h-4 w-4" />
                Lihat Daftar Pasien
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
