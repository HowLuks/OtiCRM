'use client';

import { useState } from 'react';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ProspectsTable } from "@/components/prospects/prospects-table";
import { Prospect } from "@/lib/data";
import { AddProspectDialog } from '@/components/prospects/add-prospect-dialog';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function ProspectsPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const prospectsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'prospects');
  }, [firestore, user]);

  const { data: prospects, isLoading } = useCollection<Prospect>(prospectsQuery);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddProspect = (newProspect: Omit<Prospect, 'id' | 'status' | 'lastContact'>) => {
    if (!prospectsQuery) return;
    
    const prospectToAdd = {
      ...newProspect,
      status: 'Novo',
      lastContact: new Date().toISOString(),
    };
    
    addDocumentNonBlocking(prospectsQuery, prospectToAdd);
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
          <ProspectsTable prospects={prospects || []} isLoading={isLoading} />
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
