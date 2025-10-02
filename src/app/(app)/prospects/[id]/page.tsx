'use client';

import { useParams } from 'next/navigation';
import { useDoc, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Prospect } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Building, DollarSign, Calendar, History } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LeadScorer } from '@/components/prospects/lead-scorer';

export default function ProspectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const firestore = useFirestore();
  const { user } = useUser();

  const prospectRef = useMemoFirebase(() => {
    if (!user || !id) return null;
    return doc(firestore, 'users', user.uid, 'prospects', id);
  }, [firestore, user, id]);

  const { data: prospect, isLoading } = useDoc<Prospect>(prospectRef);

  const [lastContact, setLastContact] = useState('');

  useEffect(() => {
    if (prospect) {
      setLastContact(new Date(prospect.lastContact).toLocaleDateString('pt-BR'));
    }
  }, [prospect]);

  if (isLoading) {
    return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">Carregando...</main>;
  }

  if (!prospect) {
    return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">Prospect não encontrado.</main>;
  }
  
  const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
    'Novo': 'secondary',
    'Qualificação': 'default',
    'Proposta': 'default',
    'Negociação': 'default',
    'Fechado Ganho': 'default',
    'Fechado Perdido': 'destructive',
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/funil">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
            </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{prospect.name}</h1>
          <p className="text-muted-foreground">{prospect.company}</p>
        </div>
        <div className="ml-auto">
            <Badge variant={statusVariantMap[prospect.status] || 'default'} className="text-sm">{prospect.status}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <History className="h-6 w-6" />
                    <CardTitle>Histórico de Interação</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{prospect.interactionHistory}</p>
            </CardContent>
          </Card>
          <LeadScorer prospect={prospect} />
        </div>
        
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${prospect.email}`} className="text-primary hover:underline">{prospect.email}</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{prospect.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{prospect.company}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detalhes do Negócio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">R$ {prospect.value.toLocaleString('pt-BR')}</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Último contato: {lastContact}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
