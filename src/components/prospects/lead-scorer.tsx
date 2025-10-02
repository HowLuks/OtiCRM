'use client';

import { useState } from 'react';
import { Bot, CheckCircle, Loader, AlertTriangle, TrendingUp, Sparkles, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Prospect } from '@/lib/data';
import { scoreLeadAction } from '@/actions/prospects';
import type { LeadScoringOutput } from '@/ai/flows/lead-scoring';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

type LeadScorerProps = {
  prospect: Prospect;
};

const priorityStyles = {
    High: "bg-red-500 border-red-500",
    Medium: "bg-amber-500 border-amber-500",
    Low: "bg-green-500 border-green-500",
}

export function LeadScorer({ prospect }: LeadScorerProps) {
  const [result, setResult] = useState<LeadScoringOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScoreLead = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const scoringResult = await scoreLeadAction(prospect);
      setResult(scoringResult);
    } catch (error) {
        let message = 'Ocorreu um erro desconhecido.';
        if (error instanceof Error) {
            message = error.message;
        }
        toast({
            title: "Erro na Análise",
            description: message,
            variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <CardTitle>Pontuação com IA</CardTitle>
        </div>
        <Button onClick={handleScoreLead} disabled={isLoading} size="sm">
          {isLoading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Analisar Lead
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <Loader className="h-8 w-8 animate-spin mb-4" />
            <p className="font-medium">Analisando perfil do prospect...</p>
            <p className="text-sm">A IA está processando o histórico de interações e dados para gerar uma pontuação.</p>
          </div>
        )}
        {!isLoading && !result && (
          <div className="flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <Sparkles className="h-8 w-8 mb-4" />
            <p className="font-medium">Pronto para análise</p>
            <p className="text-sm">Clique em "Analisar Lead" para obter a pontuação e insights da IA.</p>
          </div>
        )}
        {result && (
            <div className="grid gap-6">
                <div className="flex items-center justify-center gap-6 text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Pontuação</p>
                        <p className="text-5xl font-bold text-primary">{result.score}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Prioridade</p>
                        <Badge className={cn("text-lg", priorityStyles[result.priority])}>{result.priority}</Badge>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Justificativa da IA:</h4>
                    <p className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-md">{result.reasoning}</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
