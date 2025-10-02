'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Prospect } from '@/lib/data';
import { useMemo } from 'react';

const chartConfig = {
  sales: {
    label: 'Vendas',
    color: 'hsl(var(--primary))',
  },
};

export function SalesChart({ prospects }: { prospects: Prospect[] }) {
  const dynamicSalesData = useMemo(() => {
    const monthlySales: Record<string, number> = {};
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    prospects
      .filter(p => p.status === 'Fechado Ganho')
      .forEach(p => {
        const date = new Date(p.lastContact);
        const monthIndex = date.getMonth();
        // We will group only by month for simplicity, assuming data is from the same year for this chart
        const monthName = monthNames[monthIndex];

        if (!monthlySales[monthName]) {
          monthlySales[monthName] = 0;
        }
        monthlySales[monthName] += p.value;
      });

      // Ensure all months are present for a consistent chart
      const sortedData = monthNames.map(monthName => ({
          month: monthName,
          sales: monthlySales[monthName] || 0
      }));
      
      // For this example, let's just show the months up to the last one with data
      const lastMonthWithDataIndex = sortedData.findLastIndex(d => d.sales > 0);
      const relevantData = sortedData.slice(0, lastMonthWithDataIndex > -1 ? lastMonthWithDataIndex + 1 : new Date().getMonth() + 1);

      return relevantData;

  }, [prospects]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho de Vendas</CardTitle>
        <CardDescription>Vendas mensais de negócios ganhos</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={dynamicSalesData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
             <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `R$${Number(value) / 1000}k`}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" formatter={(value, name) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Vendas']}/>}
            />
            <Line
              dataKey="sales"
              type="natural"
              stroke="var(--color-sales)"
              strokeWidth={3}
              dot={{
                fill: 'var(--color-sales)',
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Dados de negócios com status "Fechado Ganho"
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Agrupados por mês do último contato
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
