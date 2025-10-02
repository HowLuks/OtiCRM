'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { prospects } from "@/lib/data";
import Link from "next/link";
import { useRouter } from "next/navigation";

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
    'Novo': 'secondary',
    'Qualificação': 'default',
    'Proposta': 'default',
    'Negociação': 'default',
    'Fechado Ganho': 'default',
    'Fechado Perdido': 'destructive',
}

export function ProspectsTable() {
    const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Pontuação IA</TableHead>
          <TableHead className="text-right">Último Contato</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prospects.map((prospect) => (
          <TableRow key={prospect.id} onClick={() => router.push(`/prospects/${prospect.id}`)} className="cursor-pointer">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={prospect.avatar.imageUrl} alt={prospect.name} data-ai-hint={prospect.avatar.imageHint} />
                  <AvatarFallback>{prospect.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{prospect.name}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[prospect.status] || 'default'}>{prospect.status}</Badge>
            </TableCell>
            <TableCell>R$ {prospect.value.toLocaleString('pt-BR')}</TableCell>
            <TableCell>{prospect.leadScore || "N/A"}</TableCell>
            <TableCell className="text-right">{new Date(prospect.lastContact).toLocaleDateString('pt-BR')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
