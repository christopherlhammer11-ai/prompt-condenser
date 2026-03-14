export interface CondenseResult {
  original: string;
  condensed: string;
  stats: {
    originalTokens: number;
    condensedTokens: number;
    savedTokens: number;
    compressionPct: number;
  };
  changes: string[];
}

export interface CondenseOptions {
  /** Aggressiveness 1-3. 1=safe, 2=moderate, 3=aggressive. Default: 2 */
  level?: 1 | 2 | 3;
  /** Preserve code blocks verbatim. Default: true */
  preserveCode?: boolean;
  /** Preserve URLs verbatim. Default: true */
  preserveUrls?: boolean;
}

export interface BatchResult {
  results: CondenseResult[];
  totalSaved: number;
  totalOriginal: number;
  totalCondensed: number;
  overallCompressionPct: number;
}
