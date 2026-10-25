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
    id: "usr_writer",
    name: "Maya Lin-Desai",
    email: "maya.lindesai@chronicle.press",
    role: "author",
    bio: "Contributing Essayist. Writing on computational aesthetics, book history, and cognitive ecology.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
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
    publishedAt: "2026-10-24T10:00:00.000Z",
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

Yet the work of true criticism has always required latency. It demands that an idea be allowed to cool, to oxidize against the atmosphere of contemplation. Without solitude, criticism degenerates into mere polling.`,
    coverUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture", "Criticism"],
    tags: ["solitude", "criticism", "literature", "philosophy"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-23T14:30:00.000Z",
    views: 8940,
    likes: ["usr_author"]
  },
  {
    id: "post_3",
    authorId: "usr_writer",
    title: "An Exhaustive Investigation into the Epistemological Consequences of Automated Literary Summarization and the Gradual Dissolution of Deep Reading Across Academic Disciplines",
    slug: "exhaustive-investigation-automated-literary-summarization",
    excerpt: "When algorithms condense nuanced philosophical treatises into five bulleted talking points, we lose the architectural cadence of argumentation itself.",
    content: `Synthesizing a complex text is not an arithmetic operation. When reader encounter a difficult text, comprehension occurs precisely in the moments of resistance—the paragraphs that demand re-reading, the unfamiliar syntax that disrupts complacent cognition.

By substituting algorithmic abstracts for whole texts, contemporary institutions inadvertently train minds to value conclusions severed from reasoning.`,
    coverUrl: null, // intentionally no cover image
    categories: ["Essays", "Technology"],
    tags: ["algorithms", "pedagogy", "philosophy", "deep-reading"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-22T08:15:00.000Z",
    views: 12450,
    likes: ["usr_admin", "usr_reader", "usr_author"]
  },
  {
    id: "post_4",
    authorId: "usr_author",
    title: "The Ghost in the Grid: Algorithmic Geometry and Human Frailty",
    slug: "the-ghost-in-the-grid",
    excerpt: "How modernist modular grids anticipated algorithmic layout, and where human intuition must intervene.",
    content: `Josef Müller-Brockmann codified the modular grid not to constrain the designer, but to liberate the reader from arbitrary chaos. Yet when algorithms inherit the grid, they frequently mistake mechanical regularity for harmony.`,
    coverUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80",
    categories: ["Design", "Technology"],
    tags: ["grid", "bauhaus", "design-theory"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-21T09:15:00.000Z",
    views: 6310,
    likes: ["usr_reader"]
  },
  {
    id: "post_5",
    authorId: "usr_admin",
    title: "A Manifesto for Quiet Software",
    slug: "a-manifesto-for-quiet-software",
    excerpt: "Tools designed to be used, set down, and forgotten—not to colonize the waking hours of their users.",
    content: `We have engineered an ecosystem of relentless notification. Every software utility aspires to become an all-consuming destination, demanding attention through artificial streaks and synthetic urgency. Quiet software makes no claim upon your soul.`,
    coverUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    categories: ["Technology", "Essays"],
    tags: ["software", "minimalism", "ethics", "attention"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-20T16:00:00.000Z",
    views: 11250,
    likes: ["usr_author", "usr_reader"]
  },
  {
    id: "post_6",
    authorId: "usr_writer",
    title: "Typesetting the Avant-Garde: 1910–1935",
    slug: "typesetting-the-avant-garde",
    excerpt: "From Marinetti's metal letters to El Lissitzky's typographical constructions: an archival inspection.",
    content: `Between the publication of the Futurist Manifesto and the rise of the New Typography in Germany, the printed word underwent its most violent rupture since Gutenberg.`,
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    categories: ["Essays", "Culture"],
    tags: ["avant-garde", "history", "typography", "archive"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-19T11:20:00.000Z",
    views: 4520,
    likes: []
  },
  {
    id: "post_7",
    authorId: "usr_author",
    title: "Monochrome as an Anti-Commodity Aesthetic in Contemporary Publication Design",
    slug: "monochrome-anti-commodity-aesthetic",
    excerpt: "In a visual landscape dominated by saturated gradients and dopamine triggers, black ink on unbleached paper becomes a radical gesture.",
    content: `Color in modern interface design has been systematically weaponized. Notification badges pulse with crimson urgency; marketing banners exploit high-chroma gradients to seize involuntary optical fixation. To choose monochrome is to reject this coercive transaction.`,
    coverUrl: null, // no cover image
    categories: ["Design", "Criticism"],
    tags: ["monochrome", "aesthetics", "print", "design-theory"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-18T15:00:00.000Z",
    views: 7420,
    likes: ["usr_admin"]
  },
  {
    id: "post_8",
    authorId: "usr_admin",
    title: "The Deceleration of Thought: A Defense of the Quarterly Journal",
    slug: "deceleration-of-thought-defense-quarterly",
    excerpt: "Why the quarterly publication cadence fosters intellectual resilience that daily journalism cannot replicate.",
    content: `When a periodical publishes four times a year, its contributors are relieved of the panic of the breaking cycle. They can afford to observe an entire season before casting a sentence.`,
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture", "Essays"],
    tags: ["journalism", "periodicals", "slow-media"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-17T13:10:00.000Z",
    views: 9180,
    likes: ["usr_writer", "usr_reader"]
  },
  {
    id: "post_9",
    authorId: "usr_writer",
    title: "Concrete and Serifs: The Architectural Pedigree of Italian Typefoundries",
    slug: "concrete-and-serifs-italian-typefoundries",
    excerpt: "Tracing the structural kinship between rationalist Milanese façades and the punch-cut matrices of Nebiolo.",
    content: `Milan in the 1930s was an open-air laboratory for structural honesty. The same architects who poured reinforced concrete for suburban transit terminals spent their evenings designing title faces for architectural bulletins.`,
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    categories: ["Design", "Culture"],
    tags: ["architecture", "typography", "italy", "history"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-16T10:45:00.000Z",
    views: 5210,
    likes: []
  },
  {
    id: "post_10",
    authorId: "usr_author",
    title: "The Illusion of Infinite Canvas: Why Physical Restraints Breed Clearer Thought",
    slug: "illusion-of-infinite-canvas",
    excerpt: "Infinite digital whiteboards promise unbounded creativity, but without edges, ideas dissipate into sprawling incoherence.",
    content: `The boundary of a sheet of paper is its greatest asset. Knowing that space terminates at the margin forces an economy of expression. You cannot wander forever across eight thousand pixels of canvas.`,
    coverUrl: null, // no cover image
    categories: ["Essays", "Technology"],
    tags: ["constraints", "tools", "cognition"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-15T18:30:00.000Z",
    views: 6730,
    likes: ["usr_reader"]
  },
  {
    id: "post_11",
    authorId: "usr_admin",
    title: "Against the Cult of Engagement: Metrics That Starve the Creative Intellect",
    slug: "against-cult-of-engagement-metrics",
    excerpt: "How time-on-page and bounce rate optimizations systematically weed out subtle, contemplative prose in favor of inflammatory agitation.",
    content: `If you measure the worth of an essay by whether the reader leaves immediately to comment, you will inevitably publish exclusively provocative provocation. A truly profound essay causes the reader to put down the device and look out the window in silent thought.`,
    coverUrl: "https://images.unsplash.com/photo-1507842229451-79b1be886a20?auto=format&fit=crop&w=1200&q=80",
    categories: ["Criticism", "Technology"],
    tags: ["metrics", "publishing", "ethics", "attention"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-14T09:00:00.000Z",
    views: 13900,
    likes: ["usr_writer", "usr_author", "usr_reader"]
  },
  {
    id: "post_12",
    authorId: "usr_writer",
    title: "A Survey of Japanese Bookbinding Techniques and the Philosophy of the Visible Stitch",
    slug: "survey-japanese-bookbinding-visible-stitch",
    excerpt: "From Fukuro Toji to modern experimental bindings: an exploration of structure that refuses to hide its joinery.",
    content: `Western bookbinding historically took pride in concealing its spine beneath layers of marbled calfskin. Japanese traditions, by contrast, celebrate the exposed linen cord, turning structural necessity into visual rhyme.`,
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    categories: ["Design", "Culture"],
    tags: ["craft", "bookbinding", "japan", "materiality"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-13T14:20:00.000Z",
    views: 4890,
    likes: ["usr_reader"]
  },
  {
    id: "post_13",
    authorId: "usr_author",
    title: "The Typography of Street Signs: Civic Identity and Municipal Lettering in Post-War Britain",
    slug: "typography-of-street-signs-post-war-britain",
    excerpt: "Jock Kinneir and Margaret Calvert's transport lettering did more than direct motorcars; it codified modern British civic dignity.",
    content: `To drive upon the M1 motorway in 1959 was to experience typography at seventy miles per hour. The bespoke alphabet developed by Kinneir and Calvert had to be legible in driving rain through a mud-spattered windshield.`,
    coverUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    categories: ["Design", "Essays"],
    tags: ["typography", "signage", "britain", "history"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-12T11:00:00.000Z",
    views: 7120,
    likes: ["usr_admin"]
  },
  {
    id: "post_14",
    authorId: "usr_admin",
    title: "Critical Notes on the Decline of the Literary Salons in Paris and Vienna",
    slug: "decline-literary-salons-paris-vienna",
    excerpt: "What was lost when face-to-face intellectual dialectic migrated to asynchronous public broadcasting platforms.",
    content: `The nineteenth-century salon was not simply an aristocratic indulgence; it was a calibrated friction chamber. People who disagreed vehemently were obliged to look one another in the eye over tea.`,
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture", "Criticism"],
    tags: ["history", "sociology", "literature", "salons"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-11T16:15:00.000Z",
    views: 5980,
    likes: []
  },
  {
    id: "post_15",
    authorId: "usr_writer",
    title: "In Defense of Obsolete Protocols: Gopher, Gemini, and the Nostalgia for Textual Clarity",
    slug: "in-defense-of-obsolete-protocols",
    excerpt: "Before the World Wide Web became an encrypted television network, alternate protocols treated plain text as a sovereign medium.",
    content: `Browsing the Gemini protocol feels like stepping into a library reading room after twenty minutes on a noisy subway platform. No scripts execute; no trackers follow; typography is left entirely to the reader's client.`,
    coverUrl: null, // no cover image
    categories: ["Technology", "Essays"],
    tags: ["internet", "protocols", "retrocomputing", "minimalism"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-10T08:40:00.000Z",
    views: 10420,
    likes: ["usr_author", "usr_reader"]
  },
  {
    id: "post_16",
    authorId: "usr_author",
    title: "The Lost Grammar of the Colophon",
    slug: "the-lost-grammar-of-the-colophon",
    excerpt: "Why declaring your typeface, paper mill, and printer was once an essential mark of publisher integrity.",
    content: `At the rear of every serious volume, the colophon once served as an audited certificate of craft. It told you whose hands had fed the lead into the crucible and where the rags for the pulp had been sourced.`,
    coverUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture", "Design"],
    tags: ["colophon", "publishing", "books", "craft"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-09T12:00:00.000Z",
    views: 3820,
    likes: ["usr_admin"]
  },
  {
    id: "post_17",
    authorId: "usr_admin",
    title: "The Epistemology of the Margin: Marginalia as Dialogue Across Centuries",
    slug: "epistemology-of-the-margin-marginalia",
    excerpt: "From Fermat's conjecture to Coleridge's annotations: how readers transform books into bidirectional conversations.",
    content: `To open a fifteenth-century incunabula and find notes inked in iron gall by three successive generations of scholars is to realize that a book is never a solitary artifact.`,
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    categories: ["Essays", "Criticism"],
    tags: ["marginalia", "reading", "history", "scholarship"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-08T15:30:00.000Z",
    views: 8430,
    likes: ["usr_writer", "usr_reader"]
  },
  {
    id: "post_18",
    authorId: "usr_writer",
    title: "Against Responsive Amnesia: Why Web Archives Fail Where Paper Endures",
    slug: "against-responsive-amnesia-web-archives",
    excerpt: "The bitter irony of the digital age: we have generated more text than all prior centuries combined, and will preserve almost none of it.",
    content: `A website is not a document; it is a live performance executed by hundreds of remote dependencies. When a single certificate expires or an API domain changes hands, the page vanishes into a blank error code.`,
    coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80",
    categories: ["Technology", "Criticism"],
    tags: ["archiving", "web", "preservation", "ephemera"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-07T09:10:00.000Z",
    views: 11950,
    likes: ["usr_admin", "usr_author"]
  },
  {
    id: "post_19",
    authorId: "usr_author",
    title: "Form Follows Finance: How Real Estate Speculation Destroyed the Bohemian Typography Workshop",
    slug: "form-follows-finance-bohemian-workshop",
    excerpt: "When industrial rents in Soho and Kreuzberg quadrupled, the heavy cast-iron Vandercook press was the first casualty.",
    content: `You cannot operate a letterpress in a shared co-working incubator. A Heidelberg platen weighs two tons; it vibrates the joists; it smells of mineral spirits and raw oil.`,
    coverUrl: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture", "Design"],
    tags: ["gentrification", "letterpress", "economics", "craft"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-06T14:50:00.000Z",
    views: 6120,
    likes: []
  },
  {
    id: "post_20",
    authorId: "usr_admin",
    title: "The Syntax of the Footnote: Secondary Channels of Narrative in Scholarly Prose",
    slug: "syntax-of-the-footnote",
    excerpt: "How Gibbon, Nabokov, and David Foster Wallace turned bottom-of-page annotations into subversive parallel texts.",
    content: `The footnote is an architect's basement: the place where the plumbing of scholarship is exposed, where digressions too eccentric for the parlor are permitted to breathe.`,
    coverUrl: null, // no cover image
    categories: ["Essays", "Criticism"],
    tags: ["footnotes", "writing", "literature", "scholarship"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-05T17:00:00.000Z",
    views: 7890,
    likes: ["usr_reader"]
  },
  {
    id: "post_21",
    authorId: "usr_writer",
    title: "Algorithmic Monoculture in Typeface Selection Across Contemporary Consumer Brands",
    slug: "algorithmic-monoculture-typeface-selection",
    excerpt: "Why every luxury fashion house and tech conglomerate adopted the exact same geometric sans-serif within forty-eight months.",
    content: `From Burberry to Balenciaga, the distinctive bespoke lettering that defined twentieth-century prestige was systematically dismantled in favor of uninflected grotesque letterforms optimized for smartphone thumbnails.`,
    coverUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    categories: ["Design", "Criticism"],
    tags: ["branding", "typography", "monoculture", "fashion"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-04T11:30:00.000Z",
    views: 9450,
    likes: ["usr_author"]
  },
  {
    id: "post_22",
    authorId: "usr_author",
    title: "The Solitude of the Archive: Notes from the Rare Manuscripts Room at the Bodleian",
    slug: "solitude-of-the-archive-bodleian",
    excerpt: "What three months beneath Duke Humfrey's timber beams teaches you about the fragility of human memory.",
    content: `In the silence of the Bodleian, time ceases to be linear. You hold a charter signed by a Norman bailiff with dirt beneath his fingernails, and the centuries collapse into a single heartbeat.`,
    coverUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture", "Essays"],
    tags: ["oxford", "libraries", "manuscripts", "history"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-03T08:20:00.000Z",
    views: 5630,
    likes: ["usr_admin", "usr_reader"]
  },
  {
    id: "post_23",
    authorId: "usr_admin",
    title: "Silicon Valley's War on Ambiguity: Why Complexity is Not a Bug to Be Squashed",
    slug: "silicon-valleys-war-on-ambiguity",
    excerpt: "When software product managers equate friction with failure, they systematically erase the productive doubt necessary for ethical deliberation.",
    content: `Frictionless experiences are suitable for purchasing plane tickets; they are catastrophic for moral thought. Ethical decision-making requires pause, second-guessing, and uncomfortable ambivalence.`,
    coverUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    categories: ["Technology", "Criticism"],
    tags: ["ethics", "technology", "friction", "philosophy"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-02T13:45:00.000Z",
    views: 12890,
    likes: ["usr_writer", "usr_author"]
  },
  {
    id: "post_24",
    authorId: "usr_writer",
    title: "The Disappearance of the Index: How Search Engines Crippled Our Ability to Map Knowledge",
    slug: "disappearance-of-the-index-search-engines",
    excerpt: "A back-of-the-book index is not a keyword search; it is a conceptual cartography prepared by a living scholar.",
    content: `Keyword search delivers matching fragments while concealing the forest. A master indexer does not merely match strings; they construct an intellectual topology that shows how concepts intersect across a text.`,
    coverUrl: null, // no cover image
    categories: ["Essays", "Technology"],
    tags: ["indexing", "books", "search", "scholarship"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-01T15:10:00.000Z",
    views: 7340,
    likes: ["usr_reader"]
  },
  {
    id: "post_25",
    authorId: "usr_author",
    title: "The Aesthetic of the Raw Proof: Why the Rough Draft Retains a Radiance the Polished Volume Loses",
    slug: "aesthetic-of-raw-proof-rough-draft",
    excerpt: "Examining Virginia Woolf's corrected typescripts and the vitality of thoughts caught mid-flight.",
    content: `A finished book has its hair combed and its tie straightened. A galley proof, with its marginal strikes and hasty handwritten interpolations, still has blood coursing through its veins.`,
    coverUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture", "Criticism"],
    tags: ["drafts", "writing", "literature", "process"],
    status: "published",
    featured: false,
    publishedAt: "2026-09-30T10:00:00.000Z",
    views: 6410,
    likes: ["usr_admin"]
  },
  {
    id: "post_26",
    authorId: "usr_admin",
    title: "Reflections on Mid-Century Architectural Journals: The Golden Decade of Casabella and Domus",
    slug: "reflections-mid-century-architectural-journals",
    excerpt: "How Gio Ponti and Ernesto Rogers balanced editorial rigor with radical photographic experimentation.",
    content: `Post-war Milan was rebuilding itself physically and intellectually simultaneously. Every issue of Casabella was an act of civic reconstruction.`,
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    categories: ["Design", "Criticism"],
    tags: ["architecture", "journals", "history", "milan"],
    status: "published",
    featured: false,
    publishedAt: "2026-09-28T09:30:00.000Z",
    views: 4820,
    likes: ["usr_writer"]
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
    createdAt: "2026-10-24T11:15:00.000Z"
  },
  {
    id: "cmt_2",
    postId: "post_1",
    userId: "usr_author",
    parentId: "cmt_1",
    body: "Precisely, Clara. When the eye has to make a 20cm horizontal sweep, the comprehension drop-off is measurable.",
    isApproved: true,
    createdAt: "2026-10-24T12:00:00.000Z"
  },
  {
    id: "cmt_3",
    postId: "post_1",
    userId: "usr_reader",
    parentId: "cmt_2",
    body: "Indeed. Have you considered contrasting this with Tschichold's late return to classic book design?",
    isApproved: true,
    createdAt: "2026-10-24T12:45:00.000Z"
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
