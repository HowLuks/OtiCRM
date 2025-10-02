import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ProspectsTable } from "@/components/prospects/prospects-table";

export default function ProspectsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight">Prospects</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Prospect
          </Button>
        </div>
      </div>
      <div className="border shadow-sm rounded-lg">
        <ProspectsTable />
      </div>
    </main>
  );
}
