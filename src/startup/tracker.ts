// Startup Tracker — all domain types, seed data, and insight generators

export interface CompanyProfile {
  name: string;
  stage: 'pre-seed' | 'seed' | 'series-a';
  foundedDate: string;
  teamSize: number;
  location: string;
  oneLiner: string;
  description: string;
  mission: string;
  vision: string;
}

export interface RunwayData {
  currentRunwayMonths: number;
  monthlyBurnRate: number;
  monthlyRevenue: number;
  lastFundingAmount: number;
  fundingHistory: { date: string; amount: number; source: string; type: string }[];
  monthlySpending: { category: string; amount: number }[];
  lastUpdated: string;
}

export interface Investor {
  id: string;
  name: string;
  firm: string;
  stage: string;
  amount: number;
  date: string;
  status: 'cold' | 'warm' | 'meeting' | 'due-diligence' | 'term-sheet' | 'signed' | 'passed';
  notes: string[];
  followUpDate: string;
  lastContact: string;
}

export interface PitchVersion {
  version: number;
  date: string;
  feedback: string[];
  changes: string[];
  investorsWhoSaw: string[];
  conversionRate: number;
  deckUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  stage: 'prospect' | 'trial' | 'paying' | 'churned';
  feedbackQuotes: string[];
  featureRequests: string[];
  npsScore: number | null;
  cac: number;
  ltv: number;
  startDate: string;
  lastContact: string;
}

export interface Decision {
  id: string;
  date: string;
  decision: string;
  optionsConsidered: string[];
  chosenOption: string;
  rationale: string;
  outcome: 'positive' | 'negative' | 'unclear';
  whatWeLearned: string;
}

export interface Competitor {
  id: string;
  name: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  marketPosition: string;
  lastUpdated: string;
  howWeDifferentiate: string;
}

export interface Metrics {
  mrr: number;
  churnRate: number;
  dau: number;
  conversionFunnel: { stage: string; count: number }[];
  weeklyChange: { mrr: number; churn: number; dau: number; conversion: number };
  trend: 'up' | 'down' | 'flat';
  lastUpdated: string;
}

export interface HuddleSummary {
  date: string;
  yesterdaysWins: string[];
  todaysFocus: string[];
  blockers: string[];
  investorUpdateNeeded: boolean;
  teamChanges: string;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

export const SEED_COMPANY: CompanyProfile = {
  name: 'Launchkit',
  stage: 'pre-seed',
  foundedDate: '2025-10-15',
  teamSize: 4,
  location: 'San Francisco, CA',
  oneLiner: 'Developer tools that turn API integrations into a competitive advantage.',
  description: 'Launchkit provides a unified API layer that lets SaaS companies ship integrations 10x faster. Instead of building and maintaining custom connectors for every platform, developers use Launchkit to configure, deploy, and monitor integrations from a single dashboard. We handle auth, rate limiting, webhooks, and error recovery so engineering teams can focus on their core product.',
  mission: 'Eliminate integration debt for every SaaS company.',
  vision: 'Every SaaS product ships with world-class integrations on day one, powered by Launchkit.',
};

export const SEED_RUNWAY: RunwayData = {
  currentRunwayMonths: 8,
  monthlyBurnRate: 15000,
  monthlyRevenue: 2400,
  lastFundingAmount: 180000,
  fundingHistory: [
    { date: '2025-11-01', amount: 50000, source: 'Friends & Family', type: 'Convertible Note' },
    { date: '2025-12-15', amount: 80000, source: 'Angel syndicate led by Mira Chen', type: 'SAFE' },
    { date: '2026-01-20', amount: 50000, source: 'Pre-seed program (Techstars)', type: 'SAFE' },
  ],
  monthlySpending: [
    { category: 'Engineering (infra + tools)', amount: 4500 },
    { category: 'Salaries (founders)', amount: 0 },
    { category: 'Cloud hosting (AWS)', amount: 2800 },
    { category: 'Marketing / content', amount: 1200 },
    { category: 'Legal & accounting', amount: 1800 },
    { category: 'Office / coworking', amount: 800 },
    { category: 'SaaS subscriptions', amount: 900 },
    { category: 'Travel & meetings', amount: 600 },
    { category: 'Misc', amount: 2400 },
  ],
  lastUpdated: '2026-04-01',
};

export const SEED_INVESTORS: Investor[] = [
  {
    id: 'inv-1', name: 'Mira Chen', firm: 'Horizon Ventures', stage: 'Pre-seed', amount: 80000,
    date: '2025-12-15', status: 'signed',
    notes: ['Led our angel round. Strong believer in dev tools thesis.', 'Wants to follow on in seed round.', 'Introduced us to 2 other angels.'],
    followUpDate: '2026-05-01', lastContact: '2026-03-28',
  },
  {
    id: 'inv-2', name: 'James Whitfield', firm: 'Pioneer Fund', stage: 'Seed', amount: 500000,
    date: '2026-03-10', status: 'due-diligence',
    notes: ['Met at SF Tech Meetup. Very interested in our traction.', 'Requested data room access — sent 3/15.', 'Asked about churn — showed cohort data.', 'Came back with follow-up questions on NDR calculations.'],
    followUpDate: '2026-04-05', lastContact: '2026-03-30',
  },
  {
    id: 'inv-3', name: 'Sarah Kim', firm: 'Basecase Capital', stage: 'Seed', amount: 400000,
    date: '2026-03-05', status: 'warm',
    notes: ['Referred by Mira Chen.', 'Had intro call — liked the space, wants to see more traction.', 'Following up with updated metrics after Q1 close.'],
    followUpDate: '2026-04-08', lastContact: '2026-03-22',
  },
  {
    id: 'inv-4', name: 'David Park', firm: 'Operator Collective', stage: 'Seed', amount: 300000,
    date: '2026-02-20', status: 'meeting',
    notes: ['Partner meeting scheduled for 4/3.', 'Their portfolio company uses a competitor — good reference point for differentiation.', 'Seems interested in the "integration debt" narrative.'],
    followUpDate: '2026-04-03', lastContact: '2026-03-25',
  },
  {
    id: 'inv-5', name: 'Elena Rodriguez', firm: 'M13', stage: 'Seed', amount: 500000,
    date: '2026-02-14', status: 'meeting',
    notes: ['Met through Techstars network.', 'Interested but cautious — wants to see MRR hit $5K.', 'Requested customer reference calls.'],
    followUpDate: '2026-04-10', lastContact: '2026-03-18',
  },
  {
    id: 'inv-6', name: 'Tom Nakamura', firm: 'Wing VC', stage: 'Seed', amount: 350000,
    date: '2026-03-01', status: 'cold',
    notes: ['Cold emailed after seeing our ProductHunt launch.', 'No response yet on follow-up.'],
    followUpDate: '2026-04-15', lastContact: '2026-03-01',
  },
  {
    id: 'inv-7', name: 'Priya Sharma', firm: 'Storm Ventures', stage: 'Pre-seed', amount: 25000,
    date: '2025-11-01', status: 'signed',
    notes: ['Part of friends & family round.', 'Ex-CTO at a dev tools company — great advisor on product direction.'],
    followUpDate: '2026-06-01', lastContact: '2026-03-15',
  },
  {
    id: 'inv-8', name: 'Marcus Webb', firm: 'B Capital', stage: 'Seed', amount: 600000,
    date: '2026-01-15', status: 'passed',
    notes: ['Passed — said market too small for their fund size.', 'Gave good feedback on positioning. Suggested we frame as "API management" not "integrations".'],
    followUpDate: '', lastContact: '2026-02-01',
  },
  {
    id: 'inv-9', name: 'Amy Foster', firm: 'General Catalyst', stage: 'Seed', amount: 500000,
    date: '2026-02-28', status: 'cold',
    notes: ['Met at a dev tools dinner.', 'Took our deck — said they\'d circle back in Q2.'],
    followUpDate: '2026-04-20', lastContact: '2026-02-28',
  },
  {
    id: 'inv-10', name: 'Raj Patel', firm: 'Unusual Ventures', stage: 'Seed', amount: 400000,
    date: '2026-03-12', status: 'warm',
    notes: ['Introduced by our Techstars MD.', 'Had a good first call — they invested in a similar company that exited to Twilio.', 'Wants to see our pipeline of upcoming integrations.'],
    followUpDate: '2026-04-06', lastContact: '2026-03-29',
  },
  {
    id: 'inv-11', name: 'Lisa Chang', firm: 'Uncork Capital', stage: 'Seed', amount: 350000,
    date: '2026-03-18', status: 'meeting',
    notes: ['Partner meeting on 4/8.', 'Really liked the pitch deck v3 — said it was much clearer than v2.'],
    followUpDate: '2026-04-08', lastContact: '2026-03-28',
  },
  {
    id: 'inv-12', name: 'Brian O\'Neill', firm: 'Founders Fund', stage: 'Seed', amount: 500000,
    date: '2026-01-25', status: 'passed',
    notes: ['Passed quickly — "not contrarian enough" was the feedback.', 'Respect their style, not a fit.'],
    followUpDate: '', lastContact: '2026-01-30',
  },
];

export const SEED_PITCHES: PitchVersion[] = [
  {
    version: 1, date: '2025-12-01',
    feedback: [
      'Too technical — investors glazed over during the API walkthrough.',
      '"So what?" problem — didn\'t clearly articulate the pain.',
      'Competitive slide was weak.',
      'No social proof or traction metrics.',
    ],
    changes: ['Added customer pain narrative up front.', 'Simplified technical architecture slide.', 'Added competitive matrix.', 'Added "why now" slide.'],
    investorsWhoSaw: ['Marcus Webb (B Capital)', 'Amy Foster (General Catalyst)'],
    conversionRate: 0,
  },
  {
    version: 2, date: '2026-01-15',
    feedback: [
      'Much better narrative flow.',
      'Still too many slides (18).',
      'Pricing model unclear — are we per-connection or per-API-call?',
      'Need to show more traction. Even early revenue helps.',
    ],
    changes: ['Cut from 18 to 12 slides.', 'Clarified pricing: per-connection tiered model.', 'Added early trial numbers.', 'Stronger team slide with relevant backgrounds.'],
    investorsWhoSaw: ['Elena Rodriguez (M13)', 'Tom Nakamura (Wing VC)', 'Brian O\'Neill (Founders Fund)'],
    conversionRate: 0.33,
  },
  {
    version: 3, date: '2026-03-01',
    feedback: [
      'Clear and compelling. "Integration debt" is a strong frame.',
      'Love the live demo angle.',
      'Would like to see more on unit economics.',
      'NDR slide was impressive — keep that.',
    ],
    changes: ['Added live demo section.', 'Included unit economics slide.', 'Added NDR cohort chart.', 'Stronger ask slide with specific use of funds.'],
    investorsWhoSaw: ['James Whitfield (Pioneer Fund)', 'Sarah Kim (Basecase)', 'David Park (Operator Collective)', 'Raj Patel (Unusual Ventures)', 'Lisa Chang (Uncork Capital)'],
    conversionRate: 0.4,
  },
];

export const SEED_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'Jake Morrison', company: 'Streamline HR', stage: 'paying', feedbackQuotes: ['Launchkit saved us 3 months of engineering time on our BambooHR integration.', 'We\'d pay double — seriously.'], featureRequests: ['Bulk data sync', 'Custom field mapping'], npsScore: 9, cac: 120, ltv: 2880, startDate: '2026-01-10', lastContact: '2026-03-28' },
  { id: 'cust-2', name: 'Maria Santos', company: 'FlowMetrics', stage: 'paying', feedbackQuotes: ['The webhook handling is really solid. Our previous solution dropped events constantly.', 'Documentation could use more real-world examples.'], featureRequests: ['Better documentation', 'TypeScript SDK'], npsScore: 8, cac: 95, ltv: 2400, startDate: '2026-01-25', lastContact: '2026-03-30' },
  { id: 'cust-3', name: 'Tyrone Williams', company: 'Dealflow AI', stage: 'paying', feedbackQuotes: ['We integrated Salesforce in a weekend. That used to take us a quarter.'], featureRequests: ['Salesforce bulk API support'], npsScore: 10, cac: 150, ltv: 3600, startDate: '2026-02-01', lastContact: '2026-03-27' },
  { id: 'cust-4', name: 'Aisha Patel', company: 'RecruitBot', stage: 'paying', feedbackQuotes: ['Great for standard integrations. Struggled with our custom auth flow though.'], featureRequests: ['Custom auth flows', 'OAuth PKCE support'], npsScore: 7, cac: 200, ltv: 1920, startDate: '2026-02-10', lastContact: '2026-03-20' },
  { id: 'cust-5', name: 'Chen Wei', company: 'DataPulse', stage: 'paying', feedbackQuotes: ['Switched from a competitor. Your error recovery alone is worth the price.'], featureRequests: ['Data transformation layer'], npsScore: 9, cac: 110, ltv: 3120, startDate: '2026-02-15', lastContact: '2026-03-25' },
  { id: 'cust-6', name: 'Sarah Miller', company: 'InvoiceNinja', stage: 'paying', feedbackQuotes: ['Setup was smooth. Dashboard is clean. No complaints really.'], featureRequests: ['QuickBooks integration'], npsScore: 8, cac: 130, ltv: 2640, startDate: '2026-02-20', lastContact: '2026-03-22' },
  { id: 'cust-7', name: 'Omar Hassan', company: 'BuildStack', stage: 'paying', feedbackQuotes: ['We\'re evaluating for our entire platform. This trial has been promising.'], featureRequests: ['Multi-tenant support', 'SSO'], npsScore: 8, cac: 180, ltv: 3360, startDate: '2026-03-01', lastContact: '2026-03-29' },
  { id: 'cust-8', name: 'Emily Chen', company: 'TalentSync', stage: 'paying', feedbackQuotes: ['The API is really well designed. Feels like it was built by developers for developers.'], featureRequests: ['GraphQL support'], npsScore: 9, cac: 100, ltv: 2880, startDate: '2026-03-05', lastContact: '2026-03-31' },
  { id: 'cust-9', name: 'Derek Johnson', company: 'LoopCRM', stage: 'trial', feedbackQuotes: ['So far so good — testing the HubSpot connector.'], featureRequests: ['HubSpot custom objects'], npsScore: null, cac: 85, ltv: 0, startDate: '2026-03-20', lastContact: '2026-03-30' },
  { id: 'cust-10', name: 'Nina Kowalski', company: 'SyncLabs', stage: 'trial', feedbackQuotes: ['Impressed with the onboarding flow. Very little setup required.'], featureRequests: ['Webhook retry configuration'], npsScore: null, cac: 90, ltv: 0, startDate: '2026-03-22', lastContact: '2026-03-31' },
  { id: 'cust-11', name: 'Ravi Krishnan', company: 'FormBuilder', stage: 'trial', feedbackQuotes: ['Need Typeform integration — that\'s our make-or-break.'], featureRequests: ['Typeform integration', 'Form data mapping'], npsScore: null, cac: 75, ltv: 0, startDate: '2026-03-18', lastContact: '2026-03-28' },
  { id: 'cust-12', name: 'Laura Kim', company: 'NotionMetrics', stage: 'trial', feedbackQuotes: ['Good concept. Not sure we need this over building in-house yet.'], featureRequests: ['Notion API connector'], npsScore: null, cac: 60, ltv: 0, startDate: '2026-03-25', lastContact: '2026-03-30' },
  { id: 'cust-13', name: 'Alex Turner', company: 'Pipeliner', stage: 'trial', feedbackQuotes: ['Evaluating 3 options. Yours is most polished but most expensive.'], featureRequests: ['Startup pricing tier'], npsScore: null, cac: 100, ltv: 0, startDate: '2026-03-15', lastContact: '2026-03-27' },
  { id: 'cust-14', name: 'Jen Nakamura', company: 'CloudSync', stage: 'churned', feedbackQuotes: ['We loved the product but our use case was too custom.', 'Would come back if you add custom transformation pipelines.'], featureRequests: ['Custom transformation pipelines'], npsScore: 6, cac: 140, ltv: 240, startDate: '2026-01-20', lastContact: '2026-02-28' },
  { id: 'cust-15', name: 'Marcus Lee', company: 'APIForge', stage: 'prospect', feedbackQuotes: ['Heard about you on IndieHackers. Interested in learning more.'], featureRequests: [], npsScore: null, cac: 0, ltv: 0, startDate: '', lastContact: '2026-03-31' },
];

export const SEED_DECISIONS: Decision[] = [
  { id: 'dec-1', date: '2025-10-15', decision: 'Focus on developer tools / API integrations', optionsConsidered: ['Dev tools: API integrations', 'Dev tools: CI/CD optimization', 'SaaS: Project management'], chosenOption: 'Dev tools: API integrations', rationale: 'Founder pain point — spent 6 months at previous company building integrations. Market growing 30% YoY. Clear buyer (VP Eng).', outcome: 'positive', whatWeLearned: 'Scratching our own itch was the right call. Every early customer validates the pain.' },
  { id: 'dec-2', date: '2025-10-20', decision: 'Build on Cloudflare Workers for edge compute', optionsConsidered: ['AWS Lambda', 'Cloudflare Workers', 'Vercel Edge Functions', 'Self-hosted'], chosenOption: 'Cloudflare Workers', rationale: 'Lowest latency for API proxying, global by default, cheaper at scale. Less vendor lock-in than Lambda.', outcome: 'positive', whatWeLearned: 'Edge-first was correct — customers love the latency numbers. Cold start times are a selling point.' },
  { id: 'dec-3', date: '2025-11-01', decision: 'Bootstrap first 3 months, raise after traction', optionsConsidered: ['Raise immediately', 'Bootstrap first', 'Apply to accelerators only'], chosenOption: 'Bootstrap first', rationale: 'Wanted product-market signal before fundraising. Also applied to accelerators as backup.', outcome: 'positive', whatWeLearned: 'Having 3 months of usage data made fundraising conversations 10x better. Investors respect traction.' },
  { id: 'dec-4', date: '2025-11-15', decision: 'Pricing model: per-connection, tiered', optionsConsidered: ['Per API call', 'Per connection (tiered)', 'Flat monthly fee', 'Usage-based hybrid'], chosenOption: 'Per connection (tiered)', rationale: 'Predictable for customers, easy to understand, scales with value. Per-call model felt too variable for early adopters.', outcome: 'positive', whatWeLearned: 'Customers prefer predictability. The tiered model works — most pick the middle tier.' },
  { id: 'dec-5', date: '2025-12-01', decision: 'Apply to Techstars', optionsConsidered: ['Y Combinator (too late for batch)', 'Techstars', 'Neither — just raise'], chosenOption: 'Techstars', rationale: 'Network in enterprise/dev tools was strong. Program timing aligned with our fundraise. $50K investment + credibility.', outcome: 'positive', whatWeLearned: 'Network effect was huge. 3 of our investor intros came through Techstars connections.' },
  { id: 'dec-6', date: '2025-12-20', decision: 'Hire first engineer — generalist vs specialist', optionsConsidered: ['API specialist (senior)', 'Generalist (mid-level)', 'Contractor'], chosenOption: 'Generalist (mid-level)', rationale: 'Need someone who can move across the stack. Can\'t afford a specialist yet. Cultural fit matters more at this stage.', outcome: 'positive', whatWeLearned: 'Right call — our first engineer shipped 4 integrations, built the dashboard, and handles on-call. Generalists win early.' },
  { id: 'dec-7', date: '2026-01-05', decision: 'Open-source core SDK, paid managed service', optionsConsidered: ['Fully open source', 'Fully closed source', 'Open-core (SDK open, platform paid)'], chosenOption: 'Open-core (SDK open, platform paid)', rationale: 'Open source SDK drives adoption and trust. Managed service is where value accrues. Proven model (Supabase, PostHog).', outcome: 'unclear', whatWeLearned: 'SDK stars growing but hard to attribute conversions. May need to invest more in dev relations.' },
  { id: 'dec-8', date: '2026-01-20', decision: 'Prioritize Stripe and Salesforce integrations first', optionsConsidered: ['Stripe + Salesforce first', 'Slack + Teams first', 'HubSpot + Marketo first'], chosenOption: 'Stripe + Salesforce first', rationale: 'Most requested by early prospects. Stripe has great docs (proves our value prop). Salesforce shows enterprise capability.', outcome: 'positive', whatWeLearned: 'Stripe was a great first integration — easy to demo, everyone understands it. Salesforce was harder than expected but worth it for credibility.' },
  { id: 'dec-9', date: '2026-02-01', decision: 'Launch on Product Hunt', optionsConsidered: ['Product Hunt launch', 'Hacker News launch', 'Both simultaneously', 'Wait for more traction'], chosenOption: 'Product Hunt launch', rationale: 'Good enough product for visibility. PH community overlaps with our ICP. HN is less predictable.', outcome: 'positive', whatWeLearned: 'Product of the Day (#3). Drove 200 signups, 15 converted to trial. PH works for dev tools.' },
  { id: 'dec-10', date: '2026-02-10', decision: 'Start seed round conversations', optionsConsidered: ['Wait for $5K MRR', 'Start conversations now at $1.8K MRR', 'Raise bridge first'], chosenOption: 'Start conversations now', rationale: 'Pipeline is warming. Better to build relationships early and close when we hit milestones. Timing the market is risky.', outcome: 'unclear', whatWeLearned: 'Most investors want to see $5K MRR minimum. Starting early built relationships but slow process. Should have parallelized more.' },
  { id: 'dec-11', date: '2026-02-20', decision: 'Hire second engineer vs growth/marketing person', optionsConsidered: ['Second engineer', 'Growth / marketing hire', 'Part-time contractor for marketing'], chosenOption: 'Second engineer', rationale: 'Product quality is our growth engine right now. Can\'t scale marketing without a product that retains. Content marketing can wait.', outcome: 'unclear', whatWeLearned: 'Engineering velocity improved, but we\'re bottlenecked on distribution. May need to reconsider in 2 months.' },
  { id: 'dec-12', date: '2026-03-01', decision: 'Rebrand pitch around "integration debt" concept', optionsConsidered: ['Keep "API integration platform" positioning', 'Rebrand as "integration debt" solution', 'Pivot to "API management"'], chosenOption: 'Rebrand as "integration debt" solution', rationale: '"Integration debt" is memorable and creates urgency. "API integration platform" is generic. Marcus Webb\'s feedback on "API management" was interesting but felt crowded.', outcome: 'positive', whatWeLearned: 'The rebrand resonated. Investors and customers both repeat the phrase back to us. Framing matters enormously.' },
  { id: 'dec-13', date: '2026-03-10', decision: 'Offer annual plans with 20% discount', optionsConsidered: ['Monthly only', 'Annual with 15% discount', 'Annual with 20% discount', 'Annual with commitment but no discount'], chosenOption: 'Annual with 20% discount', rationale: 'Extends runway per customer. Shows commitment. 20% is standard SaaS discount. Helps with investor narrative.', outcome: 'unclear', whatWeLearned: '2 customers have converted to annual so far. Too early to judge impact on churn.' },
  { id: 'dec-14', date: '2026-03-20', decision: 'Invest in error recovery and monitoring features', optionsConsidered: ['More integrations (quantity)', 'Better error recovery + monitoring (quality)', 'Self-serve onboarding flow'], chosenOption: 'Better error recovery + monitoring', rationale: 'Error recovery is our #1 differentiator in customer feedback. Monitoring helps with retention. Can always add more integrations.', outcome: 'unclear', whatWeLearned: 'Early signals positive — existing customers noticed. New prospects comparing us vs competitors mention it unprompted.' },
  { id: 'dec-15', date: '2026-03-28', decision: 'Begin exploring Series A timing — target Q4 2026', optionsConsidered: ['Raise seed and aim for Series A in 2027', 'Seed → quick Series A in Q3 2026', 'Seed → Series A in Q4 2026'], chosenOption: 'Seed → Series A in Q4 2026', rationale: 'Q4 gives us time to hit $20K MRR milestone. Most Series A investors want $15-25K MRR with strong growth rate. Q3 would be rushed.', outcome: 'unclear', whatWeLearned: 'Too early to tell. Depends entirely on seed round close and growth trajectory over summer.' },
];

export const SEED_COMPETITORS: Competitor[] = [
  {
    id: 'comp-1', name: 'Merge.dev',
    strengths: ['Largest integration catalog (200+)', 'Strong enterprise sales motion', 'Well-funded ($15M Series A)', 'Unified API approach well-understood'],
    weaknesses: ['Expensive for startups', 'Not optimized for edge/latency', 'Black box — less control for developers', 'Support can be slow'],
    pricing: 'Starts at $500/mo, enterprise $2K+/mo',
    marketPosition: 'Market leader in unified API / HR integrations',
    lastUpdated: '2026-03-28',
    howWeDifferentiate: 'Edge-native architecture (lower latency), transparent API layer (developers keep control), startup-friendly pricing. We compete on developer experience and speed, not catalog breadth.',
  },
  {
    id: 'comp-2', name: 'Apideck',
    strengths: ['Good integration coverage', 'Strong in European market', 'Good documentation', 'Reasonable pricing'],
    weaknesses: ['Smaller team, slower feature velocity', 'Less brand recognition in US', 'No edge compute story'],
    pricing: 'Starts at $49/mo, scales with connections',
    marketPosition: 'Solid #2 in unified API space, popular in EU',
    lastUpdated: '2026-03-25',
    howWeDifferentiate: 'Better error recovery, edge-native performance, more transparent API layer. We focus on reliability over breadth.',
  },
  {
    id: 'comp-3', name: 'Nango',
    strengths: ['Open-source', 'Strong developer community', 'Auth-focused (does one thing well)', 'Free self-hosted option'],
    weaknesses: ['Limited to auth — doesn\'t handle data sync', 'Smaller integration catalog', 'Monetization unclear', 'Not enterprise-ready'],
    pricing: 'Free self-hosted, cloud starts at $99/mo',
    marketPosition: 'OSS darling for API auth, growing into unified API',
    lastUpdated: '2026-03-20',
    howWeDifferentiate: 'We handle the full lifecycle (auth + sync + monitoring), not just auth. Our open-core approach gives us similar developer trust with more capability.',
  },
  {
    id: 'comp-4', name: 'Building in-house',
    strengths: ['Full control', 'No vendor dependency', 'Can optimize for exact use case', 'No per-connection cost'],
    weaknesses: ['6-12 weeks per integration', 'Ongoing maintenance burden', 'Hard to hire integration engineers', 'Opportunity cost is massive', 'No shared learnings across customers'],
    pricing: 'Engineering time: $15-30K per integration, ongoing maintenance $2-5K/mo',
    marketPosition: 'Always the #1 competitor — most companies start here',
    lastUpdated: '2026-03-30',
    howWeDifferentiate: 'We sell against build. Time-to-value is days, not months. Shared infrastructure means bugs get fixed once for everyone. Total cost of ownership is dramatically lower.',
  },
];

export const SEED_METRICS: Metrics = {
  mrr: 2400,
  churnRate: 5.0,
  dau: 34,
  conversionFunnel: [
    { stage: 'Website Visitors', count: 2800 },
    { stage: 'Signups', count: 180 },
    { stage: 'Activated Trial', count: 65 },
    { stage: 'First Integration', count: 45 },
    { stage: 'Paying', count: 8 },
  ],
  weeklyChange: { mrr: 8.2, churn: -1.1, dau: 5.3, conversion: 2.1 },
  trend: 'up',
  lastUpdated: '2026-04-01',
};

// ─── Insight Generators ──────────────────────────────────────────────────────

export class StartupInsights {
  static generateHuddle(
    investors: Investor[],
    metrics: Metrics,
    decisions: Decision[],
    runway: RunwayData,
    customers: Customer[]
  ): HuddleSummary {
    const wins: string[] = [];
    const focus: string[] = [];
    const blockers: string[] = [];
    let investorUpdateNeeded = false;

    // Recent wins
    const payingCustomers = customers.filter(c => c.stage === 'paying').length;
    wins.push(`${payingCustomers} paying customers, MRR at $${metrics.mrr.toLocaleString()}`);
    if (metrics.weeklyChange.mrr > 0) wins.push(`MRR growing ${metrics.weeklyChange.mrr}% week-over-week`);

    const dueDiligence = investors.filter(i => i.status === 'due-diligence');
    if (dueDiligence.length > 0) {
      wins.push(`${dueDiligence[0].name} (${dueDiligence[0].firm}) in due diligence`);
      investorUpdateNeeded = true;
    }

    // Today's focus
    const followUps = investors.filter(i => {
      if (!i.followUpDate) return false;
      const d = new Date(i.followUpDate);
      const now = new Date('2026-04-01');
      return d <= new Date(now.getTime() + 7 * 86400000) && ['warm', 'meeting', 'due-diligence'].includes(i.status);
    });
    if (followUps.length > 0) focus.push(`Follow up with ${followUps.map(i => `${i.name} (${i.firm})`).join(', ')}`);

    const activeTrials = customers.filter(c => c.stage === 'trial').length;
    if (activeTrials > 0) focus.push(`Convert ${activeTrials} active trials to paying`);

    if (metrics.mrr < 5000) focus.push('Push MRR toward $5K milestone for seed conversations');

    // Blockers
    if (runway.currentRunwayMonths < 6) blockers.push(`Runway at ${runway.currentRunwayMonths} months — need to close seed round or cut burn`);
    if (runway.currentRunwayMonths < 9 && runway.currentRunwayMonths >= 6) blockers.push(`Runway at ${runway.currentRunwayMonths} months — seed round is critical path`);

    const churnedCustomers = customers.filter(c => c.stage === 'churned');
    if (churnedCustomers.length > 0) {
      const reasons = churnedCustomers.flatMap(c => c.feedbackQuotes);
      blockers.push(`${churnedCustomers.length} churned customer(s): "${reasons[0] || 'Unknown reason'}"`);
    }

    return {
      date: '2026-04-01',
      yesterdaysWins: wins,
      todaysFocus: focus,
      blockers,
      investorUpdateNeeded,
      teamChanges: 'No changes this week. Team of 4 stable.',
    };
  }

  static generateContextSummary(
    company: CompanyProfile,
    runway: RunwayData,
    investors: Investor[],
    customers: Customer[],
    decisions: Decision[],
    metrics: Metrics
  ): string {
    const paying = customers.filter(c => c.stage === 'paying').length;
    const trials = customers.filter(c => c.stage === 'trial').length;
    const activePipeline = investors.filter(i => ['warm', 'meeting', 'due-diligence', 'term-sheet'].includes(i.status)).length;
    const recentDecisions = decisions.slice(-3).map(d => d.decision).join('; ');

    return [
      `Company: ${company.name} — ${company.oneLiner}`,
      `Stage: ${company.stage} | Founded: ${company.foundedDate} | Team: ${company.teamSize} | Location: ${company.location}`,
      `Financials: $${metrics.mrr.toLocaleString()} MRR | $${runway.monthlyBurnRate.toLocaleString()}/mo burn | ${runway.currentRunwayMonths} months runway | Last raise: $${runway.lastFundingAmount.toLocaleString()}`,
      `Traction: ${paying} paying, ${trials} in trial | ${metrics.dau} DAU | ${metrics.churnRate}% churn | MRR ${metrics.trend}`,
      `Fundraise: ${activePipeline} active investors in pipeline | ${investors.filter(i => i.status === 'due-diligence').length} in due diligence`,
      `Recent decisions: ${recentDecisions}`,
    ].join('\n');
  }
}
