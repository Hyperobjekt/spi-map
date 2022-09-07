import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

const firebase = initializeApp({
  apiKey: 'AIzaSyBev3DymCj11FvaNPiH5fbzsyUPGnD160g',
  authDomain: 'spi-map-5fc21.firebaseapp.com',
  projectId: 'spi-map-5fc21',
  storageBucket: 'spi-map-5fc21.appspot.com',
  messagingSenderId: '54606573448',
  appId: '1:54606573448:web:09fa7f82355f05cfc4143d',
  measurementId: 'G-MP8HGDHKHJ',
});

const auth = getAuth(firebase);
auth.useDeviceLanguage();
export { auth };

export const provider = new GoogleAuthProvider();

export const db = getFirestore(firebase);
export const users = collection(db, 'users');
export const addUser = (data) => addDoc(users, data);

// useAuthUser from react-query-firebase doesn't seem to retrigger correctly
// Using a custom implementation for now
export const useAuthUser = (key = 'user', options = {}) => {
  const [enabled, setEnabled] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setInitialLoading(false);
      setEnabled(!!user);
      if (!user) {
        queryClient.setQueryData(key, () => undefined);
        queryClient.removeQueries(key, () => undefined);
      } else {
        queryClient.invalidateQueries(key, { refetchActive: true, refetchInactive: true });
      }
    });
    return () => unsubscribe();
  }, [key, queryClient]);

  const query = useQuery(key, () => auth.currentUser, {
    ...options,
    enabled,
  });

  return {
    ...query,
    isLoading: initialLoading || query.isLoading,
  };
};
