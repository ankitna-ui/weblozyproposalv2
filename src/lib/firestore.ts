import { db } from "./firebase";
import { collection, addDoc, getDocs, getDoc, query, where, doc, updateDoc, deleteDoc, orderBy, setDoc } from "firebase/firestore";
import { Proposal } from "@/types/proposal";

const PROPOSALS_COLLECTION = "proposals";

/**
 * Recursively sanitize an object for Firestore:
 * - Removes keys with `undefined` values from plain objects
 * - Replaces `undefined` with `null` inside arrays (Firestore requires defined array items)
 * - Converts NaN to null
 */
function sanitizeForFirestore(value: unknown): unknown {
  if (value === undefined) return null;
  if (value === null) return null;
  if (typeof value === "number") return isNaN(value) ? null : value;
  if (typeof value !== "object") return value;

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForFirestore(item));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (val === undefined) continue; // drop undefined keys
    sanitized[key] = sanitizeForFirestore(val);
  }
  return sanitized;
}

export async function saveProposal(proposal: Proposal) {
  try {
    const customId = proposal.client?.referenceId?.trim()?.replace(/[\s/]+/g, '-') || `WBZ-${Date.now()}`;
    const docRef = doc(db, PROPOSALS_COLLECTION, customId);
    const clean = sanitizeForFirestore({
      ...proposal,
      id: customId,
      updatedAt: Date.now()
    }) as Record<string, unknown>;
    await setDoc(docRef, clean);
    return customId;
  } catch (error) {
    console.error("Error saving proposal:", error);
    throw error;
  }
}

export async function updateProposal(id: string, proposal: Partial<Proposal>) {
  try {
    const docRef = doc(db, PROPOSALS_COLLECTION, id);
    const clean = sanitizeForFirestore({
      ...proposal,
      updatedAt: Date.now()
    }) as Record<string, unknown>;
    await updateDoc(docRef, clean);
  } catch (error) {
    console.error("Error updating proposal:", error);
    throw error;
  }
}

export async function getProposal(id: string) {
  try {
    const docRef = doc(db, PROPOSALS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Proposal) };
    }
    return null;
  } catch (error) {
    console.error("Error fetching proposal:", error);
    throw error;
  }
}

export async function getProposals(userId: string) {
  try {
    const q = query(
      collection(db, PROPOSALS_COLLECTION), 
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const proposals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Proposal)
    }));

    // Sort in memory to avoid needing a Firebase composite index
    return proposals.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    throw error;
  }
}

/**
 * Delete a proposal with security check.
 * BOLA Protection: Enforced via firestore.rules
 */
export async function deleteProposal(id: string) {
  try {
    await deleteDoc(doc(db, PROPOSALS_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting proposal:", error);
    throw error;
  }
}
