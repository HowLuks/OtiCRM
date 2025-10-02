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
import { prospects, leadSources, type LeadSource } from '@/lib/data';
import { useMemo } from 'react';

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
} satisfies Record<string, any>;

export function LeadSourceChart() {
    const dynamicLeadSourceData = useMemo(() => {
        const sourceCounts = prospects.reduce((acc, prospect) => {
            acc[prospect.source] = (acc[prospect.source] || 0) + 1;
            return acc;
        }, {} as Record<LeadSource, number>);

        return leadSources.map((source) => ({
            source,
            value: sourceCounts[source] || 0,
            fill: `var(--color-${source.toLowerCase()})`
        }));
    }, []);

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
              data={dynamicLeadSourceData}
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
