'use client';

import React, { useState, useMemo } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { funnelStages, prospects as initialProspects, type Prospect, type Status } from "@/lib/data";
import { DollarSign, Send, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedDispatchDialog } from "@/components/prospects/segmented-dispatch-dialog";
import { ProspectCard, ProspectCardSkeleton } from "@/components/prospects/prospect-card";

type ProspectsByStage = Record<Status, Prospect[]>;

export default function FunilPage() {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [isDispatchDialogOpen, setIsDispatchDialogOpen] = useState(false);
  const [activeProspect, setActiveProspect] = useState<Prospect | null>(null);

  const prospectsByStage: ProspectsByStage = useMemo(() => {
    const initial: Partial<ProspectsByStage> = {};
    for (const stage of funnelStages) {
        initial[stage] = [];
    }
    return prospects.reduce((acc, p) => {
      if (!acc[p.status]) {
        acc[p.status] = [];
      }
      acc[p.status].push(p);
      return acc;
    }, initial as ProspectsByStage);
  }, [prospects]);

  const stageIds = useMemo(() => funnelStages, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const prospect = prospects.find(p => p.id === active.id);
    if(prospect) {
        setActiveProspect(prospect);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveProspect(null);
    const { active, over } = event;

    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    if (activeContainer !== overContainer) {
      // Moving to a different column
      setProspects(prev => {
        const activeProspectIndex = prev.findIndex(p => p.id === activeId);
        if (activeProspectIndex === -1) return prev;

        const updatedProspects = [...prev];
        const [movedProspect] = updatedProspects.splice(activeProspectIndex, 1);
        
        const newStatus = overContainer as Status;
        movedProspect.status = newStatus;

        // Find the index of the item we are dropping over
        const overProspectIndex = updatedProspects.findIndex(p => p.id === overId);
        
        let insertIndex;
        if (overProspectIndex !== -1) {
            // Find which index to insert at in the main array
            insertIndex = updatedProspects.findIndex(p => p.id === overId);
        } else {
            // Dropping on a column, not a card
            const prospectsInNewStage = prev.filter(p => p.status === newStatus);
            if(prospectsInNewStage.length > 0) {
                 // get the last prospect in the column and insert after it
                 const lastProspectId = prospectsInNewStage[prospectsInNewStage.length - 1].id;
                 insertIndex = updatedProspects.findIndex(p => p.id === lastProspectId) + 1;
            } else {
                 // find the first prospect in the next stage and insert before it
                 const nextStageIndex = stageIds.indexOf(newStatus) + 1;
                 if(nextStageIndex < stageIds.length) {
                    const nextStage = stageIds[nextStageIndex];
                    const firstProspectInNextStage = prev.find(p => p.status === nextStage);
                    if(firstProspectInNextStage) {
                        insertIndex = updatedProspects.findIndex(p => p.id === firstProspectInNextStage.id);
                    } else {
                        insertIndex = updatedProspects.length;
                    }
                 } else {
                     insertIndex = updatedProspects.length;
                 }
            }
        }
         
        updatedProspects.splice(insertIndex, 0, movedProspect);
        return updatedProspects;
      });
    } else {
      // Moving within the same column
      const stageProspects = prospectsByStage[activeContainer as Status];
      const oldIndex = stageProspects.findIndex(p => p.id === activeId);
      const newIndex = stageProspects.findIndex(p => p.id === overId);
      
      if (oldIndex !== newIndex) {
        setProspects(prev => {
            const reorderedForStage = arrayMove(stageProspects, oldIndex, newIndex);
            const otherProspects = prev.filter(p => p.status !== activeContainer);
            return [...otherProspects, ...reorderedForStage];
        });
      }
    }
  };
  
  const findContainer = (id: string) => {
    if (stageIds.includes(id as Status)) {
      return id;
    }
    const prospect = prospects.find(p => p.id === id);
    return prospect?.status;
  };


  return (
    <>
      <SegmentedDispatchDialog
        open={isDispatchDialogOpen}
        onOpenChange={setIsDispatchDialogOpen}
      />
      <main className="flex h-[calc(100vh-theme(spacing.16))] flex-col p-4 md:p-8">
        <div className="flex items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Funil de Vendas</h1>
          <Button onClick={() => setIsDispatchDialogOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            Disparo Segmentado
          </Button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
            <ScrollArea className="flex-1">
            <div className="flex h-full gap-4 pb-4">
                {stageIds.map((stageId) => (
                    <SortableContext key={stageId} items={prospectsByStage[stageId]?.map(p => p.id) || []} id={stageId}>
                        <div className="flex flex-col w-72 shrink-0">
                            <h2 className="text-lg font-semibold mb-2 px-2">{stageId} ({prospectsByStage[stageId]?.length || 0})</h2>
                            <Card className="flex-1 bg-secondary/50">
                                <CardContent className="p-2 h-full overflow-y-auto min-h-48">
                                    <div className="flex flex-col gap-2">
                                    {prospectsByStage[stageId]?.map((prospect) => (
                                        <ProspectCard key={prospect.id} prospect={prospect} />
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </SortableContext>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
            </ScrollArea>
           <DragOverlay>
                {activeProspect ? <ProspectCardSkeleton prospect={activeProspect} /> : null}
            </DragOverlay>
        </DndContext>
      </main>
    </>
  );
}
