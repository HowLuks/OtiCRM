'use client';

import { collection, getDocs, writeBatch, Firestore, doc } from 'firebase/firestore';
import { initialProspectsData } from './data';

export async function seedInitialData(userId: string, db: Firestore) {
  const prospectsRef = collection(db, 'users', userId, 'prospects');
  
  try {
    const snapshot = await getDocs(prospectsRef);
    if (snapshot.empty) {
      console.log('No existing prospects found for this user. Seeding initial data...');
      const batch = writeBatch(db);
      
      const userProspectsCollection = collection(db, 'users', userId, 'prospects');

      initialProspectsData.forEach(prospect => {
        // Create a new document reference with an auto-generated ID within the user's prospects collection
        const newProspectRef = doc(userProspectsCollection);
        batch.set(newProspectRef, prospect);
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
