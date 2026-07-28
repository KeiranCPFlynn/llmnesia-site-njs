/*
 * Three configured KineticDemo scene sets with realistic, illustrative
 * (not real-user) content. Each is a drop-in `scenes` prop for <KineticDemo />.
 *
 * To add a new instance: export another array of { query, rows } objects,
 * where each row is { platform, title, snippet, date }. Supported platform
 * keys: chatgpt, claude, gemini, perplexity, deepseek, copilot, grok, mistral,
 * characterai.
 */

// "recover" — finding conversations you thought were lost on Character.AI
// (history clears on device switch, hits soft caps, etc.)
export const recoverScenes = [
  {
    query: 'that roleplay we did about space colonies',
    rows: [
      {
        platform: 'characterai',
        title: 'Rebuilding a vanished Character.AI chat after switching phones',
        snippet: 'Your old space-colony RP resurfaced in device backup — the trick is restoring from iCloud before reinstalling the app.',
        date: '2 weeks ago'
      },
      {
        platform: 'characterai',
        title: 'Why your favourite character conversations disappeared',
        snippet: 'Character.AI clears chat threads on hard resets; backing up the app data restores every lost roleplay session.',
        date: '3 weeks ago'
      },
      {
        platform: 'characterai',
        title: 'Found old messages from my sci-fi world-building bot',
        snippet: 'A quick search for "colony rules" pulled the thread back from your archived chats — they were never deleted.',
        date: '1 month ago'
      }
    ]
  }
];

// "export" — backing up your Character.AI chat history before it's gone.
export const exportScenes = [
  {
    query: 'export my character.ai conversations',
    rows: [
      {
        platform: 'characterai',
        title: 'Save every Character.AI thread before hitting the history cap',
        snippet: 'Export your full chat log so old roleplay sessions and advice from your favourite bots are safe forever.',
        date: '5 days ago'
      },
      {
        platform: 'characterai',
        title: 'Backing up Roleplay chats on Character.AI without losing context',
        snippet: 'A simple export keeps your RP context intact — paste it back into a new session if the app clears it.',
        date: '2 weeks ago'
      },
      {
        platform: 'characterai',
        title: 'Character.AI export guide: keep your bot memories with you',
        snippet: 'Downloading your conversation archive means your bots remember every detail, even after a reinstall.',
        date: '3 weeks ago'
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
