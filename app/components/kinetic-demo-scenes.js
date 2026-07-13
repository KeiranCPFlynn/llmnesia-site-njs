/*
 * Three configured KineticDemo scene sets with realistic, illustrative
 * (not real-user) content. Each is a drop-in `scenes` prop for <KineticDemo />.
 *
 * To add a new instance: export another array of { query, rows } objects,
 * where each row is { platform, title, snippet, date }. Supported platform
 * keys: chatgpt, claude, gemini, perplexity, deepseek, copilot, grok, mistral.
 */

// "recover" — finding a chat you thought was lost, spanning ChatGPT + Claude.
export const recoverScenes = [
  {
    query: 'that thread where we fixed the deploy script',
    rows: [
      {
        platform: 'claude',
        title: 'Debugging the failing deploy script rollback step',
        snippet: 'The rollback failed because the health check ran before the container was ready.',
        date: '9 days ago'
      },
      {
        platform: 'chatgpt',
        title: 'Deploy script: retry logic and exit codes',
        snippet: 'Wrap the deploy in a retry loop and fail fast on a non-zero exit from the migration.',
        date: '2 weeks ago'
      },
      {
        platform: 'chatgpt',
        title: 'Why the deploy script skipped the cache purge',
        snippet: 'The cache purge was gated behind an env var that was unset in staging.',
        date: '3 weeks ago'
      }
    ]
  }
];

// "export" — questions about exporting / saving / backing up history.
export const exportScenes = [
  {
    query: 'export my chat history to a file',
    rows: [
      {
        platform: 'chatgpt',
        title: 'Export ChatGPT history as JSON and Markdown',
        snippet: 'Use the data export in settings, then convert the conversations.json to Markdown per chat.',
        date: '4 days ago'
      },
      {
        platform: 'claude',
        title: 'Back up Claude conversations before clearing them',
        snippet: 'Save each thread to a portable file you own so nothing is lost when you clean up.',
        date: '1 week ago'
      },
      {
        platform: 'gemini',
        title: 'Download Gemini activity from Google Takeout',
        snippet: 'Gemini history lives in Takeout — pick the Gemini Apps data and export as a zip.',
        date: '2 weeks ago'
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
