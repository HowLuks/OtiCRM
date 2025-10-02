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
      
      initialProspectsData.forEach(prospect => {
        // Correctly create a new document reference within the user's prospects collection
        const newProspectRef = doc(prospectsRef); 
        batch.set(newProspectRef, prospect);
      });

      // Add contextual error handling for the batch commit
      await batch.commit().catch(error => {
        console.error('Error committing seed data batch:', error);
        const contextualError = new FirestorePermissionError({
          operation: 'write', // 'write' is a general term for batch operations
          path: `users/${userId}/prospects`, // Path of the collection being written to
        });
        errorEmitter.emit('permission-error', contextualError);
      });

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
