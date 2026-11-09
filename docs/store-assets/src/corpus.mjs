// Invented demo chats for the store screenshot. Nothing from a real account.
// One shared word ("lisbon") so a single search returns one chat per platform.
export const CORPUS = [
  {
    id: 'aim-lisbon-month', platform: 'google_ai_mode', ageDays: 3,
    title: 'Best month to visit Lisbon',
    preview: 'Late May or September: warm, sunny and quieter than July.',
    messages: [
      ['user', 'Best month to go, without the crowds?'],
      ['assistant', 'For Lisbon, late May or September are the sweet spots: warm, sunny days around 24°C, sea still swimmable, and noticeably fewer crowds than July and August.']
    ]
  },
  {
    id: 'gpt-lisbon-itinerary', platform: 'chatgpt', ageDays: 9, models: ['GPT-5.6'],
    title: '4-day Lisbon itinerary with kids',
    preview: 'Day 1: Belém and the riverside. Day 2: Oceanário and Parque das Nações.',
    messages: [
      ['user', '4 days with kids aged 7 and 10?'],
      ['assistant', 'Here is an easy-going Lisbon plan. Day 1: Belém, the tower and pastéis de nata by the river. Day 2: the Oceanário and the cable car at Parque das Nações. Day 3: Tram 28 through Alfama, then the castle.']
    ]
  },
  {
    id: 'gem-lisbon-sintra', platform: 'gemini', ageDays: 22,
    title: 'Lisbon to Sintra day trip by train',
    preview: 'Trains leave Rossio station about every 20 minutes and take 40 minutes.',
    messages: [
      ['user', 'Sintra by train on a Saturday?'],
      ['assistant', 'From Lisbon, trains to Sintra leave Rossio station roughly every 20 minutes and take about 40 minutes. Go early on a Saturday: Pena Palace queues build after 10am.']
    ]
  },
  {
    id: 'claude-lisbon-ooo', platform: 'claude', ageDays: 14, models: ['Sonnet 5'],
    title: 'Out-of-office reply for the Lisbon trip',
    preview: 'Short, warm, and clear about who to contact while you are away.',
    messages: [
      ['user', 'Out-of-office reply?'],
      ['assistant', '"Thanks for your email. I am in Lisbon until 14 June with limited access to messages. For anything urgent, Sam (sam@example.com) can help. I will reply when I am back."']
    ]
  },
  {
    id: 'cai-lisbon-guide', platform: 'character_ai', ageDays: 30,
    title: 'Inês, Lisbon tour guide',
    preview: 'Bem-vindo! Shall we start with the viewpoints of Alfama?',
    messages: [
      ['user', 'Hi Inês! Show me the real city.'],
      ['assistant', 'Bem-vindo! The Lisbon I love starts at Miradouro da Graça at sunset, then grilled sardines in a tiny tasca in Mouraria where the menu is chalked on the wall.']
    ]
  }
];
