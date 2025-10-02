import {
  DollarSign,
  TrendingUp,
  Users,
  UserX,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SalesChart } from '@/components/charts/sales-chart';
import { LeadSourceChart } from '@/components/charts/lead-source-chart';
import { prospects } from '@/lib/data';

export default function DashboardPage() {
  const totalSales = prospects.filter(p => p.status === 'Fechado Ganho').reduce((acc, p) => acc + p.value, 0);
  const activeProspects = prospects.filter(p => !['Fechado Ganho', 'Fechado Perdido'].includes(p.status)).length;
  const lostProspects = prospects.filter(p => p.status === 'Fechado Perdido').length;
  const closedWon = prospects.filter(p => p.status === 'Fechado Ganho').length;
  const totalClosed = prospects.filter(p => ['Fechado Ganho', 'Fechado Perdido'].includes(p.status)).length;
  const conversionRate = totalClosed > 0 ? (closedWon / totalClosed) * 100 : 0;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalSales.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">Total de negócios ganhos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prospects Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProspects}</div>
            <p className="text-xs text-muted-foreground">Prospects em negociação no funil</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prospects Perdidos</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lostProspects}</div>
            <p className="text-xs text-muted-foreground">Total de negócios perdidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">De todos os negócios fechados</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
            <SalesChart />
        </div>
        <div className="lg:col-span-3">
            <LeadSourceChart />
        </div>
      </div>
    </main>
  );
}
