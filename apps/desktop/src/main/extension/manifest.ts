/**
 * Minimal `>=x.y.z` range check for croffle-manifest `engines.croffle`.
 * Unsupported range syntax fails closed (returns false).
 */
export function satisfiesCroffleEngine(appVersion: string, range: string | undefined): boolean {
  if (!range || !range.trim()) {
    return true;
  }

  const trimmed = range.trim();
  const match = /^>=\s*(\d+)\.(\d+)\.(\d+)$/.exec(trimmed);
  if (!match) {
    return false;
  }

  const need = [Number(match[1]), Number(match[2]), Number(match[3])] as const;
  const haveParts = appVersion
    .split(/[-+]/)[0]
    .split('.')
    .map((p) => Number(p));
  if (haveParts.length < 3 || haveParts.some((n) => Number.isNaN(n))) {
    return false;
  }
  const have = [haveParts[0], haveParts[1], haveParts[2]] as const;

  for (let i = 0; i < 3; i++) {
    if (have[i] > need[i]) {
      return true;
    }
    if (have[i] < need[i]) {
      return false;
    }
  }
  return true;
}

export const MANIFEST_FILENAME = 'croffle-manifest.json';
