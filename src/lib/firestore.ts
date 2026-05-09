import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";

export const db = getFirestore(firebaseApp);

export const col = (path: string) => collection(db, path);

export const add = (path: string, data: DocumentData) => addDoc(col(path), data);

export type FirestoreDoc = DocumentData & { id: string };

export const getAll = async (path: string): Promise<FirestoreDoc[]> => {
  const snapshot = await getDocs(col(path));
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
};

export const getOne = async (path: string, id: string): Promise<FirestoreDoc | null> => {
  const snapshot = await getDoc(doc(db, path, id));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const setOne = (path: string, id: string, data: DocumentData) =>
  setDoc(doc(db, path, id), data);

export const updateOne = (path: string, id: string, data: DocumentData) =>
  updateDoc(doc(db, path, id), data);

export const removeOne = (path: string, id: string) => deleteDoc(doc(db, path, id));
