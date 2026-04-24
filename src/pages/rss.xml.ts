import rss from '@astrojs/rss';

export function GET(context) {
  return rss({
    title: 'DUMB MONEY',
    description: 'Evidence-first market-structure intelligence for retail investors.',
    site: context.site,
    items: [
      {
        title: 'DUMB MONEY Home',
        description: 'Core thesis, market-structure narrative, and waitlist.',
        link: '/',
        pubDate: new Date('2026-04-24'),
      },
      {
        title: 'PFOF Hub',
        description: 'Answer-first explainer and source-backed FAQs on payment for order flow.',
        link: '/pfof',
        pubDate: new Date('2026-04-24'),
      },
      {
        title: 'Methodology',
        description: 'How claims are sourced, reviewed, and corrected.',
        link: '/methodology',
        pubDate: new Date('2026-04-24'),
      },
    ],
    customData: `<language>en-us</language>`,
  });
}
