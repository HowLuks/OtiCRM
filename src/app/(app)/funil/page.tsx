'use client';

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
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
import { SortableContext } from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { funnelStages, type Prospect, type Status } from "@/lib/data";
import { Send, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedDispatchDialog } from "@/components/prospects/segmented-dispatch-dialog";
import { ProspectCard, ProspectCardSkeleton } from "@/components/prospects/prospect-card";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { cn } from "@/lib/utils";

type ProspectsByStage = Record<Status, Prospect[]>;

export default function FunilPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const prospectsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'prospects');
  }, [firestore, user]);

  const { data: prospectsData, isLoading } = useCollection<Prospect>(prospectsQuery);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);


  useEffect(() => {
    if (prospectsData) {
      setProspects(prospectsData);
    }
  }, [prospectsData]);
  
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

  const moveProspectToStage = (prospectId: string, newStage: Status) => {
    if (!user) return;
  
    // Optimistic UI Update
    setProspects(prev => {
      const activeItem = prev.find(p => p.id === prospectId);
      if (!activeItem) return prev;
  
      const updatedProspect = { ...activeItem, status: newStage };
      if (newStage === 'Fechado Ganho') {
        updatedProspect.lastContact = new Date().toISOString();
      }
      return prev.map(p => p.id === prospectId ? updatedProspect : p);
    });
  
    // Firestore Update
    const prospectRef = doc(firestore, 'users', user.uid, 'prospects', prospectId);
    const updateData: Partial<Prospect> = { status: newStage };
    if (newStage === 'Fechado Ganho') {
      updateData.lastContact = new Date().toISOString();
    }
    updateDocumentNonBlocking(prospectRef, updateData);
  };
  
  const handleMoveProspect = (prospectId: string, direction: 'prev' | 'next') => {
    const prospect = prospects.find(p => p.id === prospectId);
    if (!prospect) return;
  
    const currentStageIndex = funnelStages.indexOf(prospect.status);
    let nextStageIndex = direction === 'next' ? currentStageIndex + 1 : currentStageIndex - 1;
  
    if (nextStageIndex >= 0 && nextStageIndex < funnelStages.length) {
      moveProspectToStage(prospectId, funnelStages[nextStageIndex]);
    }
  };


  const handleDragEnd = (event: DragEndEvent) => {
    setActiveProspect(null);
    const { active, over } = event;
  
    if (!over || !user) return;
    
    const activeId = active.id as string;
    const overContainerId = findContainer(over.id as string);
  
    if (!overContainerId) return;
  
    const prospect = prospects.find(p => p.id === activeId);
    if (prospect && prospect.status !== overContainerId) {
      moveProspectToStage(activeId, overContainerId as Status);
    }
  };
  
  const findContainer = (id: string) => {
    if (stageIds.includes(id as Status)) {
      return id;
    }
    const prospect = prospects.find(p => p.id === id);
    return prospect?.status;
  };

  const checkScrollability = () => {
    const el = scrollViewportRef.current;
    if (el) {
      const hasHorizontalScrollbar = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(hasHorizontalScrollbar && el.scrollLeft < el.scrollWidth - el.clientWidth - 1); // -1 for precision
    }
  };

  const scrollBy = (distance: number) => {
    scrollViewportRef.current?.scrollBy({ left: distance, behavior: 'smooth' });
  };
  
  useEffect(() => {
    const scrollArea = scrollViewportRef.current;
    if (scrollArea) {
      checkScrollability();
      scrollArea.addEventListener('scroll', checkScrollability);
      
      const resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(scrollArea);

      return () => {
        scrollArea.removeEventListener('scroll', checkScrollability);
        resizeObserver.unobserve(scrollArea);
      };
    }
  }, [prospectsData]); 


  return (
    <>
      <SegmentedDispatchDialog
        open={isDispatchDialogOpen}
        onOpenChange={setIsDispatchDialogOpen}
        prospects={prospects || []}
      />
      <main className="flex h-[calc(100vh-theme(spacing.16))] flex-col">
        <div className="flex items-center mb-4 gap-4 px-4 pt-4 md:px-8 md:pt-8">
          <h1 className="text-2xl font-bold tracking-tight">Funil de Vendas</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={() => setIsDispatchDialogOpen(true)}>
                <Send className="mr-2 h-4 w-4" />
                Disparo Segmentado
            </Button>
            <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => scrollBy(-300)} disabled={!canScrollLeft}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Anterior</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => scrollBy(300)} disabled={!canScrollRight}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próximo</span>
                </Button>
            </div>
          </div>
        </div>
        <div className="relative flex-1 px-4 md:px-8 pb-4">
            <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            >
                <ScrollArea className="h-full" viewportRef={scrollViewportRef}>
                <div className="flex h-full gap-4 pb-4">
                    {stageIds.map((stageId) => (
                        <SortableContext key={stageId} items={prospectsByStage[stageId]?.map(p => p.id) || []} id={stageId}>
                            <div id={stageId} className="flex flex-col w-72 shrink-0">
                                <h2 className="text-lg font-semibold mb-2 px-2">{stageId} ({prospectsByStage[stageId]?.length || 0})</h2>
                                <Card className="flex-1 bg-secondary/50">
                                    <CardContent className="p-2 h-full overflow-y-auto min-h-48">
                                        <div className="flex flex-col gap-2">
                                        {(isLoading && !prospectsData) ? Array.from({length: 3}).map((_, i) => <ProspectCardSkeleton key={i} />) : 
                                        prospectsByStage[stageId]?.map((prospect) => (
                                            <ProspectCard 
                                                key={prospect.id} 
                                                prospect={prospect} 
                                                onMove={handleMoveProspect}
                                            />
                                        ))
                                        }
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
                    {activeProspect ? <ProspectCard prospect={activeProspect} isOverlay /> : null}
                </DragOverlay>
            </DndContext>
        </div>
      </main>
    </>
  );
}
