import LZString from 'lz-string';
import type { MusicalPiece, DaySchedule, AppSettings } from '../App';

export interface SharedPlanData {
  pieces: MusicalPiece[];
  schedule: DaySchedule;
  settings: AppSettings;
}

const SHARE_PARAM = 'plan';
const BLOB_PARAM = 'id';
const SYNC_KEY_PARAM = 'planningMate_syncKey';

// Current logic for encoding to URL (legacy)
export function encodePlanToURL(data: SharedPlanData): string {
  const json = JSON.stringify(data);
  const compressed = LZString.compressToEncodedURIComponent(json);
  const url = new URL(window.location.href.split('?')[0].split('#')[0]);
  url.searchParams.set(SHARE_PARAM, compressed);
  return url.toString();
}

/**
 * Saves the plan to Netlify Blobs and returns a short-link URL.
 * If customId is provided, it overwrites that specific blob.
 */
export async function savePlanToBlob(data: SharedPlanData, customId?: string): Promise<string> {
  const response = await fetch('/.netlify/functions/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      id: customId, // If undefined, backend generates a random one
      data 
    })
  });

  if (!response.ok) {
    throw new Error('Failed to share plan');
  }

  const { id } = await response.json();
  const url = new URL(window.location.href.split('?')[0].split('#')[0]);
  url.searchParams.set(BLOB_PARAM, id);
  return url.toString();
}

/**
 * Gets the current local sync key
 */
export function getLocalSyncKey(): string | null {
  return localStorage.getItem(SYNC_KEY_PARAM);
}

/**
 * Sets the local sync key
 */
export function setLocalSyncKey(key: string): void {
  localStorage.setItem(SYNC_KEY_PARAM, key);
}

/**
 * Loads a plan from Netlify Blobs by ID
 */
export async function loadPlanFromBlob(id: string): Promise<SharedPlanData | null> {
  try {
    const response = await fetch(`/.netlify/functions/share?id=${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error loading plan from blob:', error);
    return null;
  }
}

export function decodePlanFromURL(): SharedPlanData | null {
  const params = new URLSearchParams(window.location.search);
  const compressed = params.get(SHARE_PARAM);
  if (!compressed) return null;

  try {
    const json = LZString.decompressFromEncodedURIComponent(compressed);
    if (!json) return null;

    const data = JSON.parse(json);
    if (!data.pieces || !data.schedule || !data.settings) return null;

    return data as SharedPlanData;
  } catch {
    return null;
  }
}

/**
 * Gets the shared blob ID from the URL if present
 */
export function getSharedId(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(BLOB_PARAM);
}

export function isSharedView(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.has(SHARE_PARAM) || params.has(BLOB_PARAM);
}

export function exitSharedView(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(SHARE_PARAM);
  url.searchParams.delete(BLOB_PARAM);
  window.history.replaceState({}, '', url.toString());
}
