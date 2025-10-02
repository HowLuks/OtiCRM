import { notFound } from 'next/navigation';
import { prospects } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Building, DollarSign, Calendar, History } from 'lucide-react';
import Link from 'next/link';
import { LeadScorer } from '@/components/prospects/lead-scorer';

export default function ProspectDetailPage({ params }: { params: { id: string } }) {
  const prospect = prospects.find((p) => p.id === params.id);

  if (!prospect) {
    notFound();
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
            <Link href="/prospects">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
            </Link>
        </Button>
        <Avatar className="h-16 w-16">
          <AvatarImage src={prospect.avatar.imageUrl} alt={prospect.name} data-ai-hint={prospect.avatar.imageHint}/>
          <AvatarFallback className="text-xl">{prospect.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
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
          <LeadScorer prospect={prospect} />
          
          <Card>
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
                        <span>Último contato: {new Date(prospect.lastContact).toLocaleDateString('pt-BR')}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
