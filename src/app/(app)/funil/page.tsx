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
    const sortedProspects = [...prospects].sort((a, b) => {
        return funnelStages.indexOf(a.status) - funnelStages.indexOf(b.status);
    });

    return sortedProspects.reduce((acc, p) => {
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
      setProspects((prev) => {
        const activeIndex = prev.findIndex((p) => p.id === activeId);
        if (activeIndex === -1) {
          return prev;
        }

        let newIndex;
        // Dropping on a card
        const overIsCard = prev.some(p => p.id === overId);
        if (overIsCard) {
           newIndex = prev.findIndex((p) => p.id === overId);
        } else {
           // Dropping on a column (overId is the column id)
           const prospectsInOverContainer = prev.filter(p => p.status === overContainer);
           if (prospectsInOverContainer.length > 0) {
               // Get the last card in the column
               const lastCard = prospectsInOverContainer[prospectsInOverContainer.length - 1];
               newIndex = prev.findIndex(p => p.id === lastCard.id) + 1;
           } else {
               // The column is empty, find where to insert
               const overContainerIndex = stageIds.indexOf(overContainer as Status);
               // Find the first prospect in any subsequent column
               let firstProspectInNextStages: Prospect | undefined;
               for (let i = overContainerIndex + 1; i < stageIds.length; i++) {
                   firstProspectInNextStages = prev.find(p => p.status === stageIds[i]);
                   if (firstProspectInNextStages) break;
               }

               if(firstProspectInNextStages) {
                  newIndex = prev.findIndex(p => p.id === firstProspectInNextStages!.id);
               } else {
                  newIndex = prev.length;
               }
           }
        }
        
        const newProspects = arrayMove(prev, activeIndex, newIndex);
        
        // Update status of the moved prospect
        return newProspects.map(p => {
          if (p.id === activeId) {
            return { ...p, status: overContainer as Status };
          }
          return p;
        });
      });
    } else {
        // Moving within the same column
        setProspects((prev) => {
            const activeIndex = prev.findIndex((p) => p.id === activeId);
            const overIndex = prev.findIndex((p) => p.id === overId);
            if (activeIndex !== overIndex) {
              return arrayMove(prev, activeIndex, overIndex);
            }
            return prev;
        });
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
