export const SITE_NAME = 'THE CHRONICLE';

export const SITE_CONFIG = {
  name: SITE_NAME,
  description: 'An independent digital journal of essays, culture, critical inquiry, and ideas unfolded.',
  volume: 'VOL. 01',
  author: 'Editorial Desk',
  defaultCover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
  categories: [
    { slug: 'essays', name: 'Essays' },
    { slug: 'culture', name: 'Culture' },
    { slug: 'technology', name: 'Technology' },
    { slug: 'design', name: 'Design' },
    { slug: 'criticism', name: 'Criticism' }
  ],
  socials: {
    twitter: '@chroniclejournal',
    rss: '/feed.xml'
  }
};
