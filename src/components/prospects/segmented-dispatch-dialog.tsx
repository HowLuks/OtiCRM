'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { funnelStages, prospects } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { Send, Users } from 'lucide-react';

type Status = 'Novo' | 'Qualificação' | 'Proposta' | 'Negociação' | 'Fechado Ganho' | 'Fechado Perdido';

interface SegmentedDispatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SegmentedDispatchDialog({ open, onOpenChange }: SegmentedDispatchDialogProps) {
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

    console.log('Sending message:', message);
    console.log('To stages:', selectedStages);
    console.log('Targeted prospects:', targetedProspectsCount);

    toast({
      title: "Disparo enviado!",
      description: `Sua mensagem foi enviada para ${targetedProspectsCount} prospect(s).`,
    });
    
    // Close dialog after sending
    onOpenChange(false);
  };

  // Reset state when dialog is closed
  useEffect(() => {
    if (!open) {
      setSelectedStages([]);
      setMessage('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Disparo Segmentado</DialogTitle>
          <DialogDescription>
            Selecione as etapas do funil, escreva sua mensagem e envie para os prospects.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <Label className="font-semibold">1. Selecione as Etapas do Funil</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {funnelStages.filter(stage => !['Fechado Ganho', 'Fechado Perdido'].includes(stage)).map(stage => (
                <div key={stage} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dispatch-${stage}`}
                    onCheckedChange={(checked) => handleStageChange(stage, !!checked)}
                    checked={selectedStages.includes(stage)}
                  />
                  <Label htmlFor={`dispatch-${stage}`} className="font-normal cursor-pointer">{stage}</Label>
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
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center border-t pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span className="font-medium">{targetedProspectsCount}</span>
                <span>prospect(s) selecionado(s)</span>
            </div>
          <Button onClick={handleSend}>
            <Send className="mr-2 h-4 w-4" />
            Enviar Mensagem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
