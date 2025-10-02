'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Prospect } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
    'Novo': 'secondary',
    'Qualificação': 'default',
    'Proposta': 'default',
    'Negociação': 'default',
    'Fechado Ganho': 'default',
    'Fechado Perdido': 'destructive',
}

interface ProspectsTableProps {
  prospects: Prospect[];
  isLoading: boolean;
}

interface ProspectWithFormattedDate extends Prospect {
    formattedLastContact: string;
}

export function ProspectsTable({ prospects, isLoading }: ProspectsTableProps) {
    const router = useRouter();
    const [hydratedProspects, setHydratedProspects] = useState<ProspectWithFormattedDate[]>([]);

    useEffect(() => {
        setHydratedProspects(prospects.map(p => ({
            ...p,
            formattedLastContact: new Date(p.lastContact).toLocaleDateString('pt-BR')
        })));
    }, [prospects]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead className="text-right">Último Contato</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                    <TableCell>
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                </TableRow>
            ))
        ) : (
            hydratedProspects.map((prospect) => (
            <TableRow key={prospect.id} onClick={() => router.push(`/prospects/${prospect.id}`)} className="cursor-pointer">
                <TableCell>
                <div className="font-medium">{prospect.name}</div>
                <div className="text-sm text-muted-foreground">{prospect.company}</div>
                </TableCell>
                <TableCell>
                <Badge variant={statusVariantMap[prospect.status] || 'default'}>{prospect.status}</Badge>
                </TableCell>
                <TableCell>R$ {prospect.value.toLocaleString('pt-BR')}</TableCell>
                <TableCell className="text-right">{prospect.formattedLastContact}</TableCell>
            </TableRow>
            ))
        )}
      </TableBody>
    </Table>
  );
}
