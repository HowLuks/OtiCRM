'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
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
import { funnelStages, prospects, type Prospect } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { Send, Users, Loader, MessageCircle, RefreshCw } from 'lucide-react';
import { personalizeMessageAction, type PersonalizeMessageOutput } from '@/actions/prospects';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';

type Status = 'Novo' | 'Qualificação' | 'Proposta' | 'Negociação' | 'Fechado Ganho' | 'Fechado Perdido';

interface SegmentedDispatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PersonalizedResult {
    prospect: Prospect;
    personalizedMessage: string;
}

const cleanPhoneNumber = (phone: string) => {
    // Assuming Brazilian numbers. Add country code 55 if not present.
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length === 11) { // DDD + 9-digit mobile
        return `55${digitsOnly}`;
    }
    if (digitsOnly.length === 10) { // DDD + 8-digit landline/mobile
        return `55${digitsOnly}`;
    }
    return digitsOnly; // Return as is if format is unexpected
}


export function SegmentedDispatchDialog({ open, onOpenChange }: SegmentedDispatchDialogProps) {
  const [selectedStages, setSelectedStages] = useState<Status[]>([]);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [results, setResults] = useState<PersonalizedResult[]>([]);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleStageChange = (stage: Status, checked: boolean) => {
    setSelectedStages(prev =>
      checked ? [...prev, stage] : prev.filter(s => s !== stage)
    );
  };
  
  const targetedProspects = useMemo(() => {
    if (selectedStages.length === 0) return [];
    return prospects.filter(p => selectedStages.includes(p.status));
  }, [selectedStages]);

  const targetedProspectsCount = targetedProspects.length;

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
    if (targetedProspectsCount === 0) {
        toast({
            title: "Nenhum prospect selecionado",
            description: "Não há prospects nas etapas selecionadas para enviar a mensagem.",
            variant: "destructive",
        });
        return;
    }


    startTransition(async () => {
        try {
            console.log('Starting personalized dispatch...');
            const promises = targetedProspects.map(prospect => 
                personalizeMessageAction(message, prospect).then(output => ({prospect, personalizedMessage: output.personalizedMessage}))
            );
            
            const personalizedResults = await Promise.all(promises);
            setResults(personalizedResults);
            setStep('results');

        } catch (error) {
             toast({
                title: "Erro no Disparo",
                description: "Ocorreu um erro ao personalizar as mensagens com IA.",
                variant: "destructive",
            });
            console.error("Error during segmented dispatch:", error);
        }
    });
  };

  const resetAndClose = () => {
    onOpenChange(false);
    // Use a timeout to ensure the dialog is closed before resetting state
    setTimeout(() => {
        setSelectedStages([]);
        setMessage('');
        setResults([]);
        setStep('form');
    }, 300);
  }

  // Reset state when dialog is closed
  useEffect(() => {
    if (!open) {
      // Delay reset to allow for closing animation
      const timer = setTimeout(() => {
        setSelectedStages([]);
        setMessage('');
        setResults([]);
        setStep('form');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        {step === 'form' && (
            <>
                <DialogHeader>
                <DialogTitle>Criar Novo Disparo Segmentado</DialogTitle>
                <DialogDescription>
                    Selecione as etapas do funil, escreva sua mensagem e a IA irá personalizá-la para cada prospect.
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
                    A IA substituirá variáveis como [Nome] e [Empresa] pelos dados de cada prospect.
                    </p>
                </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center border-t pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-5 w-5" />
                        <span className="font-medium">{targetedProspectsCount}</span>
                        <span>prospect(s) selecionado(s)</span>
                    </div>
                <Button onClick={handleSend} disabled={isPending}>
                    {isPending ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-4 w-4" />
                    )}
                    {isPending ? 'Personalizando...' : 'Personalizar Mensagens'}
                </Button>
                </DialogFooter>
            </>
        )}
        {step === 'results' && (
            <>
                <DialogHeader>
                    <DialogTitle>Mensagens Personalizadas</DialogTitle>
                    <DialogDescription>
                        As mensagens foram personalizadas. Clique para enviar via WhatsApp.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[50vh] pr-4">
                    <div className="space-y-4 py-4">
                        {results.map(({prospect, personalizedMessage}) => {
                            const whatsappUrl = `https://wa.me/${cleanPhoneNumber(prospect.phone)}?text=${encodeURIComponent(personalizedMessage)}`;
                            return (
                                <div key={prospect.id} className="flex items-center gap-4 rounded-lg border p-3">
                                    <Avatar>
                                        <AvatarImage src={prospect.avatar.imageUrl} alt={prospect.name} />
                                        <AvatarFallback>{prospect.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-semibold">{prospect.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">{personalizedMessage}</p>
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={whatsappUrl} target="_blank">
                                            <MessageCircle className="mr-2 h-4 w-4" />
                                            WhatsApp
                                        </Link>
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setStep('form')}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refazer
                    </Button>
                     <Button onClick={resetAndClose}>Concluído</Button>
                </DialogFooter>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}
