const STORAGE_KEY = "training-ground-recent-clubs-v1";

export type RecentClub = {
  chain: string;
  address: string;
  label?: string;
  savedAt: number;
};

function safeParse(raw: string | null): RecentClub[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v
      .filter(
        (x): x is RecentClub =>
          typeof x === "object" &&
          x != null &&
          typeof (x as RecentClub).chain === "string" &&
          typeof (x as RecentClub).address === "string" &&
          typeof (x as RecentClub).savedAt === "number"
      )
      .slice(0, 6);
  } catch {
    return [];
  }
}

export function loadRecentClubs(): RecentClub[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(STORAGE_KEY)).sort(
    (a, b) => b.savedAt - a.savedAt
  );
}

export function rememberClub(
  chain: string,
  address: string,
  label?: string
): void {
  if (typeof window === "undefined") return;
  const prev = safeParse(localStorage.getItem(STORAGE_KEY));
  const next = [
    { chain, address, label, savedAt: Date.now() },
    ...prev.filter(
      (c) =>
        !(
          c.chain === chain &&
          c.address.toLowerCase() === address.toLowerCase()
        )
    ),
  ].slice(0, 6);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
