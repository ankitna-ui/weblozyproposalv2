/**
 * useSmartDraft — Auto-saves proposal form state to localStorage every 2 seconds.
 * On next visit, the draft is automatically detected and can be restored.
 */

import { useEffect, useRef, useCallback } from "react";
import { Proposal } from "@/types/proposal";

const DRAFT_KEY = "weblozy_proposal_draft_v2";
const DRAFT_STEP_KEY = "weblozy_proposal_draft_step_v2";
const DRAFT_TS_KEY = "weblozy_proposal_draft_ts_v2";
const DEBOUNCE_MS = 1500; // Save 1.5s after last change

export interface DraftMeta {
  hasDraft: boolean;
  draftTitle: string | null;
  draftTimestamp: number | null;
  draftStep: number;
}

/**
 * Read saved draft metadata without loading the full proposal object.
 */
export function readDraftMeta(): DraftMeta {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return { hasDraft: false, draftTitle: null, draftTimestamp: null, draftStep: 0 };
    const parsed: Proposal = JSON.parse(raw);
    const ts = Number(localStorage.getItem(DRAFT_TS_KEY) || "0");
    const step = Number(localStorage.getItem(DRAFT_STEP_KEY) || "0");
    return {
      hasDraft: true,
      draftTitle: parsed?.client?.proposalTitle || null,
      draftTimestamp: ts,
      draftStep: step,
    };
  } catch {
    return { hasDraft: false, draftTitle: null, draftTimestamp: null, draftStep: 0 };
  }
}

/**
 * Read the full saved draft proposal object.
 */
export function readDraftProposal(): Proposal | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Proposal;
  } catch {
    return null;
  }
}

/**
 * Clear the saved draft from localStorage.
 */
export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(DRAFT_STEP_KEY);
  localStorage.removeItem(DRAFT_TS_KEY);
}

/**
 * The main hook. Call it inside CreateProposal, passing current proposal and step.
 * It auto-saves after every change with debounce.
 */
export function useSmartDraft(proposal: Proposal, currentStep: number) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback((p: Proposal, step: number) => {
    try {
      // Omit very large blob fields to avoid localStorage quota issues
      const toSave: Proposal = {
        ...p,
        solution: {
          ...p.solution,
          // If the flowchart image is a base64 blob, skip saving it to localStorage
          flowchartImageUrl:
            p.solution?.flowchartImageUrl?.startsWith("data:") ? "" : p.solution?.flowchartImageUrl,
        },
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
      localStorage.setItem(DRAFT_STEP_KEY, String(step));
      localStorage.setItem(DRAFT_TS_KEY, String(Date.now()));
    } catch (e) {
      // Silently ignore quota errors
      console.warn("[SmartDraft] Could not save draft:", e);
    }
  }, []);

  useEffect(() => {
    // Debounce saves so we don't spam localStorage on every keystroke
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      save(proposal, currentStep);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [proposal, currentStep, save]);

  // Flush pending save on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}
