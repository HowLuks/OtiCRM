'use client';

import { SalesChart } from "@/components/charts/sales-chart";
import { LeadSourceChart } from "@/components/charts/lead-source-chart";
import {
    ChartContainer,
    ChartTooltipContent,
  } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { funnelStages } from "@/lib/data";
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Prospect } from '@/lib/data';

const chartConfig = {
    total: {
      label: 'Prospects',
      color: 'hsl(var(--chart-1))',
    },
};

export default function RelatoriosPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const prospectsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'prospects');
  }, [firestore, user]);

  const { data: prospects, isLoading } = useCollection<Prospect>(prospectsQuery);

  const funnelData = funnelStages.map(stage => ({
      name: stage,
      total: prospects?.filter(p => p.status === stage).length || 0
  }));

  if (isLoading || !prospects) {
    return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">Carregando relatórios...</main>
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart prospects={prospects} />
        <LeadSourceChart prospects={prospects} />
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Análise do Funil de Vendas</CardTitle>
            <CardDescription>Número de prospects em cada estágio.</CardDescription>
          </CardHeader>
          <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={funnelData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
