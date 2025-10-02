'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Prospect, funnelStages } from "@/lib/data";
import { DollarSign, GripVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

interface ProspectCardProps {
  prospect: Prospect;
  isOverlay?: boolean;
  onMove?: (prospectId: string, direction: 'prev' | 'next') => void;
}

export function ProspectCard({ prospect, isOverlay, onMove }: ProspectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: prospect.id,
    data: {
      type: 'Prospect',
      prospect,
    },
    disabled: !onMove, // Disable sorting if onMove is not provided (e.g., in overlay)
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const currentStageIndex = funnelStages.indexOf(prospect.status);
  const canMovePrev = currentStageIndex > 0 && !['Fechado Ganho', 'Fechado Perdido'].includes(funnelStages[currentStageIndex -1]);
  const canMoveNext = currentStageIndex < funnelStages.length - 1 && !['Fechado Ganho', 'Fechado Perdido'].includes(prospect.status);
  const finalStages = ['Fechado Ganho', 'Fechado Perdido'];


  const cardContent = (
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
            "hover:bg-accent/80 transition-colors flex flex-col relative group",
            isDragging && 'opacity-50',
            isOverlay && 'ring-2 ring-primary shadow-lg'
        )}
      >
        <button {...attributes} {...listeners} className="absolute left-1 top-1/2 -translate-y-1/2 p-2 text-muted-foreground/50 cursor-grab active:cursor-grabbing transition-colors hover:text-muted-foreground">
            <GripVertical className="h-5 w-5" />
        </button>

        {onMove && !finalStages.includes(prospect.status) && (
            <div className="absolute top-1 right-1 z-10 flex opacity-0 transition-opacity group-hover:opacity-100">
                {canMovePrev && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMove(prospect.id, 'prev')}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
                {canMoveNext && (
                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMove(prospect.id, 'next')}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        )}

        <CardHeader className="p-4 pl-10 flex-grow">
          <div>
            <Link href={`/prospects/${prospect.id}`}>
                <CardTitle className="text-base hover:underline">{prospect.name}</CardTitle>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 pl-10 pt-0 text-sm text-muted-foreground">
          <p>{prospect.company}</p>
          <div className="flex items-center gap-1 mt-2">
            <DollarSign className="h-4 w-4" />
            <span>{prospect.value.toLocaleString('pt-BR')}</span>
          </div>
        </CardContent>
      </Card>
  );

  if (isDragging) {
      return (
          <div
            ref={setNodeRef}
            style={style}
            className="h-[148px] rounded-lg border-2 border-dashed bg-secondary"
          />
      )
  }

  return cardContent;
}

export function ProspectCardSkeleton({ prospect }: { prospect?: Prospect }) {
  if (!prospect) {
      return (
        <Card className="flex flex-col">
            <CardHeader className="p-4 pl-10 flex-grow">
                <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="p-4 pl-10 pt-0 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
            </CardContent>
        </Card>
      )
  }
  return (
    <Card className="ring-2 ring-primary flex flex-col opacity-90 shadow-lg">
        <button className="absolute left-1 top-1/2 -translate-y-1/2 p-2 text-muted-foreground cursor-grabbing">
            <GripVertical className="h-5 w-5" />
        </button>
        <CardHeader className="p-4 pl-10 flex-grow">
          <div>
            <CardTitle className="text-base">{prospect.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pl-10 pt-0 text-sm text-muted-foreground">
          <p>{prospect.company}</p>
          <div className="flex items-center gap-1 mt-2">
            <DollarSign className="h-4 w-4" />
            <span>{prospect.value.toLocaleString('pt-BR')}</span>
          </div>
        </CardContent>
      </Card>
  );
}
