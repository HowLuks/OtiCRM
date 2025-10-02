'use client';

import { collection, getDocs, writeBatch, Firestore, doc } from 'firebase/firestore';
import { initialProspectsData } from './data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function seedInitialData(userId: string, db: Firestore) {
  const prospectsRef = collection(db, 'users', userId, 'prospects');
  
  try {
    const snapshot = await getDocs(prospectsRef);
    if (snapshot.empty) {
      console.log('No existing prospects found for this user. Seeding initial data...');
      const batch = writeBatch(db);
      
      const userProspectsCollection = collection(db, 'users', userId, 'prospects');

      initialProspectsData.forEach(prospect => {
        const newProspectRef = doc(userProspectsCollection);
        batch.set(newProspectRef, prospect);
      });

      await batch.commit();
      console.log('Successfully seeded initial prospect data.');
    } else {
      console.log('Prospects already exist for this user. Skipping seed.');
    }
  } catch (error) {
    console.error('Error checking or seeding data:', error);
    // Emit a contextual error for permission issues on read
    const contextualError = new FirestorePermissionError({
        operation: 'list',
        path: prospectsRef.path,
    });
    errorEmitter.emit('permission-error', contextualError);
  }
}
