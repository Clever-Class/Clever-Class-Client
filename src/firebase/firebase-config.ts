import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAferNdTpptXQc9e3-bi_d0Zte_N1ON6J0',
  authDomain: 'clever-class-ai.firebaseapp.com',
  projectId: 'clever-class-ai',
  storageBucket: 'clever-class-ai.firebasestorage.app',
  messagingSenderId: '756823241030',
  appId: '1:756823241030:web:131c2a017a62985acf3547',
};

export const firebaseApp = initializeApp(firebaseConfig);
