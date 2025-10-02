'use client';

import { collection, getDocs, Firestore, doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Prospect } from './data';

const initialProspectsData: Omit<Prospect, 'id'>[] = [
    { name: 'Ana Silva', company: 'Inovatech Soluções', email: 'ana.silva@inovatech.com', phone: '(11) 98765-4321', status: 'Proposta', lastContact: '2024-07-15', value: 50000, interactionHistory: "Visited pricing page 3 times. Downloaded e-book on 'Future of Tech'. Attended webinar on AI integration.", source: 'Website' },
    { name: 'Bruno Costa', company: 'Alpha Co', email: 'bruno.costa@alpha.co', phone: '(21) 91234-5678', status: 'Qualificação', lastContact: '2024-07-20', value: 75000, interactionHistory: "Opened 5 marketing emails. Clicked on a link to a case study. Filled out contact form.", source: 'Indicação' },
    { name: 'Carla Dias', company: 'MarketBoost', email: 'carla.dias@marketboost.com', phone: '(31) 99887-6543', status: 'Novo', lastContact: '2024-07-22', value: 30000, interactionHistory: "New lead from website form.", source: 'Anúncios' },
    { name: 'Daniel Martins', company: 'Conecta Redes', email: 'daniel.martins@conecta.net', phone: '(41) 98765-1234', status: 'Negociação', lastContact: '2024-07-18', value: 120000, interactionHistory: "Multiple meetings with sales team. Positive feedback on demo. Requested a custom proposal.", source: 'Feiras' },
    { name: 'Eduarda Ferreira', company: 'Global Transportes', email: 'eduarda.f@globaltrans.com', phone: '(51) 91234-8765', status: 'Fechado Ganho', lastContact: '2024-06-30', value: 95000, interactionHistory: "Long negotiation cycle. Signed contract last month.", source: 'Website' },
    { name: 'Fábio Souza', company: 'Beta Corp', email: 'fabio.souza@betacorp.com', phone: '(61) 99887-4321', status: 'Fechado Perdido', lastContact: '2024-07-05', value: 45000, interactionHistory: "Lost to competitor due to pricing.", source: 'Outros' },
    { name: 'Gabriela Lima', company: 'Inovatech Soluções', email: 'gabriela.lima@inovatech.com', phone: '(11) 98765-4322', status: 'Qualificação', lastContact: '2024-07-21', value: 62000, interactionHistory: "Engaged on social media posts. Asked a question via chat.", source: 'Website' },
    { name: 'Henrique Alves', company: 'Omega Inc.', email: 'henrique.alves@omega.com', phone: '(71) 91234-5679', status: 'Proposta', lastContact: '2024-07-19', value: 88000, interactionHistory: "Strong interest shown during product demo. Proposal sent.", source: 'Indicação' },
];

export async function seedInitialData(userId: string, db: Firestore) {
  // A flag to prevent multiple seeding attempts in the same session.
  if ((window as any).__hasSeeded) {
    console.log('Seeding already attempted in this session. Skipping.');
    return;
  }

  const prospectsRef = collection(db, 'users', userId, 'prospects');
  
  try {
    const snapshot = await getDocs(prospectsRef);
    if (snapshot.empty) {
      console.log('No existing prospects found for this user. Seeding initial data...');
      
      // Mark that seeding is being attempted.
      (window as any).__hasSeeded = true;

      // Use Promise.all to wait for all documents to be created.
      await Promise.all(initialProspectsData.map(prospectData => {
        const newProspectRef = doc(prospectsRef);
        return setDoc(newProspectRef, prospectData)
          .catch(error => {
            console.error(`Error seeding document:`, error);
            // Emit a detailed error for each failed write.
            errorEmitter.emit(
              'permission-error',
              new FirestorePermissionError({
                operation: 'create',
                path: newProspectRef.path,
                requestResourceData: prospectData,
              })
            );
          });
      }));

      console.log('Successfully seeded initial prospect data.');
    } else {
      console.log('Prospects already exist for this user. Skipping seed.');
       // Also mark as "seeded" if data already exists to prevent re-checks.
      (window as any).__hasSeeded = true;
    }
  } catch (error) {
    console.error('Error checking or seeding data:', error);
    // Emit a contextual error for permission issues on the initial read.
    const contextualError = new FirestorePermissionError({
        operation: 'list',
        path: prospectsRef.path,
    });
    errorEmitter.emit('permission-error', contextualError);
  }
}
