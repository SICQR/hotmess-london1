/**
 * HOTMESS LEGAL COPY
 * Privacy, Terms, DMCA, Care Disclaimers
 * Production-ready, lawyer-approved tone
 */

// ==========================================
// PRIVACY POLICY
// ==========================================

export const PRIVACY_POLICY = {
  title: "Privacy Policy",
  intro: "We don't sell your data. We barely want it. You can delete everything anytime.",
  
  sections: [
    {
      heading: "What We Collect",
      content: `We collect only what's necessary to run the service:
      
• Email address (for account access)
• Location data (only when you scan beacons, and only with your permission)
• XP and activity logs (to track rewards)
• Payment info (processed by Stripe, we never see your card details)

That's it. No tracking scripts. No third-party data brokers. No bullshit.`,
    },
    {
      heading: "How We Use It",
      content: `Your data powers your experience:

• Email: for account recovery and critical updates only
• Location: to activate beacons and show you the heatmap
• Activity: to calculate XP and unlock rewards
• Payment: to process orders

We don't use your data for advertising. We don't train AI on it. We don't hand it to partners.`,
    },
    {
      heading: "Who Sees It",
      content: `Almost nobody.

• You (obviously)
• Our servers (encrypted)
• Stripe (for payments, under their own privacy policy)
• Law enforcement (only with a valid legal order)

That's the full list. No "trusted partners." No data resellers.`,
    },
    {
      heading: "Your Rights",
      content: `You're in control:

• Export your data anytime (account settings)
• Delete your account anytime (it's permanent, no take-backs)
• Opt out of location tracking (you just won't be able to scan beacons)
• Update your info whenever you want

Email us and we'll handle it within 48 hours.`,
    },
    {
      heading: "Security",
      content: `We take this seriously:

• All connections are encrypted (TLS 1.3)
• Passwords are hashed (bcrypt, industry standard)
• Location data is anonymized after 24 hours
• Regular security audits

But no system is perfect. If there's a breach, we'll tell you immediately.`,
    },
    {
      heading: "Age Requirement",
      content: "You must be 18+ to use HOTMESS. We don't knowingly collect data from anyone under 18. If we find out, we delete it immediately.",
    },
    {
      heading: "Changes",
      content: "If we update this policy, we'll email you. You'll have 30 days to object. If you don't like it, delete your account and we'll respect that.",
    },
  ],
  
  contact: "Questions? Email privacy@hotmess.london",
  lastUpdated: "Last updated: November 2024",
} as const;

// ==========================================
// TERMS OF SERVICE
// ==========================================

export const TERMS_OF_SERVICE = {
  title: "Terms of Service",
  intro: "Be an adult. Be respectful. We'll do the same.",
  
  sections: [
    {
      heading: "The Basics",
      content: `By using HOTMESS, you agree to:

• Be 18 or older
• Not be an asshole
• Respect consent (always, no exceptions)
• Follow UK law
• Not try to break our systems

That's the core of it.`,
    },
    {
      heading: "What You Can Do",
      content: `HOTMESS is for:

• Scanning beacons and earning XP
• Shopping for gear
• Listening to radio
• Connecting with the community
• Accessing aftercare resources

Use it how you want, within reason.`,
    },
    {
      heading: "What You Can't Do",
      content: `Don't:

• Harass, dox, or threaten anyone
• Scrape our data or reverse-engineer our systems
• Impersonate others
• Spam or bot the platform
• Share illegal content
• Glamorize harmful substance use
• Violate others' consent

Break these rules and you're out. No warnings, no refunds.`,
    },
    {
      heading: "Content & Behaviour",
      content: `You're responsible for what you post and how you act.

We reserve the right to remove content or ban users who:
• Violate community guidelines
• Engage in racism, misogyny, or phobia
• Threaten safety
• Repeatedly ignore moderator warnings

We don't make these decisions lightly. But when we do, they're final.`,
    },
    {
      heading: "Purchases & Refunds",
      content: `All sales through the shop are final unless:

• The item is defective
• We sent the wrong item
• It never arrived

Contact us within 14 days for issues. We'll make it right.`,
    },
    {
      heading: "XP & Rewards",
      content: `XP has no cash value. Rewards can change or be discontinued. We'll try to give notice, but we're not obligated to.

If we suspect XP fraud (botting, spoofing location), we'll reset your account or ban you.`,
    },
    {
      heading: "Liability",
      content: `HOTMESS is provided "as is." We do our best, but things break.

We're not liable for:
• Service interruptions
• Lost XP or rewards due to bugs
• Third-party services (Stripe, RadioKing, etc.)
• Decisions you make using info from Hand N Hand (it's not medical advice)

Use common sense. Take care of yourself.`,
    },
    {
      heading: "Disputes",
      content: "If there's a problem, email us first. We'll try to sort it out like adults. If that fails, disputes are handled under UK law in London courts.",
    },
    {
      heading: "Changes",
      content: "We can update these terms anytime. We'll email you. Continued use = acceptance.",
    },
  ],
  
  contact: "Questions? Email legal@hotmess.london",
  lastUpdated: "Last updated: November 2024",
} as const;

// ==========================================
// DMCA & TAKEDOWN
// ==========================================

export const DMCA_POLICY = {
  title: "DMCA & Takedown Policy",
  intro: "If your rights are violated, we move fast.",
  
  sections: [
    {
      heading: "Copyright Infringement",
      content: `If someone's using your content without permission, let us know:

Required info:
• Your contact details
• Description of the copyrighted work
• Where the infringing content is on HOTMESS
• A statement that you own the copyright or are authorized to act
• Your signature (electronic is fine)

Send to: dmca@hotmess.london

We'll investigate within 48 hours. If valid, we remove it immediately.`,
    },
    {
      heading: "Counter-Notice",
      content: `If your content was removed and you believe it was a mistake:

Send a counter-notice with:
• Your contact details
• Description of the removed content
• A statement that you believe the takedown was in error
• Your signature

We'll review and restore if appropriate (unless the original claimant files legal action).`,
    },
    {
      heading: "Repeat Infringers",
      content: "Accounts with multiple valid DMCA strikes will be permanently banned.",
    },
    {
      heading: "Other Legal Requests",
      content: `For non-copyright issues (defamation, privacy, etc.), email legal@hotmess.london with:

• Description of the issue
• Legal basis for the request
• Location of the content

We'll respond within 5 business days.`,
    },
  ],
  
  contact: "DMCA Agent: dmca@hotmess.london",
} as const;

// ==========================================
// CARE DISCLAIMER
// ==========================================

export const CARE_DISCLAIMER = {
  title: "Care & Aftercare Disclaimer",
  intro: "Not medical advice. Not emergency support. We're community, not clinicians.",
  
  sections: [
    {
      heading: "What Hand N Hand Is",
      content: `Hand N Hand provides:

• Community support and connection
• Harm reduction information
• Grounding techniques
• Links to professional resources

It's peer-to-peer care. Lived experience. Brotherhood.`,
    },
    {
      heading: "What It's Not",
      content: `Hand N Hand does NOT provide:

• Medical advice or diagnosis
• Therapy or counseling
• Emergency crisis intervention
• Legal advice
• Substance use treatment

We're not doctors, therapists, or emergency services.`,
    },
    {
      heading: "In a Crisis",
      content: `If you or someone else needs immediate help:

UK Emergency Services: 999
NHS 111: 111
Samaritans (24/7): 116 123
Switchboard LGBT+: 0300 330 0630

Don't wait. Don't rely on HOTMESS for emergencies.`,
    },
    {
      heading: "Harm Reduction",
      content: `Our harm reduction info is educational only. It's not:

• Encouragement to use substances
• Medical supervision
• A guarantee of safety

Every person's body and situation is different. Make informed choices. Know your limits.`,
    },
    {
      heading: "Liability",
      content: `By using Hand N Hand resources, you understand:

• Information may not be complete or up-to-date
• We're not responsible for actions you take based on info provided
• Professional help is always recommended for serious concerns

We care. But we're not professionals. Act accordingly.`,
    },
    {
      heading: "Reporting Issues",
      content: "If you see harmful advice or behavior in Hand N Hand spaces, report it immediately. We moderate actively.",
    },
  ],
  
  emergencyBanner: "⚠️ CRISIS? Call 999 (emergency) or 116 123 (Samaritans 24/7). HOTMESS is not emergency support.",
  contact: "Questions? Email care@hotmess.london",
} as const;

// ==========================================
// AGE VERIFICATION
// ==========================================

export const AGE_VERIFICATION = {
  title: "Age Verification & 18+ Policy",
  intro: "Men only. 18+. ID checks enforced.",
  
  content: `HOTMESS is for adults only.

By entering, you confirm:
• You are 18 years of age or older
• You are legally allowed to view adult content in your jurisdiction
• You understand this is an adult-oriented platform

We reserve the right to:
• Request age verification at any time
• Remove accounts suspected of being underage
• Report suspected child safety issues to authorities

This isn't negotiable. If you're under 18, leave now.`,
  
  verification: "Random ID checks may be performed. Refusal = account suspension.",
} as const;

// ==========================================
// COMMUNITY GUIDELINES (LEGAL VERSION)
// ==========================================

export const COMMUNITY_GUIDELINES_LEGAL = {
  title: "Community Guidelines & Code of Conduct",
  intro: "Respect is the only real kink. Break that, and you're out.",
  
  violations: [
    {
      category: "Consent Violations",
      description: "Any form of non-consensual behavior, harassment, or pressure.",
      consequence: "Immediate permanent ban.",
    },
    {
      category: "Hate Speech",
      description: "Racism, misogyny, homophobia, transphobia, or any form of bigotry.",
      consequence: "Permanent ban. May be reported to authorities if threats are involved.",
    },
    {
      category: "Doxxing & Privacy",
      description: "Sharing private information without consent.",
      consequence: "Permanent ban. Legal action may be pursued.",
    },
    {
      category: "Glorifying Harm",
      description: "Encouraging dangerous substance use or self-harm.",
      consequence: "Warning, then ban. Serious cases = immediate ban + welfare check.",
    },
    {
      category: "Spam & Manipulation",
      description: "XP farming, botting, fake accounts, commercial spam.",
      consequence: "Account reset or ban.",
    },
  ],
  
  enforcement: "Moderation decisions are final. Appeals can be sent to appeals@hotmess.london within 7 days.",
} as const;

// ==========================================
// COOKIE POLICY
// ==========================================

export const COOKIE_POLICY = {
  title: "Cookie Policy",
  intro: "We use minimal cookies. Here's what and why.",
  
  essential: [
    { name: "auth_token", purpose: "Keeps you logged in", duration: "30 days" },
    { name: "consent_given", purpose: "Remembers you passed the age gate", duration: "1 year" },
  ],
  
  optional: [
    { name: "analytics", purpose: "Anonymous usage stats (opt-in)", duration: "90 days" },
  ],
  
  thirdParty: [
    { service: "Stripe", purpose: "Payment processing", link: "https://stripe.com/privacy" },
  ],
  
  control: "You can clear cookies anytime in your browser settings. Clearing auth cookies will log you out.",
} as const;
