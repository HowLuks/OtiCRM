'use client';

import { Pie, PieChart, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { leadSourceData } from '@/lib/data';

const chartConfig = {
  value: {
    label: 'Leads',
  },
  Website: {
    label: 'Website',
    color: 'hsl(var(--chart-1))',
  },
  Indicação: {
    label: 'Indicação',
    color: 'hsl(var(--chart-2))',
  },
  Feiras: {
    label: 'Feiras',
    color: 'hsl(var(--chart-3))',
  },
  Anúncios: {
    label: 'Anúncios',
    color: 'hsl(var(--chart-4))',
  },
  Outros: {
    label: 'Outros',
    color: 'hsl(var(--chart-5))',
  },
};

export function LeadSourceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fontes de Lead</CardTitle>
        <CardDescription>Distribuição de leads por canal</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <PieChart>
            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={leadSourceData}
              dataKey="value"
              nameKey="source"
              innerRadius={60}
              strokeWidth={5}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="source" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
