'use client';

import { collection, getDocs, writeBatch, Firestore, doc, setDoc } from 'firebase/firestore';
import { initialProspectsData } from './data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
