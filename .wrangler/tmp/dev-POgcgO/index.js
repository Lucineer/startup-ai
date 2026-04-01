var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-KpntQ5/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/startup/tracker.ts
var SEED_COMPANY = {
  name: "Launchkit",
  stage: "pre-seed",
  foundedDate: "2025-10-15",
  teamSize: 4,
  location: "San Francisco, CA",
  oneLiner: "Developer tools that turn API integrations into a competitive advantage.",
  description: "Launchkit provides a unified API layer that lets SaaS companies ship integrations 10x faster. Instead of building and maintaining custom connectors for every platform, developers use Launchkit to configure, deploy, and monitor integrations from a single dashboard. We handle auth, rate limiting, webhooks, and error recovery so engineering teams can focus on their core product.",
  mission: "Eliminate integration debt for every SaaS company.",
  vision: "Every SaaS product ships with world-class integrations on day one, powered by Launchkit."
};
var SEED_RUNWAY = {
  currentRunwayMonths: 8,
  monthlyBurnRate: 15e3,
  monthlyRevenue: 2400,
  lastFundingAmount: 18e4,
  fundingHistory: [
    { date: "2025-11-01", amount: 5e4, source: "Friends & Family", type: "Convertible Note" },
    { date: "2025-12-15", amount: 8e4, source: "Angel syndicate led by Mira Chen", type: "SAFE" },
    { date: "2026-01-20", amount: 5e4, source: "Pre-seed program (Techstars)", type: "SAFE" }
  ],
  monthlySpending: [
    { category: "Engineering (infra + tools)", amount: 4500 },
    { category: "Salaries (founders)", amount: 0 },
    { category: "Cloud hosting (AWS)", amount: 2800 },
    { category: "Marketing / content", amount: 1200 },
    { category: "Legal & accounting", amount: 1800 },
    { category: "Office / coworking", amount: 800 },
    { category: "SaaS subscriptions", amount: 900 },
    { category: "Travel & meetings", amount: 600 },
    { category: "Misc", amount: 2400 }
  ],
  lastUpdated: "2026-04-01"
};
var SEED_INVESTORS = [
  {
    id: "inv-1",
    name: "Mira Chen",
    firm: "Horizon Ventures",
    stage: "Pre-seed",
    amount: 8e4,
    date: "2025-12-15",
    status: "signed",
    notes: ["Led our angel round. Strong believer in dev tools thesis.", "Wants to follow on in seed round.", "Introduced us to 2 other angels."],
    followUpDate: "2026-05-01",
    lastContact: "2026-03-28"
  },
  {
    id: "inv-2",
    name: "James Whitfield",
    firm: "Pioneer Fund",
    stage: "Seed",
    amount: 5e5,
    date: "2026-03-10",
    status: "due-diligence",
    notes: ["Met at SF Tech Meetup. Very interested in our traction.", "Requested data room access \u2014 sent 3/15.", "Asked about churn \u2014 showed cohort data.", "Came back with follow-up questions on NDR calculations."],
    followUpDate: "2026-04-05",
    lastContact: "2026-03-30"
  },
  {
    id: "inv-3",
    name: "Sarah Kim",
    firm: "Basecase Capital",
    stage: "Seed",
    amount: 4e5,
    date: "2026-03-05",
    status: "warm",
    notes: ["Referred by Mira Chen.", "Had intro call \u2014 liked the space, wants to see more traction.", "Following up with updated metrics after Q1 close."],
    followUpDate: "2026-04-08",
    lastContact: "2026-03-22"
  },
  {
    id: "inv-4",
    name: "David Park",
    firm: "Operator Collective",
    stage: "Seed",
    amount: 3e5,
    date: "2026-02-20",
    status: "meeting",
    notes: ["Partner meeting scheduled for 4/3.", "Their portfolio company uses a competitor \u2014 good reference point for differentiation.", 'Seems interested in the "integration debt" narrative.'],
    followUpDate: "2026-04-03",
    lastContact: "2026-03-25"
  },
  {
    id: "inv-5",
    name: "Elena Rodriguez",
    firm: "M13",
    stage: "Seed",
    amount: 5e5,
    date: "2026-02-14",
    status: "meeting",
    notes: ["Met through Techstars network.", "Interested but cautious \u2014 wants to see MRR hit $5K.", "Requested customer reference calls."],
    followUpDate: "2026-04-10",
    lastContact: "2026-03-18"
  },
  {
    id: "inv-6",
    name: "Tom Nakamura",
    firm: "Wing VC",
    stage: "Seed",
    amount: 35e4,
    date: "2026-03-01",
    status: "cold",
    notes: ["Cold emailed after seeing our ProductHunt launch.", "No response yet on follow-up."],
    followUpDate: "2026-04-15",
    lastContact: "2026-03-01"
  },
  {
    id: "inv-7",
    name: "Priya Sharma",
    firm: "Storm Ventures",
    stage: "Pre-seed",
    amount: 25e3,
    date: "2025-11-01",
    status: "signed",
    notes: ["Part of friends & family round.", "Ex-CTO at a dev tools company \u2014 great advisor on product direction."],
    followUpDate: "2026-06-01",
    lastContact: "2026-03-15"
  },
  {
    id: "inv-8",
    name: "Marcus Webb",
    firm: "B Capital",
    stage: "Seed",
    amount: 6e5,
    date: "2026-01-15",
    status: "passed",
    notes: ["Passed \u2014 said market too small for their fund size.", 'Gave good feedback on positioning. Suggested we frame as "API management" not "integrations".'],
    followUpDate: "",
    lastContact: "2026-02-01"
  },
  {
    id: "inv-9",
    name: "Amy Foster",
    firm: "General Catalyst",
    stage: "Seed",
    amount: 5e5,
    date: "2026-02-28",
    status: "cold",
    notes: ["Met at a dev tools dinner.", "Took our deck \u2014 said they'd circle back in Q2."],
    followUpDate: "2026-04-20",
    lastContact: "2026-02-28"
  },
  {
    id: "inv-10",
    name: "Raj Patel",
    firm: "Unusual Ventures",
    stage: "Seed",
    amount: 4e5,
    date: "2026-03-12",
    status: "warm",
    notes: ["Introduced by our Techstars MD.", "Had a good first call \u2014 they invested in a similar company that exited to Twilio.", "Wants to see our pipeline of upcoming integrations."],
    followUpDate: "2026-04-06",
    lastContact: "2026-03-29"
  },
  {
    id: "inv-11",
    name: "Lisa Chang",
    firm: "Uncork Capital",
    stage: "Seed",
    amount: 35e4,
    date: "2026-03-18",
    status: "meeting",
    notes: ["Partner meeting on 4/8.", "Really liked the pitch deck v3 \u2014 said it was much clearer than v2."],
    followUpDate: "2026-04-08",
    lastContact: "2026-03-28"
  },
  {
    id: "inv-12",
    name: "Brian O'Neill",
    firm: "Founders Fund",
    stage: "Seed",
    amount: 5e5,
    date: "2026-01-25",
    status: "passed",
    notes: ['Passed quickly \u2014 "not contrarian enough" was the feedback.', "Respect their style, not a fit."],
    followUpDate: "",
    lastContact: "2026-01-30"
  }
];
var SEED_PITCHES = [
  {
    version: 1,
    date: "2025-12-01",
    feedback: [
      "Too technical \u2014 investors glazed over during the API walkthrough.",
      `"So what?" problem \u2014 didn't clearly articulate the pain.`,
      "Competitive slide was weak.",
      "No social proof or traction metrics."
    ],
    changes: ["Added customer pain narrative up front.", "Simplified technical architecture slide.", "Added competitive matrix.", 'Added "why now" slide.'],
    investorsWhoSaw: ["Marcus Webb (B Capital)", "Amy Foster (General Catalyst)"],
    conversionRate: 0
  },
  {
    version: 2,
    date: "2026-01-15",
    feedback: [
      "Much better narrative flow.",
      "Still too many slides (18).",
      "Pricing model unclear \u2014 are we per-connection or per-API-call?",
      "Need to show more traction. Even early revenue helps."
    ],
    changes: ["Cut from 18 to 12 slides.", "Clarified pricing: per-connection tiered model.", "Added early trial numbers.", "Stronger team slide with relevant backgrounds."],
    investorsWhoSaw: ["Elena Rodriguez (M13)", "Tom Nakamura (Wing VC)", "Brian O'Neill (Founders Fund)"],
    conversionRate: 0.33
  },
  {
    version: 3,
    date: "2026-03-01",
    feedback: [
      'Clear and compelling. "Integration debt" is a strong frame.',
      "Love the live demo angle.",
      "Would like to see more on unit economics.",
      "NDR slide was impressive \u2014 keep that."
    ],
    changes: ["Added live demo section.", "Included unit economics slide.", "Added NDR cohort chart.", "Stronger ask slide with specific use of funds."],
    investorsWhoSaw: ["James Whitfield (Pioneer Fund)", "Sarah Kim (Basecase)", "David Park (Operator Collective)", "Raj Patel (Unusual Ventures)", "Lisa Chang (Uncork Capital)"],
    conversionRate: 0.4
  }
];
var SEED_CUSTOMERS = [
  { id: "cust-1", name: "Jake Morrison", company: "Streamline HR", stage: "paying", feedbackQuotes: ["Launchkit saved us 3 months of engineering time on our BambooHR integration.", "We'd pay double \u2014 seriously."], featureRequests: ["Bulk data sync", "Custom field mapping"], npsScore: 9, cac: 120, ltv: 2880, startDate: "2026-01-10", lastContact: "2026-03-28" },
  { id: "cust-2", name: "Maria Santos", company: "FlowMetrics", stage: "paying", feedbackQuotes: ["The webhook handling is really solid. Our previous solution dropped events constantly.", "Documentation could use more real-world examples."], featureRequests: ["Better documentation", "TypeScript SDK"], npsScore: 8, cac: 95, ltv: 2400, startDate: "2026-01-25", lastContact: "2026-03-30" },
  { id: "cust-3", name: "Tyrone Williams", company: "Dealflow AI", stage: "paying", feedbackQuotes: ["We integrated Salesforce in a weekend. That used to take us a quarter."], featureRequests: ["Salesforce bulk API support"], npsScore: 10, cac: 150, ltv: 3600, startDate: "2026-02-01", lastContact: "2026-03-27" },
  { id: "cust-4", name: "Aisha Patel", company: "RecruitBot", stage: "paying", feedbackQuotes: ["Great for standard integrations. Struggled with our custom auth flow though."], featureRequests: ["Custom auth flows", "OAuth PKCE support"], npsScore: 7, cac: 200, ltv: 1920, startDate: "2026-02-10", lastContact: "2026-03-20" },
  { id: "cust-5", name: "Chen Wei", company: "DataPulse", stage: "paying", feedbackQuotes: ["Switched from a competitor. Your error recovery alone is worth the price."], featureRequests: ["Data transformation layer"], npsScore: 9, cac: 110, ltv: 3120, startDate: "2026-02-15", lastContact: "2026-03-25" },
  { id: "cust-6", name: "Sarah Miller", company: "InvoiceNinja", stage: "paying", feedbackQuotes: ["Setup was smooth. Dashboard is clean. No complaints really."], featureRequests: ["QuickBooks integration"], npsScore: 8, cac: 130, ltv: 2640, startDate: "2026-02-20", lastContact: "2026-03-22" },
  { id: "cust-7", name: "Omar Hassan", company: "BuildStack", stage: "paying", feedbackQuotes: ["We're evaluating for our entire platform. This trial has been promising."], featureRequests: ["Multi-tenant support", "SSO"], npsScore: 8, cac: 180, ltv: 3360, startDate: "2026-03-01", lastContact: "2026-03-29" },
  { id: "cust-8", name: "Emily Chen", company: "TalentSync", stage: "paying", feedbackQuotes: ["The API is really well designed. Feels like it was built by developers for developers."], featureRequests: ["GraphQL support"], npsScore: 9, cac: 100, ltv: 2880, startDate: "2026-03-05", lastContact: "2026-03-31" },
  { id: "cust-9", name: "Derek Johnson", company: "LoopCRM", stage: "trial", feedbackQuotes: ["So far so good \u2014 testing the HubSpot connector."], featureRequests: ["HubSpot custom objects"], npsScore: null, cac: 85, ltv: 0, startDate: "2026-03-20", lastContact: "2026-03-30" },
  { id: "cust-10", name: "Nina Kowalski", company: "SyncLabs", stage: "trial", feedbackQuotes: ["Impressed with the onboarding flow. Very little setup required."], featureRequests: ["Webhook retry configuration"], npsScore: null, cac: 90, ltv: 0, startDate: "2026-03-22", lastContact: "2026-03-31" },
  { id: "cust-11", name: "Ravi Krishnan", company: "FormBuilder", stage: "trial", feedbackQuotes: ["Need Typeform integration \u2014 that's our make-or-break."], featureRequests: ["Typeform integration", "Form data mapping"], npsScore: null, cac: 75, ltv: 0, startDate: "2026-03-18", lastContact: "2026-03-28" },
  { id: "cust-12", name: "Laura Kim", company: "NotionMetrics", stage: "trial", feedbackQuotes: ["Good concept. Not sure we need this over building in-house yet."], featureRequests: ["Notion API connector"], npsScore: null, cac: 60, ltv: 0, startDate: "2026-03-25", lastContact: "2026-03-30" },
  { id: "cust-13", name: "Alex Turner", company: "Pipeliner", stage: "trial", feedbackQuotes: ["Evaluating 3 options. Yours is most polished but most expensive."], featureRequests: ["Startup pricing tier"], npsScore: null, cac: 100, ltv: 0, startDate: "2026-03-15", lastContact: "2026-03-27" },
  { id: "cust-14", name: "Jen Nakamura", company: "CloudSync", stage: "churned", feedbackQuotes: ["We loved the product but our use case was too custom.", "Would come back if you add custom transformation pipelines."], featureRequests: ["Custom transformation pipelines"], npsScore: 6, cac: 140, ltv: 240, startDate: "2026-01-20", lastContact: "2026-02-28" },
  { id: "cust-15", name: "Marcus Lee", company: "APIForge", stage: "prospect", feedbackQuotes: ["Heard about you on IndieHackers. Interested in learning more."], featureRequests: [], npsScore: null, cac: 0, ltv: 0, startDate: "", lastContact: "2026-03-31" }
];
var SEED_DECISIONS = [
  { id: "dec-1", date: "2025-10-15", decision: "Focus on developer tools / API integrations", optionsConsidered: ["Dev tools: API integrations", "Dev tools: CI/CD optimization", "SaaS: Project management"], chosenOption: "Dev tools: API integrations", rationale: "Founder pain point \u2014 spent 6 months at previous company building integrations. Market growing 30% YoY. Clear buyer (VP Eng).", outcome: "positive", whatWeLearned: "Scratching our own itch was the right call. Every early customer validates the pain." },
  { id: "dec-2", date: "2025-10-20", decision: "Build on Cloudflare Workers for edge compute", optionsConsidered: ["AWS Lambda", "Cloudflare Workers", "Vercel Edge Functions", "Self-hosted"], chosenOption: "Cloudflare Workers", rationale: "Lowest latency for API proxying, global by default, cheaper at scale. Less vendor lock-in than Lambda.", outcome: "positive", whatWeLearned: "Edge-first was correct \u2014 customers love the latency numbers. Cold start times are a selling point." },
  { id: "dec-3", date: "2025-11-01", decision: "Bootstrap first 3 months, raise after traction", optionsConsidered: ["Raise immediately", "Bootstrap first", "Apply to accelerators only"], chosenOption: "Bootstrap first", rationale: "Wanted product-market signal before fundraising. Also applied to accelerators as backup.", outcome: "positive", whatWeLearned: "Having 3 months of usage data made fundraising conversations 10x better. Investors respect traction." },
  { id: "dec-4", date: "2025-11-15", decision: "Pricing model: per-connection, tiered", optionsConsidered: ["Per API call", "Per connection (tiered)", "Flat monthly fee", "Usage-based hybrid"], chosenOption: "Per connection (tiered)", rationale: "Predictable for customers, easy to understand, scales with value. Per-call model felt too variable for early adopters.", outcome: "positive", whatWeLearned: "Customers prefer predictability. The tiered model works \u2014 most pick the middle tier." },
  { id: "dec-5", date: "2025-12-01", decision: "Apply to Techstars", optionsConsidered: ["Y Combinator (too late for batch)", "Techstars", "Neither \u2014 just raise"], chosenOption: "Techstars", rationale: "Network in enterprise/dev tools was strong. Program timing aligned with our fundraise. $50K investment + credibility.", outcome: "positive", whatWeLearned: "Network effect was huge. 3 of our investor intros came through Techstars connections." },
  { id: "dec-6", date: "2025-12-20", decision: "Hire first engineer \u2014 generalist vs specialist", optionsConsidered: ["API specialist (senior)", "Generalist (mid-level)", "Contractor"], chosenOption: "Generalist (mid-level)", rationale: "Need someone who can move across the stack. Can't afford a specialist yet. Cultural fit matters more at this stage.", outcome: "positive", whatWeLearned: "Right call \u2014 our first engineer shipped 4 integrations, built the dashboard, and handles on-call. Generalists win early." },
  { id: "dec-7", date: "2026-01-05", decision: "Open-source core SDK, paid managed service", optionsConsidered: ["Fully open source", "Fully closed source", "Open-core (SDK open, platform paid)"], chosenOption: "Open-core (SDK open, platform paid)", rationale: "Open source SDK drives adoption and trust. Managed service is where value accrues. Proven model (Supabase, PostHog).", outcome: "unclear", whatWeLearned: "SDK stars growing but hard to attribute conversions. May need to invest more in dev relations." },
  { id: "dec-8", date: "2026-01-20", decision: "Prioritize Stripe and Salesforce integrations first", optionsConsidered: ["Stripe + Salesforce first", "Slack + Teams first", "HubSpot + Marketo first"], chosenOption: "Stripe + Salesforce first", rationale: "Most requested by early prospects. Stripe has great docs (proves our value prop). Salesforce shows enterprise capability.", outcome: "positive", whatWeLearned: "Stripe was a great first integration \u2014 easy to demo, everyone understands it. Salesforce was harder than expected but worth it for credibility." },
  { id: "dec-9", date: "2026-02-01", decision: "Launch on Product Hunt", optionsConsidered: ["Product Hunt launch", "Hacker News launch", "Both simultaneously", "Wait for more traction"], chosenOption: "Product Hunt launch", rationale: "Good enough product for visibility. PH community overlaps with our ICP. HN is less predictable.", outcome: "positive", whatWeLearned: "Product of the Day (#3). Drove 200 signups, 15 converted to trial. PH works for dev tools." },
  { id: "dec-10", date: "2026-02-10", decision: "Start seed round conversations", optionsConsidered: ["Wait for $5K MRR", "Start conversations now at $1.8K MRR", "Raise bridge first"], chosenOption: "Start conversations now", rationale: "Pipeline is warming. Better to build relationships early and close when we hit milestones. Timing the market is risky.", outcome: "unclear", whatWeLearned: "Most investors want to see $5K MRR minimum. Starting early built relationships but slow process. Should have parallelized more." },
  { id: "dec-11", date: "2026-02-20", decision: "Hire second engineer vs growth/marketing person", optionsConsidered: ["Second engineer", "Growth / marketing hire", "Part-time contractor for marketing"], chosenOption: "Second engineer", rationale: "Product quality is our growth engine right now. Can't scale marketing without a product that retains. Content marketing can wait.", outcome: "unclear", whatWeLearned: "Engineering velocity improved, but we're bottlenecked on distribution. May need to reconsider in 2 months." },
  { id: "dec-12", date: "2026-03-01", decision: 'Rebrand pitch around "integration debt" concept', optionsConsidered: ['Keep "API integration platform" positioning', 'Rebrand as "integration debt" solution', 'Pivot to "API management"'], chosenOption: 'Rebrand as "integration debt" solution', rationale: `"Integration debt" is memorable and creates urgency. "API integration platform" is generic. Marcus Webb's feedback on "API management" was interesting but felt crowded.`, outcome: "positive", whatWeLearned: "The rebrand resonated. Investors and customers both repeat the phrase back to us. Framing matters enormously." },
  { id: "dec-13", date: "2026-03-10", decision: "Offer annual plans with 20% discount", optionsConsidered: ["Monthly only", "Annual with 15% discount", "Annual with 20% discount", "Annual with commitment but no discount"], chosenOption: "Annual with 20% discount", rationale: "Extends runway per customer. Shows commitment. 20% is standard SaaS discount. Helps with investor narrative.", outcome: "unclear", whatWeLearned: "2 customers have converted to annual so far. Too early to judge impact on churn." },
  { id: "dec-14", date: "2026-03-20", decision: "Invest in error recovery and monitoring features", optionsConsidered: ["More integrations (quantity)", "Better error recovery + monitoring (quality)", "Self-serve onboarding flow"], chosenOption: "Better error recovery + monitoring", rationale: "Error recovery is our #1 differentiator in customer feedback. Monitoring helps with retention. Can always add more integrations.", outcome: "unclear", whatWeLearned: "Early signals positive \u2014 existing customers noticed. New prospects comparing us vs competitors mention it unprompted." },
  { id: "dec-15", date: "2026-03-28", decision: "Begin exploring Series A timing \u2014 target Q4 2026", optionsConsidered: ["Raise seed and aim for Series A in 2027", "Seed \u2192 quick Series A in Q3 2026", "Seed \u2192 Series A in Q4 2026"], chosenOption: "Seed \u2192 Series A in Q4 2026", rationale: "Q4 gives us time to hit $20K MRR milestone. Most Series A investors want $15-25K MRR with strong growth rate. Q3 would be rushed.", outcome: "unclear", whatWeLearned: "Too early to tell. Depends entirely on seed round close and growth trajectory over summer." }
];
var SEED_COMPETITORS = [
  {
    id: "comp-1",
    name: "Merge.dev",
    strengths: ["Largest integration catalog (200+)", "Strong enterprise sales motion", "Well-funded ($15M Series A)", "Unified API approach well-understood"],
    weaknesses: ["Expensive for startups", "Not optimized for edge/latency", "Black box \u2014 less control for developers", "Support can be slow"],
    pricing: "Starts at $500/mo, enterprise $2K+/mo",
    marketPosition: "Market leader in unified API / HR integrations",
    lastUpdated: "2026-03-28",
    howWeDifferentiate: "Edge-native architecture (lower latency), transparent API layer (developers keep control), startup-friendly pricing. We compete on developer experience and speed, not catalog breadth."
  },
  {
    id: "comp-2",
    name: "Apideck",
    strengths: ["Good integration coverage", "Strong in European market", "Good documentation", "Reasonable pricing"],
    weaknesses: ["Smaller team, slower feature velocity", "Less brand recognition in US", "No edge compute story"],
    pricing: "Starts at $49/mo, scales with connections",
    marketPosition: "Solid #2 in unified API space, popular in EU",
    lastUpdated: "2026-03-25",
    howWeDifferentiate: "Better error recovery, edge-native performance, more transparent API layer. We focus on reliability over breadth."
  },
  {
    id: "comp-3",
    name: "Nango",
    strengths: ["Open-source", "Strong developer community", "Auth-focused (does one thing well)", "Free self-hosted option"],
    weaknesses: ["Limited to auth \u2014 doesn't handle data sync", "Smaller integration catalog", "Monetization unclear", "Not enterprise-ready"],
    pricing: "Free self-hosted, cloud starts at $99/mo",
    marketPosition: "OSS darling for API auth, growing into unified API",
    lastUpdated: "2026-03-20",
    howWeDifferentiate: "We handle the full lifecycle (auth + sync + monitoring), not just auth. Our open-core approach gives us similar developer trust with more capability."
  },
  {
    id: "comp-4",
    name: "Building in-house",
    strengths: ["Full control", "No vendor dependency", "Can optimize for exact use case", "No per-connection cost"],
    weaknesses: ["6-12 weeks per integration", "Ongoing maintenance burden", "Hard to hire integration engineers", "Opportunity cost is massive", "No shared learnings across customers"],
    pricing: "Engineering time: $15-30K per integration, ongoing maintenance $2-5K/mo",
    marketPosition: "Always the #1 competitor \u2014 most companies start here",
    lastUpdated: "2026-03-30",
    howWeDifferentiate: "We sell against build. Time-to-value is days, not months. Shared infrastructure means bugs get fixed once for everyone. Total cost of ownership is dramatically lower."
  }
];
var SEED_METRICS = {
  mrr: 2400,
  churnRate: 5,
  dau: 34,
  conversionFunnel: [
    { stage: "Website Visitors", count: 2800 },
    { stage: "Signups", count: 180 },
    { stage: "Activated Trial", count: 65 },
    { stage: "First Integration", count: 45 },
    { stage: "Paying", count: 8 }
  ],
  weeklyChange: { mrr: 8.2, churn: -1.1, dau: 5.3, conversion: 2.1 },
  trend: "up",
  lastUpdated: "2026-04-01"
};
var StartupInsights = class {
  static generateHuddle(investors, metrics, decisions, runway, customers) {
    const wins = [];
    const focus = [];
    const blockers = [];
    let investorUpdateNeeded = false;
    const payingCustomers = customers.filter((c) => c.stage === "paying").length;
    wins.push(`${payingCustomers} paying customers, MRR at $${metrics.mrr.toLocaleString()}`);
    if (metrics.weeklyChange.mrr > 0)
      wins.push(`MRR growing ${metrics.weeklyChange.mrr}% week-over-week`);
    const dueDiligence = investors.filter((i) => i.status === "due-diligence");
    if (dueDiligence.length > 0) {
      wins.push(`${dueDiligence[0].name} (${dueDiligence[0].firm}) in due diligence`);
      investorUpdateNeeded = true;
    }
    const followUps = investors.filter((i) => {
      if (!i.followUpDate)
        return false;
      const d = new Date(i.followUpDate);
      const now = /* @__PURE__ */ new Date("2026-04-01");
      return d <= new Date(now.getTime() + 7 * 864e5) && ["warm", "meeting", "due-diligence"].includes(i.status);
    });
    if (followUps.length > 0)
      focus.push(`Follow up with ${followUps.map((i) => `${i.name} (${i.firm})`).join(", ")}`);
    const activeTrials = customers.filter((c) => c.stage === "trial").length;
    if (activeTrials > 0)
      focus.push(`Convert ${activeTrials} active trials to paying`);
    if (metrics.mrr < 5e3)
      focus.push("Push MRR toward $5K milestone for seed conversations");
    if (runway.currentRunwayMonths < 6)
      blockers.push(`Runway at ${runway.currentRunwayMonths} months \u2014 need to close seed round or cut burn`);
    if (runway.currentRunwayMonths < 9 && runway.currentRunwayMonths >= 6)
      blockers.push(`Runway at ${runway.currentRunwayMonths} months \u2014 seed round is critical path`);
    const churnedCustomers = customers.filter((c) => c.stage === "churned");
    if (churnedCustomers.length > 0) {
      const reasons = churnedCustomers.flatMap((c) => c.feedbackQuotes);
      blockers.push(`${churnedCustomers.length} churned customer(s): "${reasons[0] || "Unknown reason"}"`);
    }
    return {
      date: "2026-04-01",
      yesterdaysWins: wins,
      todaysFocus: focus,
      blockers,
      investorUpdateNeeded,
      teamChanges: "No changes this week. Team of 4 stable."
    };
  }
  static generateContextSummary(company, runway, investors, customers, decisions, metrics) {
    const paying = customers.filter((c) => c.stage === "paying").length;
    const trials = customers.filter((c) => c.stage === "trial").length;
    const activePipeline = investors.filter((i) => ["warm", "meeting", "due-diligence", "term-sheet"].includes(i.status)).length;
    const recentDecisions = decisions.slice(-3).map((d) => d.decision).join("; ");
    return [
      `Company: ${company.name} \u2014 ${company.oneLiner}`,
      `Stage: ${company.stage} | Founded: ${company.foundedDate} | Team: ${company.teamSize} | Location: ${company.location}`,
      `Financials: $${metrics.mrr.toLocaleString()} MRR | $${runway.monthlyBurnRate.toLocaleString()}/mo burn | ${runway.currentRunwayMonths} months runway | Last raise: $${runway.lastFundingAmount.toLocaleString()}`,
      `Traction: ${paying} paying, ${trials} in trial | ${metrics.dau} DAU | ${metrics.churnRate}% churn | MRR ${metrics.trend}`,
      `Fundraise: ${activePipeline} active investors in pipeline | ${investors.filter((i) => i.status === "due-diligence").length} in due diligence`,
      `Recent decisions: ${recentDecisions}`
    ].join("\n");
  }
};
__name(StartupInsights, "StartupInsights");

// src/index.ts
async function getData(kv, key, seed) {
  const stored = await kv.get(`startup:${key}`, "json");
  return stored ? stored : seed;
}
__name(getData, "getData");
async function setData(kv, key, data) {
  await kv.put(`startup:${key}`, JSON.stringify(data));
}
__name(setData, "setData");
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}
__name(json, "json");
async function handleChat(req, env) {
  const { message } = await req.json();
  const company = await getData(env.STARTUP_KV, "company", SEED_COMPANY);
  const runway = await getData(env.STARTUP_KV, "runway", SEED_RUNWAY);
  const investors = await getData(env.STARTUP_KV, "investors", SEED_INVESTORS);
  const customers = await getData(env.STARTUP_KV, "customers", SEED_CUSTOMERS);
  const decisions = await getData(env.STARTUP_KV, "decisions", SEED_DECISIONS);
  const competitors = await getData(env.STARTUP_KV, "competitors", SEED_COMPETITORS);
  const metrics = await getData(env.STARTUP_KV, "metrics", SEED_METRICS);
  const pitches = await getData(env.STARTUP_KV, "pitches", SEED_PITCHES);
  const context = StartupInsights.generateContextSummary(company, runway, investors, customers, decisions, metrics);
  const investorSummary = investors.map(
    (i) => `${i.name} (${i.firm}) \u2014 ${i.status} \u2014 $${i.amount.toLocaleString()} \u2014 Last: ${i.lastContact} \u2014 Notes: ${i.notes.join("; ")}`
  ).join("\n");
  const decisionSummary = decisions.map(
    (d) => `[${d.date}] ${d.decision} \u2192 Chose: ${d.chosenOption} \u2192 Outcome: ${d.outcome} \u2192 Learned: ${d.whatWeLearned}`
  ).join("\n");
  const systemPrompt = `You are StartupLog, a startup cofounder that lives in a repo. You have been present for every decision this company has made. You remember every investor conversation, every pivot, every customer feedback. Reference specific history when giving advice. Challenge assumptions by pointing to past decisions that didn't work out. Be direct, opinionated, and insightful \u2014 like a trusted cofounder who isn't afraid to tell the founder when they're wrong.

CURRENT CONTEXT:
${context}

INVESTOR PIPELINE:
${investorSummary}

KEY DECISIONS:
${decisionSummary}

PITCH HISTORY:
${pitches.map((p) => `v${p.version} (${p.date}): Conversion ${p.conversionRate} \u2014 Feedback: ${p.feedback.join("; ")}`).join("\n")}

COMPETITORS:
${competitors.map((c) => `${c.name}: ${c.howWeDifferentiate}`).join("\n")}

CUSTOMERS:
Paying: ${customers.filter((c) => c.stage === "paying").length} | Trial: ${customers.filter((c) => c.stage === "trial").length} | Churned: ${customers.filter((c) => c.stage === "churned").length}
Top feedback: ${customers.slice(0, 5).flatMap((c) => c.feedbackQuotes).join(" | ")}

You speak with the authority of someone who was in the room for every meeting. Use specific dates, names, and outcomes. If the founder is about to repeat a mistake, call it out explicitly. If they're onto something, validate it with data from the company's history.`;
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 2048
          })
        });
        if (!response.ok || !response.body) {
          const errText = await response.text();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `DeepSeek API error: ${response.status} \u2014 ${errText}` })}

`));
          controller.close();
          return;
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done)
            break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: "))
              continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]")
              continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}

`));
              }
            } catch {
            }
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: String(err) })}

`));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    }
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(handleChat, "handleChat");
async function serveHTML(env) {
  const html = await env.STARTUP_KV.get("static:app.html", "text");
  if (html) {
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }
  return new Response('Dashboard not deployed to KV. Push app.html to STARTUP_KV under key "static:app.html", or serve public/app.html directly.', {
    status: 404,
    headers: { "Content-Type": "text/plain" }
  });
}
__name(serveHTML, "serveHTML");
var src_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === "/" || path === "/index.html") {
      return serveHTML(env);
    }
    if (path === "/api/chat" && request.method === "POST") {
      return handleChat(request, env);
    }
    if (path === "/api/huddle" && request.method === "GET") {
      const investors = await getData(env.STARTUP_KV, "investors", SEED_INVESTORS);
      const metrics = await getData(env.STARTUP_KV, "metrics", SEED_METRICS);
      const decisions = await getData(env.STARTUP_KV, "decisions", SEED_DECISIONS);
      const runway = await getData(env.STARTUP_KV, "runway", SEED_RUNWAY);
      const customers = await getData(env.STARTUP_KV, "customers", SEED_CUSTOMERS);
      const huddle = StartupInsights.generateHuddle(investors, metrics, decisions, runway, customers);
      return json(huddle);
    }
    const crudRoutes = [
      { path: "/api/company", key: "company", seed: SEED_COMPANY },
      { path: "/api/runway", key: "runway", seed: SEED_RUNWAY },
      { path: "/api/investors", key: "investors", seed: SEED_INVESTORS },
      { path: "/api/pitches", key: "pitches", seed: SEED_PITCHES },
      { path: "/api/customers", key: "customers", seed: SEED_CUSTOMERS },
      { path: "/api/decisions", key: "decisions", seed: SEED_DECISIONS },
      { path: "/api/competitors", key: "competitors", seed: SEED_COMPETITORS },
      { path: "/api/metrics", key: "metrics", seed: SEED_METRICS }
    ];
    for (const route of crudRoutes) {
      if (path === route.path) {
        if (request.method === "GET") {
          const data = await getData(env.STARTUP_KV, route.key, route.seed);
          return json(data);
        }
        if (request.method === "POST") {
          const body = await request.json();
          await setData(env.STARTUP_KV, route.key, body);
          return json({ ok: true, key: route.key });
        }
      }
    }
    return new Response("Not Found", { status: 404 });
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-KpntQ5/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-KpntQ5/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
