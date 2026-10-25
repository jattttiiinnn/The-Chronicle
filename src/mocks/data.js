/**
 * Seed data matching Section 11 data shapes exactly:
 * - User: { id, name, email, role, bio, avatarUrl }
 * - Post: { id, authorId, title, slug, content, excerpt, coverUrl, categories[], tags[], status, publishedAt, views, likes[] }
 * - Comment: { id, postId, userId, parentId, body, isApproved, createdAt }
 */

export const mockUsers = [
  {
    id: "usr_admin",
    name: "Eleanor Vance",
    email: "eleanor.vance@chronicle.press",
    role: "admin",
    bio: "Editor-in-Chief. Essayist on architectural typography, printed manifestos, and literary theory.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "usr_author",
    name: "Julian Thorne",
    email: "julian.thorne@chronicle.press",
    role: "author",
    bio: "Senior Critic & Typographer. Former design director investigating digital reading habits and computational prose.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "usr_reader",
    name: "Clara Oswald",
    email: "clara.reader@example.com",
    role: "reader",
    bio: "Architectural historian and avid reader of mid-century monographs.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
  }
];

export const mockPosts = [
  {
    id: "post_1",
    authorId: "usr_author",
    title: "The Architecture of the Printed Page in the Digital Era",
    slug: "architecture-of-the-printed-page",
    excerpt: "Why the tactile discipline of ink on rag paper remains our most rigorous framework for constructing quiet digital spaces.",
    content: `The modern interface is rarely quiet. In our headlong rush toward fluidity and dynamic responsiveness, we abandoned the architectural solemnity of the broadsheet. A printed page possesses physical weight, boundary, and an unspoken pact with the reader: it will not shift while your eyes move across it.

When we consider the layout of a seventeenth-century quarto or the austere geometry of the Bauhaus masters, what strikes us is not their technical limitations, but their restraint. White space was not merely empty real estate awaiting an advertisement; it was a deliberate pause—a breath drawn before the next movement in a symphony.

> "A great magazine does not shout across the room; it speaks with measured authority in a tone designed to outlast the season."

### The Geometry of Measured Lines

A column of text is an engine for thought. Set it too wide, and the eye tires before discovering the turn of the phrase; set it too narrow, and rhythm collapses into frantic vertical agitation. The traditional canon dictates between sixty and seventy-five characters per line—the exact breadth of human optical comfort.

\`\`\`javascript
// The Golden Proportion of typography
function computeMeasure(fontSize, ratio = 1.618) {
  const baseCharacters = 68;
  return \`\${baseCharacters * (fontSize / 16)}ch\`;
}
\`\`\`

To build for the digital reader without condescension is to restore this discipline. We must decline the siren song of reactive widgets and return to the dignity of the rule, the hairline, and the serif.

### The Permanence of Thought

In an era of fleeting ephemera, typography remains an act of preservation. Every glyph cast upon the screen carries the ghost of punch-cut metal.`,
    coverUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
    categories: ["Essays", "Design"],
    tags: ["typography", "architecture", "print", "minimalism"],
    status: "published",
    featured: true,
    publishedAt: "2026-10-20T10:00:00.000Z",
    views: 14820,
    likes: ["usr_reader", "usr_admin"]
  },
  {
    id: "post_2",
    authorId: "usr_admin",
    title: "On the Necessity of Solitude in Modern Criticism",
    slug: "necessity-of-solitude-in-criticism",
    excerpt: "Dispatches from the margins of discourse: why immediate reaction is the natural enemy of enduring evaluation.",
    content: `Instant commentary has become our default cognitive reflex. Before a novel has settled on the nightstand or an exhibition has completed its opening fortnight, the algorithmic agora demands verdict.

Yet the work of true criticism has always required latency. It demands that an idea be allowed to cool, to oxidize against the atmosphere of contemplation. Without solitude, criticism degenerates into mere polling.

### Against the Velocity of the Feed

Consider the pace of Sainte-Beuve or Virginia Woolf. Their essays were constructed over weeks of patient rumination.

> "To critique is not to grade; it is to illuminate the subterranean currents of human consciousness."

When we decelerate our response, we discover dimensions invisible in the initial glare of spectacle.`,
    coverUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture", "Criticism"],
    tags: ["solitude", "criticism", "literature", "philosophy"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-18T14:30:00.000Z",
    views: 8940,
    likes: ["usr_author"]
  },
  {
    id: "post_3",
    authorId: "usr_author",
    title: "The Ghost in the Grid: Algorithmic Geometry and Human Frailty",
    slug: "the-ghost-in-the-grid",
    excerpt: "How modernist modular grids anticipated algorithmic layout, and where human intuition must intervene.",
    content: `Josef Müller-Brockmann codified the modular grid not to constrain the designer, but to liberate the reader from arbitrary chaos.

Yet when algorithms inherit the grid, they frequently mistake regularity for harmony. The master typographer knows precisely when to fracture the column—to let an illustration breach the margin or an asymmetric drop cap initiate the cadence.

### The Human Anomaly

Every great layout contains a subtle imperfection: a counterpoint that signals the presence of living hands behind the typesetting desk.`,
    coverUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80",
    categories: ["Design", "Technology"],
    tags: ["grid", "bauhaus", "algorithms", "design-theory"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-15T09:15:00.000Z",
    views: 6310,
    likes: ["usr_reader"]
  },
  {
    id: "post_4",
    authorId: "usr_admin",
    title: "A Manifesto for Quiet Software",
    slug: "a-manifesto-for-quiet-software",
    excerpt: "Tools designed to be used, set down, and forgotten—not to colonize the waking hours of their users.",
    content: `We have engineered an ecosystem of relentless notification. Every software utility aspires to become an all-consuming destination, demanding attention through artificial streaks and synthetic urgency.

Quiet software makes no claim upon your soul. It accomplishes its designated task with grace and immediately returns you to the world of tactile reality.`,
    coverUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    categories: ["Technology", "Essays"],
    tags: ["software", "minimalism", "ethics", "attention"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-11T16:00:00.000Z",
    views: 11250,
    likes: ["usr_author", "usr_reader"]
  },
  {
    id: "post_5",
    authorId: "usr_author",
    title: "Typesetting the Avant-Garde: 1910–1935",
    slug: "typesetting-the-avant-garde",
    excerpt: "From Marinetti's metal letters to El Lissitzky's typographical constructions: an archival inspection.",
    content: `Between the publication of the Futurist Manifesto and the rise of the New Typography in Germany, the printed word underwent its most violent rupture since Gutenberg.`,
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    categories: ["Essays", "Culture"],
    tags: ["avant-garde", "history", "typography", "archive"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-05T11:20:00.000Z",
    views: 4520,
    likes: []
  },
  {
    id: "post_6",
    authorId: "usr_author",
    title: "The Next Issue: The Politics of Computational Form",
    slug: "the-politics-of-computational-form",
    excerpt: "An upcoming survey into algorithmic governance and digital aesthetic monopolies.",
    content: `Draft material exploring the intersection of distributed systems and visual identity...`,
    coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    categories: ["Technology"],
    tags: ["computation", "politics", "future"],
    status: "draft",
    featured: false,
    publishedAt: null,
    views: 0,
    likes: []
  },
  {
    id: "post_7",
    authorId: "usr_admin",
    title: "Reflections on Mid-Century Architectural Journals",
    slug: "reflections-mid-century-architectural-journals",
    excerpt: "Scheduled for publication on the upcoming autumn solstice.",
    content: `Scheduled dispatch analyzing Casabella and Domus editorial rhythms in the 1950s.`,
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    categories: ["Design", "Criticism"],
    tags: ["architecture", "journals", "history"],
    status: "scheduled",
    featured: false,
    publishedAt: "2026-11-01T08:00:00.000Z",
    views: 0,
    likes: []
  }
];

export const mockComments = [
  {
    id: "cmt_1",
    postId: "post_1",
    userId: "usr_reader",
    parentId: null,
    body: "The passage on the sixty-eight character measure is indispensable. Too many modern web publications stretch sentences across 4K displays with reckless disregard for reading fatigue.",
    isApproved: true,
    createdAt: "2026-10-21T11:15:00.000Z"
  },
  {
    id: "cmt_2",
    postId: "post_1",
    userId: "usr_author",
    parentId: "cmt_1",
    body: "Precisely, Clara. When the eye has to make a 20cm horizontal sweep, the comprehension drop-off is measurable.",
    isApproved: true,
    createdAt: "2026-10-21T12:00:00.000Z"
  },
  {
    id: "cmt_3",
    postId: "post_1",
    userId: "usr_reader",
    parentId: "cmt_2",
    body: "Indeed. Have you considered contrasting this with Tschichold's late return to classic book design?",
    isApproved: true,
    createdAt: "2026-10-21T12:45:00.000Z"
  },
  {
    id: "cmt_4",
    postId: "post_1",
    userId: "usr_reader",
    parentId: null,
    body: "This comment is awaiting moderation to verify approval states.",
    isApproved: false,
    createdAt: "2026-10-24T18:20:00.000Z"
  }
];
