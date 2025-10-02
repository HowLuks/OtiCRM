import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { funnelStages, prospects } from "@/lib/data";
import { DollarSign } from "lucide-react";

export default function FunilPage() {
  const prospectsByStage = funnelStages.map((stage) => ({
    stage,
    prospects: prospects.filter((p) => p.status === stage),
  }));

  return (
    <main className="flex h-[calc(100vh-theme(spacing.16))] flex-col p-4 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Funil de Vendas</h1>
      <ScrollArea className="flex-1">
        <div className="flex h-full gap-4 pb-4">
          {prospectsByStage.map(({ stage, prospects: stageProspects }) => (
            <div key={stage} className="flex flex-col w-72 shrink-0">
              <h2 className="text-lg font-semibold mb-2 px-2">{stage} ({stageProspects.length})</h2>
              <Card className="flex-1 bg-secondary/50">
                <CardContent className="p-2 h-full overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    {stageProspects.map((prospect) => (
                      <Link href={`/prospects/${prospect.id}`} key={prospect.id}>
                        <Card className="hover:bg-accent/50 transition-colors">
                          <CardHeader className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={prospect.avatar.imageUrl} alt={prospect.name} data-ai-hint={prospect.avatar.imageHint} />
                                <AvatarFallback>{prospect.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">{prospect.name}</CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                            <p>{prospect.company}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <DollarSign className="h-4 w-4" />
                                <span>{prospect.value.toLocaleString('pt-BR')}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </main>
  );
}
