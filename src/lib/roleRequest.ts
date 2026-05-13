import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore';

export type RequestedRole = 'user';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface RoleRequest {
  requestedRole: RequestedRole;
  status: RequestStatus;
  requestedAt: unknown; // Firestore Timestamp
}

/**
 * Stellt einen Rollenantrag für den eingeloggten Nutzer.
 * Wirft einen Fehler wenn bereits ein offener Antrag existiert.
 */
export async function submitRoleRequest(
  userId: string,
  requestedRole: RequestedRole,
): Promise<void> {
  const ref = doc(db, 'roleRequests', userId);
  const snap = await getDoc(ref);

  if (snap.exists() && (snap.data() as RoleRequest).status === 'pending') {
    throw new Error('Es existiert bereits ein offener Antrag.');
  }

  await setDoc(ref, {
    requestedRole,
    status: 'pending',
    requestedAt: serverTimestamp(),
  } satisfies Omit<RoleRequest, 'requestedAt'> & { requestedAt: ReturnType<typeof serverTimestamp> });
}

/**
 * Gibt den aktuellen Antragsstatus des Nutzers zurück, oder null wenn keiner existiert.
 */
export async function getRoleRequestStatus(userId: string): Promise<RoleRequest | null> {
  const snap = await getDoc(doc(db, 'roleRequests', userId));
  if (!snap.exists()) return null;
  return snap.data() as RoleRequest;
}
