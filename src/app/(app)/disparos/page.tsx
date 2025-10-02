'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { funnelStages, prospects } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { Send, Users } from 'lucide-react';

type Status = 'Novo' | 'Qualificação' | 'Proposta' | 'Negociação' | 'Fechado Ganho' | 'Fechado Perdido';

export default function DisparosPage() {
  const [selectedStages, setSelectedStages] = useState<Status[]>([]);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleStageChange = (stage: Status, checked: boolean) => {
    setSelectedStages(prev => 
      checked ? [...prev, stage] : prev.filter(s => s !== stage)
    );
  };

  const targetedProspectsCount = useMemo(() => {
    if (selectedStages.length === 0) return 0;
    return prospects.filter(p => selectedStages.includes(p.status)).length;
  }, [selectedStages]);

  const handleSend = () => {
    if (selectedStages.length === 0) {
      toast({
        title: "Nenhuma etapa selecionada",
        description: "Por favor, selecione pelo menos uma etapa do funil.",
        variant: "destructive",
      });
      return;
    }
    if (!message.trim()) {
      toast({
        title: "Mensagem vazia",
        description: "Por favor, escreva a mensagem que deseja enviar.",
        variant: "destructive",
      });
      return;
    }

    // Simulate sending action
    console.log('Sending message:', message);
    console.log('To stages:', selectedStages);
    console.log('Targeted prospects:', targetedProspectsCount);

    toast({
      title: "Disparo enviado!",
      description: `Sua mensagem foi enviada para ${targetedProspectsCount} prospect(s).`,
    });
    
    // Reset form
    // setSelectedStages([]);
    // setMessage('');
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight">Disparos Segmentados</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Disparo</CardTitle>
          <CardDescription>Selecione as etapas do funil, escreva sua mensagem e envie para os prospects.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-4">
            <Label className="font-semibold">1. Selecione as Etapas do Funil</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {funnelStages.map(stage => (
                <div key={stage} className="flex items-center space-x-2">
                  <Checkbox 
                    id={stage} 
                    onCheckedChange={(checked) => handleStageChange(stage, !!checked)}
                    checked={selectedStages.includes(stage)}
                  />
                  <Label htmlFor={stage} className="font-normal cursor-pointer">{stage}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="font-semibold">2. Escreva sua Mensagem</Label>
            <Textarea 
              id="message" 
              placeholder="Digite sua mensagem aqui. Ex: Olá, [Nome]! Temos uma novidade sobre sua proposta..." 
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
             <p className="text-xs text-muted-foreground">
              Você pode usar variáveis como [Nome] que serão substituídas dinamicamente.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span className="font-medium">{targetedProspectsCount}</span>
                <span>prospect(s) selecionado(s)</span>
            </div>
          <Button onClick={handleSend}>
            <Send className="mr-2 h-4 w-4" />
            Enviar Mensagem
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
