import { db } from "./firebase";
import { collection, addDoc, getDocs, getDoc, query, where, doc, updateDoc, deleteDoc, orderBy, setDoc } from "firebase/firestore";
import { Proposal } from "@/types/proposal";

const PROPOSALS_COLLECTION = "proposals";

/**
 * Recursively sanitize an object for Firestore:
 * - Removes keys with `undefined` values from plain objects
 * - Replaces `undefined` with `null` inside arrays
 * - Converts non-plain class instances to plain objects
 * The most robust way to do this is a JSON roundtrip.
 */
function sanitizeForFirestore(value: unknown): unknown {
  try {
    if (value === undefined) return null;
    return JSON.parse(JSON.stringify(value));
  } catch (e) {
    console.error("Sanitization error", e);
    return null;
  }
}

/**
 * Compresses base64 images if they exceed maximum bounds.
 * Returns the original string if not a base64 image or if compression fails or times out.
 */
function compressImageIfNeeded(base64Str: string | undefined): Promise<string | undefined> {
  if (!base64Str || !base64Str.startsWith("data:image/")) {
    return Promise.resolve(base64Str);
  }
  return new Promise((resolve) => {
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(base64Str);
      }
    }, 1500);

    const img = new Image();
    img.onload = () => {
      if (resolved) return;
      const maxWidth = 800;
      const maxHeight = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        clearTimeout(timeout);
        resolved = true;
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      // Compress to JPEG with 0.7 quality to reduce file size drastically
      const compressed = canvas.toDataURL("image/jpeg", 0.7);
      clearTimeout(timeout);
      resolved = true;
      resolve(compressed);
    };
    img.onerror = () => {
      if (resolved) return;
      clearTimeout(timeout);
      resolved = true;
      resolve(base64Str);
    };
    img.src = base64Str;
  });
}

export async function saveProposal(proposal: Proposal) {
  try {
    const customId = proposal.client?.referenceId?.trim()?.replace(/[\s/]+/g, '-') || `WBZ-${Date.now()}`;
    const docRef = doc(db, PROPOSALS_COLLECTION, customId);

    // Compress base64 images to keep document size under Firestore's 1MB limit
    const compressedClientLogo = await compressImageIfNeeded(proposal.client?.clientLogoUrl);
    const compressedFlowchart = await compressImageIfNeeded(proposal.solution?.flowchartImageUrl);

    const clean = sanitizeForFirestore({
      ...proposal,
      client: {
        ...proposal.client,
        clientLogoUrl: compressedClientLogo || null
      },
      solution: {
        ...proposal.solution,
        flowchartImageUrl: compressedFlowchart || null
      },
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

    // Compress base64 images if they exist in the update
    const compressedClientLogo = await compressImageIfNeeded(proposal.client?.clientLogoUrl);
    const compressedFlowchart = await compressImageIfNeeded(proposal.solution?.flowchartImageUrl);

    const clean = sanitizeForFirestore({
      ...proposal,
      ...(proposal.client ? {
        client: {
          ...proposal.client,
          clientLogoUrl: compressedClientLogo || null
        }
      } : {}),
      ...(proposal.solution ? {
        solution: {
          ...proposal.solution,
          flowchartImageUrl: compressedFlowchart || null
        }
      } : {}),
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
