'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shapes } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = () => {
    initiateAnonymousSignIn(auth);
  };

  if (isUserLoading || user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary">
            <p>Carregando...</p>
        </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Shapes className="h-7 w-7" />
                </div>
            </div>
          <CardTitle className="text-2xl">Bem-vindo ao OtiCRM</CardTitle>
          <CardDescription>
            Entre para otimizar suas vendas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button onClick={handleLogin}>
              Entrar como Visitante
            </Button>
            <p className="px-8 text-center text-sm text-muted-foreground">
                Clique para iniciar uma sessão anônima de demonstração.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
