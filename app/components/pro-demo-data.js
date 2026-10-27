// Made-up projects for the /pro demo (pro-board-demo.js). Shapes follow the
// Projects app's cards: a status, a "now" line, a next step, a freshness
// line, the chats behind the card and what happened on it.

export const PLATFORMS = { chatgpt: 'ChatGPT', claude: 'Claude', claude_code: 'Claude Code', codex: 'Codex', gemini: 'Gemini' };

const NEW_ACTIVITY = { tone: 'amber', text: 'New chat activity since the last update' };

export const PROJECTS = [
  {
    id: 'invoicing',
    name: 'Invoicing app',
    goal: 'Launch a simple invoicing app for small teams without losing decisions or promises to early customers.',
    repo: 'invoicing-app',
    topics: [{ id: 'billing', name: 'Billing' }, { id: 'onboarding', name: 'Onboarding' }, { id: 'launch', name: 'Launch' }],
    cards: [
      {
        id: 'refunds', topic: 'billing', title: 'Refund flow', status: 'active',
        text: 'Full refunds work end to end. Partial refunds still need their own test.',
        next: 'Add a test for partial refunds.', origin: 'Agreed in chat',
        fresh: NEW_ACTIVITY,
        goal: 'Customers can get a full or partial refund without emailing support.',
        approach: 'Refunds go through Stripe, so the invoice and the payment always match.',
        chats: [{ title: 'Partial refund tests', platform: 'claude_code', when: 'Today' }, { title: 'Refund rules for annual plans', platform: 'chatgpt', when: 'Mon' }, { title: 'Refund endpoint', platform: 'codex', when: '21 Oct' }],
        history: [{ date: 'Mon', text: 'Decided: refunds within 14 days, pro rata for annual plans' }, { date: '21 Oct', text: 'Refund endpoint built' }],
        updated: {
          status: 'reported_complete',
          text: 'Full and partial refunds both work. The partial refund test passes against the Stripe test account.',
          next: 'Try one partial refund yourself, then confirm.',
          history: [{ date: 'Today', text: 'Partial refund test added and passing' }, { date: 'Mon', text: 'Decided: refunds within 14 days, pro rata for annual plans' }, { date: '21 Oct', text: 'Refund endpoint built' }]
        }
      },
      {
        id: 'pdf', topic: 'billing', title: 'Invoice PDFs', status: 'waiting',
        text: 'The renderer works. VAT lines are needed before UK customers get invoices.',
        next: 'Add VAT lines to the invoice PDF.',
        fresh: NEW_ACTIVITY,
        goal: 'Every invoice is a correct PDF a customer can forward to their accountant.',
        approach: 'Render on the server so every invoice looks the same.',
        chats: [{ title: 'VAT on UK invoices', platform: 'chatgpt', when: 'Today' }, { title: 'Invoice PDF renderer', platform: 'codex', when: 'Wed' }],
        history: [{ date: 'Wed', text: 'PDF renderer working' }],
        updated: {
          status: 'active',
          text: 'VAT now shows on each line of the UK test invoice. The VAT total is still missing.',
          next: 'Add the VAT total at the bottom of the invoice.',
          history: [{ date: 'Today', text: 'VAT added to each invoice line' }, { date: 'Wed', text: 'PDF renderer working' }]
        }
      },
      {
        id: 'reminders', topic: 'billing', title: 'Payment reminders', status: 'parked',
        text: 'Parked until invoices have been live for a month, as agreed.',
        fresh: { tone: 'grey', text: 'Quiet for 2 weeks' },
        goal: 'Customers get a polite reminder before an invoice is overdue.',
        approach: 'Wait to see how often invoices are paid late.',
        chats: [{ title: 'Do we need payment reminders yet?', platform: 'claude', when: '13 Oct' }],
        history: [{ date: '13 Oct', text: 'Parked until invoices have been live for a month' }]
      },
      {
        id: 'trial-emails', topic: 'onboarding', title: 'Trial-ending emails', status: 'reported_complete',
        text: 'An assistant reported the three trial-ending emails written and scheduled.',
        next: 'Read the emails once, then confirm.',
        fresh: { tone: 'green', text: 'Updated yesterday' },
        goal: 'Trial users know what happens before their 14 days end.',
        approach: 'Three short emails: a week left, two days left, last day.',
        chats: [{ title: 'Trial email drafts', platform: 'chatgpt', when: 'Yesterday' }, { title: 'Free trial or free plan?', platform: 'claude', when: '20 Oct' }],
        history: [{ date: 'Yesterday', text: 'Three trial emails drafted and scheduled' }, { date: '20 Oct', text: 'Decided: 14-day free trial, no free plan' }]
      },
      {
        id: 'signup', topic: 'onboarding', title: 'Sign-up form', status: 'active',
        text: 'Email sign-up works. Google sign-in is half done.',
        next: 'Finish Google sign-in and test it once.',
        fresh: { tone: 'green', text: 'Updated yesterday' },
        goal: 'New teams can sign up in under a minute.',
        approach: 'Email first, then Google, no passwords to remember.',
        chats: [{ title: 'Sign-up with Google', platform: 'claude_code', when: 'Yesterday' }, { title: 'Sign-up form copy', platform: 'gemini', when: 'Tue' }],
        history: [{ date: 'Tue', text: 'Email sign-up working' }]
      },
      {
        id: 'invites', topic: 'onboarding', title: 'Team invites', status: 'parked',
        text: 'Parked until the first ten teams are using the app, as agreed.',
        fresh: { tone: 'grey', text: 'Quiet for 3 weeks' },
        goal: 'An owner can invite the rest of their team.',
        approach: 'Wait for real teams before building it.',
        chats: [{ title: 'Do we need team invites at launch?', platform: 'claude', when: '6 Oct' }],
        history: [{ date: '6 Oct', text: 'Parked until ten teams are using the app' }]
      },
      {
        id: 'pricing', topic: 'launch', title: 'Pricing page', status: 'waiting',
        text: 'One plan with a 14-day free trial, no free plan. The monthly price is still open.',
        next: 'Choose the monthly price.',
        fresh: { tone: 'green', text: 'Updated today' },
        ask: { kind: 'decision_needed', tag: 'DECIDE', question: 'Choose the monthly price: £12 or £15 per team.', why: 'The saved chats leave a decision for you.' },
        goal: 'Visitors understand the price and the trial in ten seconds.',
        approach: 'One plan, one price, a trial instead of a free tier.',
        chats: [{ title: 'Pricing page draft', platform: 'chatgpt', when: 'Today' }, { title: 'Free trial or free plan?', platform: 'claude', when: '20 Oct' }],
        history: [{ date: 'Today', text: 'Pricing page copy drafted' }]
      },
      {
        id: 'launch-post', topic: 'launch', title: 'Launch post', status: 'waiting',
        text: 'Outline done. The full draft is due Friday.',
        next: 'Write the full draft of the launch post.', origin: 'Agreed in chat',
        fresh: { tone: 'green', text: 'Updated yesterday' },
        goal: 'A launch post that explains the app in one read.',
        approach: 'Lead with the time saved, not the feature list.',
        chats: [{ title: 'Launch blog post outline', platform: 'gemini', when: 'Yesterday' }],
        history: [{ date: 'Yesterday', text: 'Launch post outlined in five sections' }]
      }
    ],
    done: ['Payment webhooks', 'Choose the billing provider', 'Invoice numbering', 'Company logo on invoices', 'Landing page headline', 'Domain and email set up']
  },
  {
    id: 'website',
    name: 'Launch website',
    goal: 'A fast marketing site that turns visitors into trial sign-ups.',
    repo: 'invoicing-site',
    topics: [{ id: 'pages', name: 'Pages' }],
    cards: [
      {
        id: 'headline', topic: 'pages', title: 'Homepage headline', status: 'active',
        text: 'The direction is chosen: lead with the time saved. Final wording still to pick.',
        next: 'Pick between the two shortlisted headlines.',
        fresh: { tone: 'green', text: 'Updated yesterday' },
        goal: 'A headline that says what the app does in one line.',
        approach: 'Lead with the time saved, not the feature list.',
        chats: [{ title: 'Homepage headline ideas', platform: 'chatgpt', when: 'Yesterday' }],
        history: [{ date: 'Yesterday', text: 'Decided: lead with the time saved' }]
      },
      {
        id: 'speed', topic: 'pages', title: 'Page speed', status: 'waiting',
        text: 'Images are compressed. Waiting on the new hosting plan before the last fix.',
        fresh: { tone: 'green', text: 'Updated 3 days ago' },
        goal: 'Every page loads in under a second.',
        approach: 'Static pages and small images.',
        chats: [{ title: 'Why is the homepage slow?', platform: 'claude_code', when: 'Fri' }],
        history: [{ date: 'Fri', text: 'Images compressed' }]
      }
    ],
    done: ['Pick a site builder', 'Logo files']
  },
  {
    id: 'mobile',
    name: 'Mobile app',
    goal: 'Let customers check invoices and payments from their phone.',
    repo: 'invoicing-mobile',
    topics: [{ id: 'screens', name: 'Screens' }],
    cards: [
      {
        id: 'invoice-list', topic: 'screens', title: 'Invoice list screen', status: 'active',
        text: 'The list loads and scrolls. Filters by paid and unpaid are next.',
        next: 'Add the paid and unpaid filter.',
        fresh: { tone: 'green', text: 'Updated today' },
        goal: 'See every invoice and its state at a glance.',
        approach: 'Same data as the web app, read only at first.',
        chats: [{ title: 'Invoice list in React Native', platform: 'codex', when: 'Today' }],
        history: [{ date: 'Today', text: 'Invoice list loads and scrolls' }]
      }
    ],
    done: ['Choose React Native']
  }
];
