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
}

export function ProspectsTable({ prospects }: ProspectsTableProps) {
    const router = useRouter();
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
        {prospects.map((prospect) => (
          <TableRow key={prospect.id} onClick={() => router.push(`/prospects/${prospect.id}`)} className="cursor-pointer">
            <TableCell>
              <div className="font-medium">{prospect.name}</div>
              <div className="text-sm text-muted-foreground">{prospect.company}</div>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[prospect.status] || 'default'}>{prospect.status}</Badge>
            </TableCell>
            <TableCell>R$ {prospect.value.toLocaleString('pt-BR')}</TableCell>
            <TableCell className="text-right">{new Date(prospect.lastContact).toLocaleDateString('pt-BR')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
