export interface BlogImageConfig {
  mode: "shared" | "separate";
  shared: string[];
  vi: string[];
  en: string[];
}

export function parseBlogImages(raw: string | null | undefined): BlogImageConfig {
  if (!raw || !raw.trim()) {
    return { mode: "shared", shared: [], vi: [], en: [] };
  }
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      const cleanArr = (arr: unknown): string[] =>
        Array.isArray(arr)
          ? arr
              .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
              .map((x) => x.trim())
          : [];
      const shared = cleanArr(parsed.shared);
      const vi = cleanArr(parsed.vi);
      const en = cleanArr(parsed.en);
      const mode: "shared" | "separate" =
        parsed.mode === "separate" ||
        (shared.length === 0 && (vi.length > 0 || en.length > 0))
          ? "separate"
          : "shared";
      return { mode, shared, vi, en };
    } catch {
      // Fallback to treating as single URL
    }
  }
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const shared = parsed
          .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
          .map((x) => x.trim());
        return { mode: "shared", shared, vi: [], en: [] };
      }
    } catch {
      // Fallback
    }
  }
  return { mode: "shared", shared: [trimmed], vi: [], en: [] };
}

export function serializeBlogImages(config: BlogImageConfig): string {
  const shared = config.shared.map((u) => u.trim()).filter(Boolean);
  const vi = config.vi.map((u) => u.trim()).filter(Boolean);
  const en = config.en.map((u) => u.trim()).filter(Boolean);

  if (config.mode === "shared") {
    if (shared.length === 0) return "";
    if (shared.length === 1 && vi.length === 0 && en.length === 0) {
      return shared[0];
    }
    return JSON.stringify({ mode: "shared", shared, vi, en });
  }

  if (vi.length === 0 && en.length === 0 && shared.length === 0) return "";
  return JSON.stringify({ mode: "separate", shared, vi, en });
}

export function resolveBlogImages(
  raw: string | null | undefined,
  lang: "vi" | "en" = "vi",
): {
  cover: string;
  images: string[];
  mode: "shared" | "separate";
  hasVi: boolean;
  hasEn: boolean;
  viCount: number;
  enCount: number;
  sharedCount: number;
} {
  const cfg = parseBlogImages(raw);
  const hasVi = cfg.vi.length > 0;
  const hasEn = cfg.en.length > 0;

  let activeList: string[] = [];
  if (cfg.mode === "separate") {
    const primary = lang === "vi" ? cfg.vi : cfg.en;
    const secondary = lang === "vi" ? cfg.en : cfg.vi;
    if (primary.length > 0) {
      activeList = primary;
    } else if (secondary.length > 0) {
      activeList = secondary;
    } else {
      activeList = cfg.shared;
    }
  } else {
    if (cfg.shared.length > 0) {
      activeList = cfg.shared;
    } else if (lang === "vi" && cfg.vi.length > 0) {
      activeList = cfg.vi;
    } else if (lang === "en" && cfg.en.length > 0) {
      activeList = cfg.en;
    } else {
      activeList = cfg.vi.length > 0 ? cfg.vi : cfg.en;
    }
  }

  return {
    cover: activeList[0] ?? "",
    images: activeList,
    mode: cfg.mode,
    hasVi,
    hasEn,
    viCount: cfg.vi.length,
    enCount: cfg.en.length,
    sharedCount: cfg.shared.length,
  };
}
