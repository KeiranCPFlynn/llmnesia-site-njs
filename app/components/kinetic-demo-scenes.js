/*
 * Three configured KineticDemo scene sets with realistic, illustrative
 * (not real-user) content. Each is a drop-in `scenes` prop for <KineticDemo />.
 *
 * To add a new instance: export another array of { query, rows } objects,
 * where each row is { platform, title, snippet, date }. Supported platform
 * keys: chatgpt, claude, gemini, perplexity, deepseek, copilot, grok, mistral,
 * characterai, qwen, kimi, poe, notebooklm, metaai, aistudio.
 *
 * Every set MUST stay multi-platform. These scene sets are chosen by intent
 * family (recover / export / search), not by the post's platform, so a
 * single-platform set lands on pages about every other platform — and the
 * install CTA rendered beside the demo *is* platform-named, so the two
 * contradict each other. Multi-platform rows are also the honest claim: the
 * product's pitch is one search across all your AI tools.
 *
 * Queries repeat their key words inside each row's title and snippet on
 * purpose — KineticDemo highlights query terms in the results, so shared
 * wording is what makes the <mark> highlighting read as a real match.
 */

// "recover" — surfacing a conversation you assumed was gone. Queries are the
// half-remembered phrasing someone reaches for when they cannot find a chat.
export const recoverScenes = [
  {
    query: 'pricing model we worked out',
    rows: [
      {
        platform: 'chatgpt',
        title: 'The pricing model we worked out for the March launch',
        snippet: 'That pricing model settled on three tiers with an annual discount on the middle one.',
        date: '4 months ago'
      },
      {
        platform: 'claude',
        title: 'Pressure-test the pricing model assumptions',
        snippet: 'The weakest part of the pricing model was the assumed renewal rate.',
        date: '4 months ago'
      },
      {
        platform: 'gemini',
        title: 'Rebuild the pricing model sheet after it was overwritten',
        snippet: 'Recreated the pricing model formulas from the conversation where we worked them out.',
        date: '3 months ago'
      }
    ]
  },
  {
    query: 'visa paperwork checklist',
    rows: [
      {
        platform: 'copilot',
        title: 'Visa paperwork checklist for the relocation',
        snippet: 'The visa paperwork checklist covered the police certificate and proof of funds.',
        date: '2 months ago'
      },
      {
        platform: 'chatgpt',
        title: 'Which visa paperwork needs an apostille?',
        snippet: 'Only the birth certificate and the degree needed an apostille for the visa paperwork.',
        date: '2 months ago'
      },
      {
        platform: 'perplexity',
        title: 'Current processing times for visa paperwork',
        snippet: 'Visa paperwork was running six to eight weeks when the checklist was written.',
        date: '3 months ago'
      }
    ]
  },
  {
    query: 'roleplay about space colonies',
    rows: [
      {
        platform: 'characterai',
        title: 'The space colonies roleplay, picked up mid-thread',
        snippet: 'Your space colonies roleplay ran forty messages before the app cleared the thread.',
        date: '1 month ago'
      },
      {
        platform: 'claude',
        title: 'World-building rules for the space colonies story',
        snippet: 'The space colonies setting needed consistent gravity and water rationing rules.',
        date: '1 month ago'
      },
      {
        platform: 'grok',
        title: 'Faction name ideas for the space colonies',
        snippet: 'Faction names for the space colonies leaned on Latin roots and old mission numbers.',
        date: '2 months ago'
      }
    ]
  }
];

// "export" — the work you would be sick to lose, kept somewhere you control.
export const exportScenes = [
  {
    query: 'onboarding docs draft',
    rows: [
      {
        platform: 'claude',
        title: 'Draft the onboarding docs for new engineers',
        snippet: 'The onboarding docs draft covered environment setup and a first-week checklist.',
        date: '1 week ago'
      },
      {
        platform: 'chatgpt',
        title: 'Tighten the onboarding docs introduction',
        snippet: 'Cut the onboarding docs intro from four paragraphs down to one.',
        date: '2 weeks ago'
      },
      {
        platform: 'copilot',
        title: 'Onboarding docs formatting for the internal wiki',
        snippet: 'The onboarding docs needed heading levels matching the wiki template.',
        date: '3 weeks ago'
      }
    ]
  },
  {
    query: 'thesis literature review',
    rows: [
      {
        platform: 'perplexity',
        title: 'Sources for the thesis literature review',
        snippet: 'The thesis literature review still needed three more recent meta-analyses.',
        date: '5 days ago'
      },
      {
        platform: 'claude',
        title: 'Structure the thesis literature review by theme',
        snippet: 'A thematic thesis literature review read far better than a chronological one.',
        date: '2 weeks ago'
      },
      {
        platform: 'gemini',
        title: 'Citation format check on the thesis literature review',
        snippet: 'The thesis literature review citations needed APA 7th edition, not 6th.',
        date: '3 weeks ago'
      }
    ]
  },
  {
    query: 'the detective story we wrote',
    rows: [
      {
        platform: 'characterai',
        title: 'The detective story thread, sixty messages in',
        snippet: 'Your detective story built a full case file across sixty messages of roleplay.',
        date: '1 week ago'
      },
      {
        platform: 'chatgpt',
        title: 'Plot holes in the detective story ending',
        snippet: 'The detective story ending left the alibi completely unexplained.',
        date: '2 weeks ago'
      },
      {
        platform: 'mistral',
        title: 'Punchier title options for the detective story',
        snippet: 'Title options for the detective story leaned noir and stayed under four words.',
        date: '1 month ago'
      }
    ]
  }
];

// "search" — the multi-platform search moment, closest to the current hero.
export const searchScenes = [
  {
    query: 'mediterranean diet inflammation',
    rows: [
      {
        platform: 'perplexity',
        title: 'Mediterranean diet effects on chronic inflammation markers',
        snippet: 'Multiple cohorts show a mediterranean diet lowers CRP and other inflammation markers.',
        date: '6 days ago'
      },
      {
        platform: 'chatgpt',
        title: 'Build a mediterranean diet meal plan low in inflammation triggers',
        snippet: 'A mediterranean diet built on olive oil, fish, and greens limits inflammation triggers.',
        date: '2 weeks ago'
      },
      {
        platform: 'claude',
        title: 'Summarise this paper on mediterranean diet and inflammation',
        snippet: 'The paper finds mediterranean diet adherence correlates with reduced systemic inflammation.',
        date: '3 weeks ago'
      }
    ]
  },
  {
    query: 'kyoto itinerary 5 days',
    rows: [
      {
        platform: 'chatgpt',
        title: 'Kyoto itinerary 5 days with a side trip to Nara',
        snippet: 'A Kyoto itinerary of 5 days fits Higashiyama, Arashiyama, Fushimi, Nara, and a slow day.',
        date: '3 days ago'
      },
      {
        platform: 'perplexity',
        title: 'Kyoto itinerary 5 days for autumn maple season',
        snippet: 'Time a Kyoto itinerary of 5 days to mid-November for peak maples in the eastern hills.',
        date: '1 week ago'
      },
      {
        platform: 'gemini',
        title: 'Vegetarian food picks for a Kyoto itinerary of 5 days',
        snippet: 'Strong vegetarian options cluster around Daitoku-ji and Nishiki Market.',
        date: '1 month ago'
      }
    ]
  },
  {
    query: 'Q3 pricing rationale',
    rows: [
      {
        platform: 'chatgpt',
        title: 'Q3 pricing rationale memo for the board',
        snippet: 'The Q3 pricing rationale leans on retention, not net new ARR.',
        date: '2 days ago'
      },
      {
        platform: 'claude',
        title: 'Pressure-test the Q3 pricing rationale',
        snippet: 'The weakest part of the Q3 pricing rationale is the assumed annual mix.',
        date: '5 days ago'
      },
      {
        platform: 'gemini',
        title: 'Compare Q3 pricing rationale against last year',
        snippet: 'Last year the pricing rationale ignored geographic split — Q3 should fix that.',
        date: '2 weeks ago'
      }
    ]
  }
];
