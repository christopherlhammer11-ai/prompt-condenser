/**
 * Prompt condensation rules organized by aggressiveness level.
 * Each rule: [pattern, replacement, description]
 */

type Rule = [RegExp, string, string];

/**
 * Level 1 — Safe. Only removes obvious filler that never changes meaning.
 */
export const LEVEL_1_RULES: Rule[] = [
  // Filler phrases
  [/\bplease\s+/gi, '', 'remove "please"'],
  [/\bkindly\s+/gi, '', 'remove "kindly"'],
  [/\bbasically\b,?\s*/gi, '', 'remove "basically"'],
  [/\bessentially\b,?\s*/gi, '', 'remove "essentially"'],
  [/\bactually\b,?\s*/gi, '', 'remove "actually"'],
  [/\bliterally\b,?\s*/gi, '', 'remove "literally"'],
  [/\bjust\b\s+/gi, '', 'remove filler "just"'],
  [/\bsimply\b\s+/gi, '', 'remove "simply"'],
  [/\breally\b,?\s*/gi, '', 'remove "really"'],
  [/\bvery\b\s+/gi, '', 'remove "very"'],
  [/\bquite\b\s+/gi, '', 'remove "quite"'],

  // Redundant politeness
  [/\bI would like you to\b/gi, '', 'remove "I would like you to"'],
  [/\bI'd like you to\b/gi, '', 'remove "I\'d like you to"'],
  [/\bCould you please\b/gi, '', 'remove "Could you please"'],
  [/\bCan you please\b/gi, '', 'remove "Can you please"'],
  [/\bI need you to\b/gi, '', 'remove "I need you to"'],
  [/\bI want you to\b/gi, '', 'remove "I want you to"'],

  // Trailing filler
  [/\bif that makes sense\b\.?/gi, '', 'remove "if that makes sense"'],
  [/\bif you know what I mean\b\.?/gi, '', 'remove "if you know what I mean"'],
  [/\bdoes that make sense\??\s*/gi, '', 'remove "does that make sense"'],
  [/\bthank you\.?\s*/gi, '', 'remove "thank you"'],
  [/\bthanks in advance\.?\s*/gi, '', 'remove "thanks in advance"'],

  // Whitespace cleanup
  [/\s{2,}/g, ' ', 'collapse whitespace'],
  [/\n{3,}/g, '\n\n', 'collapse blank lines'],
];

/**
 * Level 2 — Moderate. Tightens phrasing and removes verbosity.
 */
export const LEVEL_2_RULES: Rule[] = [
  // Verbose → concise
  [/\bin order to\b/gi, 'to', 'shorten "in order to"'],
  [/\bdue to the fact that\b/gi, 'because', 'shorten "due to the fact that"'],
  [/\bfor the purpose of\b/gi, 'to', 'shorten "for the purpose of"'],
  [/\bin the event that\b/gi, 'if', 'shorten "in the event that"'],
  [/\bat this point in time\b/gi, 'now', 'shorten "at this point in time"'],
  [/\bat the present time\b/gi, 'now', 'shorten "at the present time"'],
  [/\bin the near future\b/gi, 'soon', 'shorten "in the near future"'],
  [/\bwith regard to\b/gi, 'about', 'shorten "with regard to"'],
  [/\bwith respect to\b/gi, 'about', 'shorten "with respect to"'],
  [/\bin regard to\b/gi, 'about', 'shorten "in regard to"'],
  [/\bpertaining to\b/gi, 'about', 'shorten "pertaining to"'],
  [/\bin spite of\b/gi, 'despite', 'shorten "in spite of"'],
  [/\bby means of\b/gi, 'by', 'shorten "by means of"'],
  [/\bon account of\b/gi, 'because', 'shorten "on account of"'],
  [/\bhas the ability to\b/gi, 'can', 'shorten "has the ability to"'],
  [/\bis able to\b/gi, 'can', 'shorten "is able to"'],
  [/\bare able to\b/gi, 'can', 'shorten "are able to"'],
  [/\bhas the capacity to\b/gi, 'can', 'shorten "has the capacity to"'],
  [/\bit is important to note that\b/gi, 'note:', 'shorten "it is important to note that"'],
  [/\bit should be noted that\b/gi, 'note:', 'shorten "it should be noted that"'],
  [/\bplease note that\b/gi, 'note:', 'shorten "please note that"'],
  [/\bkeep in mind that\b/gi, 'note:', 'shorten "keep in mind that"'],
  [/\bmake sure to\b/gi, 'ensure', 'shorten "make sure to"'],
  [/\bmake sure that\b/gi, 'ensure', 'shorten "make sure that"'],
  [/\ba large number of\b/gi, 'many', 'shorten "a large number of"'],
  [/\ba small number of\b/gi, 'few', 'shorten "a small number of"'],
  [/\bthe majority of\b/gi, 'most', 'shorten "the majority of"'],
  [/\ba variety of\b/gi, 'various', 'shorten "a variety of"'],
  [/\bin addition to\b/gi, 'besides', 'shorten "in addition to"'],
  [/\bas well as\b/gi, 'and', 'shorten "as well as"'],
  [/\bon the other hand\b/gi, 'however', 'shorten "on the other hand"'],
  [/\bin other words\b/gi, 'i.e.', 'shorten "in other words"'],
  [/\bfor example\b/gi, 'e.g.', 'shorten "for example"'],
  [/\bsuch as\b/gi, 'e.g.', 'shorten "such as"'],

  // Redundant instruction phrasing
  [/\bYou are a helpful assistant\.?\s*/gi, '', 'remove generic role statement'],
  [/\bYou are an AI assistant\.?\s*/gi, '', 'remove generic role statement'],
  [/\bAs an AI language model,?\s*/gi, '', 'remove self-referential filler'],
  [/\bWhen responding,?\s*/gi, '', 'remove "when responding"'],
  [/\bIn your response,?\s*/gi, '', 'remove "in your response"'],
  [/\bRemember to\b/gi, '', 'remove "remember to"'],
];

/**
 * Level 3 — Aggressive. Strips all non-essential language.
 */
export const LEVEL_3_RULES: Rule[] = [
  // Strip all hedging
  [/\bI think\b\s*/gi, '', 'remove hedging "I think"'],
  [/\bI believe\b\s*/gi, '', 'remove hedging "I believe"'],
  [/\bperhaps\b,?\s*/gi, '', 'remove "perhaps"'],
  [/\bmaybe\b,?\s*/gi, '', 'remove "maybe"'],
  [/\bpossibly\b,?\s*/gi, '', 'remove "possibly"'],
  [/\bprobably\b,?\s*/gi, '', 'remove "probably"'],
  [/\bit seems like\b\s*/gi, '', 'remove "it seems like"'],
  [/\bit appears that\b\s*/gi, '', 'remove "it appears that"'],

  // Strip examples intros
  [/\bFor instance,?\s*/gi, '', 'remove "for instance"'],
  [/\bTo illustrate,?\s*/gi, '', 'remove "to illustrate"'],
  [/\bConsider the following:?\s*/gi, '', 'remove "consider the following"'],

  // Strip meta-commentary
  [/\bLet me explain\.?\s*/gi, '', 'remove "let me explain"'],
  [/\bHere's what I mean:?\s*/gi, '', 'remove "here\'s what I mean"'],
  [/\bTo be more specific,?\s*/gi, '', 'remove "to be more specific"'],
  [/\bTo clarify,?\s*/gi, '', 'remove "to clarify"'],
  [/\bIn summary,?\s*/gi, '', 'remove "in summary"'],
  [/\bTo summarize,?\s*/gi, '', 'remove "to summarize"'],
  [/\bOverall,?\s*/gi, '', 'remove "overall"'],

  // Compress list intros
  [/\bThe following (?:is|are) (?:the |a )?(?:list of |)(?:the |)?/gi, '', 'compress list intro'],
  [/\bHere (?:is|are) (?:the |a )?(?:list of |)(?:the |)?/gi, '', 'compress "here is/are"'],
];

export function getRulesForLevel(level: 1 | 2 | 3): Rule[] {
  switch (level) {
    case 1: return LEVEL_1_RULES;
    case 2: return [...LEVEL_1_RULES, ...LEVEL_2_RULES];
    case 3: return [...LEVEL_1_RULES, ...LEVEL_2_RULES, ...LEVEL_3_RULES];
  }
}
