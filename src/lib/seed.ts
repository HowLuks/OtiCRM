'use client';

import { collection, getDocs, writeBatch, Firestore } from 'firebase/firestore';
import { initialProspectsData } from './data';

export async function seedInitialData(userId: string, db: Firestore) {
  const prospectsRef = collection(db, 'users', userId, 'prospects');
  
  try {
    const snapshot = await getDocs(prospectsRef);
    if (snapshot.empty) {
      console.log('No existing prospects found for this user. Seeding initial data...');
      const batch = writeBatch(db);

      initialProspectsData.forEach(prospect => {
        const docRef = collection(db, 'users', userId, 'prospects');
        // Firestore will auto-generate an ID when using addDoc in a batch
        batch.set(doc(docRef), prospect);
      });

      await batch.commit();
      console.log('Successfully seeded initial prospect data.');
    } else {
      console.log('Prospects already exist for this user. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Helper function to get a doc reference for a batch write
import { doc } from 'firebase/firestore';
