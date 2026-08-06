/**
 * Commission terms shown in the modal on / and /projects.
 *
 * These are quoted back at you by clients — keep them accurate.
 */

export const commissions = {
  eyebrow: "commissions",

  /** the word inside `title` matching `titleAccent` renders in serif italic */
  title: "let's build something",
  titleAccent: "build",

  tagline: "focused work on things worth shipping.",

  /** shown as a large stat above the fold */
  stat: {
    value: "OPEN",
    label: "for new work",
  },

  /** starting price shown on the home page pill */
  startingAt: "$50+",

  whatIBuild:
    "typescript-first full-stack work — next.js on the front, node or python on the back. i ship landing pages, dashboards, documentation sites, and storefronts. if it's web, thoughtfully designed, and built with intent, we're probably compatible.",

  howItWorks:
    "drop me what you have — a sketch, a doc, a vague idea. i scope it, quote it, and get back to you. work runs in clean branches with readable commits. i'm async by default, sync when it actually moves things.",

  rates:
    "scoped work starts at $50 — a landing page, a small dashboard, a single feature. full builds get quoted per project after a real conversation about what you need.",

  whatIPassOn:
    "anything that needs me to fight the brief, low-effort template work, or anything i couldn't put my name on. i'd rather say no early than deliver something half-baked.",

  faq: [
    {
      q: "how does payment work",
      a: "50% up front, 50% on delivery. larger builds get split into milestones so neither of us is carrying all the risk.",
    },
    {
      q: "what about revisions",
      a: "two rounds are included in every quote. beyond that we talk — usually it means the scope moved, and that's fine, it just gets re-quoted.",
    },
    {
      q: "who owns the code",
      a: "you do, once final payment clears. i keep the right to show the work in my portfolio unless you ask me not to.",
    },
    {
      q: "do you sign nda's",
      a: "yes. send it over before we get into specifics and i'll review it.",
    },
  ],
} as const
