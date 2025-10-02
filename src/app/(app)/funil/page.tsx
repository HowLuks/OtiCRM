'use client';

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { funnelStages, prospects as initialProspects, type Prospect } from "@/lib/data";
import { DollarSign, ArrowLeftCircle, ArrowRightCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SegmentedDispatchDialog } from "@/components/prospects/segmented-dispatch-dialog";

export default function FunilPage() {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [isDispatchDialogOpen, setIsDispatchDialogOpen] = useState(false);

  const handleMove = (prospectId: string, direction: 'forward' | 'backward') => {
    setProspects(prevProspects => {
      const prospectIndex = prevProspects.findIndex(p => p.id === prospectId);
      if (prospectIndex === -1) return prevProspects;

      const prospect = prevProspects[prospectIndex];
      const currentStageIndex = funnelStages.indexOf(prospect.status);

      let nextStageIndex: number;
      if (direction === 'forward') {
        if (prospect.status === 'Negociação') {
          // Special case: from Negociação can go to Fechado Ganho
          nextStageIndex = funnelStages.indexOf('Fechado Ganho');
        } else {
            nextStageIndex = currentStageIndex + 1;
        }
      } else {
        nextStageIndex = currentStageIndex - 1;
      }
      
      if (nextStageIndex >= 0 && nextStageIndex < funnelStages.length) {
        const newStatus = funnelStages[nextStageIndex];
        const updatedProspect = { ...prospect, status: newStatus };
        
        const newProspects = [...prevProspects];
        newProspects[prospectIndex] = updatedProspect;
        return newProspects;
      }

      return prevProspects;
    });
  };

  const prospectsByStage = funnelStages.map((stage) => ({
    stage,
    prospects: prospects.filter((p) => p.status === stage),
  }));

  return (
    <>
      <SegmentedDispatchDialog
        open={isDispatchDialogOpen}
        onOpenChange={setIsDispatchDialogOpen}
      />
      <main className="flex h-[calc(100vh-theme(spacing.16))] flex-col p-4 md:p-8">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Funil de Vendas</h1>
          <div className="ml-auto">
            <Button onClick={() => setIsDispatchDialogOpen(true)}>
              <Send className="mr-2 h-4 w-4" />
              Disparo Segmentado
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex h-full gap-4 pb-4">
            {prospectsByStage.map(({ stage, prospects: stageProspects }) => (
              <div key={stage} className="flex flex-col w-72 shrink-0">
                <h2 className="text-lg font-semibold mb-2 px-2">{stage} ({stageProspects.length})</h2>
                <Card className="flex-1 bg-secondary/50">
                  <CardContent className="p-2 h-full overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {stageProspects.map((prospect) => {
                         const currentStageIndex = funnelStages.indexOf(prospect.status);
                         const isFirstStage = currentStageIndex === 0;
                         const isTerminalStage = ['Fechado Ganho', 'Fechado Perdido'].includes(prospect.status);
                         const canMoveForward = !isTerminalStage;
                         const canMoveBackward = !isFirstStage && !isTerminalStage;

                        return (
                        <Card key={prospect.id} className="hover:bg-accent hover:border-blue-200 transition-colors flex flex-col">
                          <CardHeader className="p-4 flex-grow">
                            <div>
                              <CardTitle className="text-base">{prospect.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                            <p>{prospect.company}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <DollarSign className="h-4 w-4" />
                                <span>{prospect.value.toLocaleString('pt-BR')}</span>
                            </div>
                          </CardContent>
                           <CardFooter className="p-2 pt-0 border-t mt-auto">
                              <div className="flex justify-between w-full">
                                  <Button variant="ghost" size="icon" onClick={() => handleMove(prospect.id, 'backward')} disabled={!canMoveBackward} className={cn(!canMoveBackward && "invisible")}>
                                      <ArrowLeftCircle className="h-5 w-5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleMove(prospect.id, 'forward')} disabled={!canMoveForward} className={cn(!canMoveForward && "invisible")}>
                                      <ArrowRightCircle className="h-5 w-5" />
                                  </Button>
                              </div>
                           </CardFooter>
                        </Card>
                      )})}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </main>
    </>
  );
}
