import LZString from 'lz-string';
import type { MusicalPiece, DaySchedule, AppSettings } from '../App';

export interface SharedPlanData {
  pieces: MusicalPiece[];
  schedule: DaySchedule;
  settings: AppSettings;
}

const SHARE_PARAM = 'plan';

export function encodePlanToURL(data: SharedPlanData): string {
  const json = JSON.stringify(data);
  const compressed = LZString.compressToEncodedURIComponent(json);
  const url = new URL(window.location.href.split('?')[0].split('#')[0]);
  url.searchParams.set(SHARE_PARAM, compressed);
  return url.toString();
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

export function isSharedView(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.has(SHARE_PARAM);
}

export function exitSharedView(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(SHARE_PARAM);
  window.history.replaceState({}, '', url.toString());
}
