'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ProspectsTable } from "@/components/prospects/prospects-table";
import { prospects as initialProspects, Prospect } from "@/lib/data";
import { AddProspectDialog } from '@/components/prospects/add-prospect-dialog';

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddProspect = (newProspect: Omit<Prospect, 'id' | 'status' | 'lastContact'>) => {
    const prospectToAdd: Prospect = {
      ...newProspect,
      id: (prospects.length + 1).toString(),
      status: 'Novo',
      lastContact: new Date().toISOString(),
    };
    setProspects(prev => [...prev, prospectToAdd]);
  };

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight">Prospects</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Prospect
            </Button>
          </div>
        </div>
        <div className="border shadow-sm rounded-lg">
          <ProspectsTable prospects={prospects} />
        </div>
      </main>
      <AddProspectDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddProspect={handleAddProspect}
      />
    </>
  );
}
