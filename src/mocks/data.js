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
  // --- 1. LONG-FORM ARTICLE WITH RICH HEADINGS, CODE, BLOCKQUOTE, LISTS ---
  {
    id: "post_1",
    authorId: "usr_author",
    title: "The Architecture of the Printed Page in the Digital Era",
    slug: "architecture-of-the-printed-page",
    excerpt: "Why the tactile discipline of ink on rag paper remains our most rigorous framework for constructing quiet digital spaces.",
    content: `The modern interface is rarely quiet. In our headlong rush toward fluidity and dynamic responsiveness, we abandoned the architectural solemnity of the broadsheet. A printed page possesses physical weight, boundary, and an unspoken pact with the reader: it will not shift while your eyes move across it.

When we consider the layout of a seventeenth-century quarto or the austere geometry of the Bauhaus masters, what strikes us is not their technical limitations, but their restraint. White space was not merely empty real estate awaiting an advertisement; it was a deliberate pause—a breath drawn before the next movement in a symphony.

> "A great magazine does not shout across the room; it speaks with measured authority in a tone designed to outlast the season."

## The Geometry of Measured Lines

A column of text is an engine for thought. Set it too wide, and the eye tires before discovering the turn of the phrase; set it too narrow, and rhythm collapses into frantic vertical agitation. The traditional canon dictates between sixty and seventy-five characters per line—the exact breadth of human optical comfort.

Here is the computational formula balancing optical comfort against viewport width:

\`\`\`javascript
// Proportional line measure computation
function computeMeasure(fontSize, ratio = 1.618) {
  const baseCharacters = 68;
  const opticalWidth = baseCharacters * (fontSize / 16);
  return \`\${opticalWidth}ch\`;
}
\`\`\`

When typographic rules are treated as structural load-bearing elements rather than decorative flourishes, the reading interface achieves a state of quiet equilibrium.

### The Function of White Space

Negative space in book design serves three structural functions:

1. **Acoustic Insulation:** It isolates sentences from competing visual noise on the peripheral retina.
2. **Temporal Cadence:** Generous margins signal that the argument is designed to be contemplated rather than skimmed.
3. **Physical Orientation:** It provides space for thumbs, bookmarks, and reader marginalia.

## The Permanence of Thought

In an era of fleeting ephemera, typography remains an act of preservation. Every glyph cast upon the screen carries the ghost of punch-cut metal. Across centuries of technical innovation, the human eye has not fundamentally altered its optical habits. We crave clarity, rhythm, and proportional cadence.

### Preserving Typographic Hierarchy

To construct an enduring journal online requires refusing the temptations of contemporary web design:

- Reject reactive layout shifts during reading.
- Treat hairline rules as architectural lintels.
- Restrict colour palettes to paper, ink, and a single editorial accent.

Only through such austere discipline can digital publishing recover the dignity of the printed sheet.`,
    coverUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
    categories: ["Essays"],
    tags: ["typography", "architecture", "print", "minimalism"],
    status: "published",
    featured: true,
    publishedAt: "2026-10-24T10:00:00.000Z",
    views: 14820,
    likes: ["usr_reader", "usr_admin"]
  },

  // --- 2. SECURITY TEST POST (XSS VECTORS) ---
  {
    id: "post_security_xss",
    authorId: "usr_admin",
    title: "Security Verification and Sanitization Protocol",
    slug: "xss-security-verification-test",
    excerpt: "Automated vulnerability benchmark to prove raw HTML injection vectors and malicious scripts never execute.",
    content: `This document contains standard Cross-Site Scripting (XSS) payloads designed to audit frontend Markdown parsing and sanitization.

The payloads below must render strictly as inert text, neutralized elements, or be stripped cleanly. None must execute alert dialogs.

## Raw Script Tag Vector
<script>alert(1)</script>

## Image Onerror Vector
<img src=x onerror=alert(1)>

## Malicious Link Protocol Vector
[click me](javascript:alert(1))

## Raw Iframe Vector
<iframe src="javascript:alert(1)"></iframe>

## SVG Onload Vector
<svg onload=alert(1)>

If this post renders without throwing JavaScript dialogs or errors, the sanitization barrier is confirmed secure.`,
    coverUrl: null,
    categories: ["Technology"],
    tags: ["security", "audit", "xss"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-24T09:00:00.000Z",
    views: 104,
    likes: []
  },

  // --- 3. VERY SHORT POST (UNDER 100 WORDS, MINIMUM 1 MIN READ) ---
  {
    id: "post_short",
    authorId: "usr_writer",
    title: "Brief Note on the Colophon",
    slug: "brief-note-on-the-colophon",
    excerpt: "A forty-word observation on why books conclude by declaring their materials.",
    content: `A book is never just text. It is paper, ink, thread, and glue. When a printer signs the colophon, they affirm that someone made this with their hands. Without that acknowledgment, literature becomes anonymous code.`,
    coverUrl: null,
    categories: ["Design"],
    tags: ["colophon", "craft"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-23T18:00:00.000Z",
    views: 890,
    likes: ["usr_reader"]
  },

  // --- 4. POST WITH NO HEADINGS (TOC HIDDEN/OMITTED STATE) ---
  {
    id: "post_no_headings",
    authorId: "usr_author",
    title: "Meditations on the Horizon",
    slug: "meditations-on-the-horizon",
    excerpt: "A single continuous narrative written without subheadings or structural interruptions.",
    content: `At dusk over the North Sea, the boundary between water and atmosphere dissolves into a uniform wash of silver and slate. You cannot point to the exact millimeter where liquid gives way to vapor.

In writing, as in landscape, there are essays that demand seamless continuity. When an author inserts a subheading, they grant the reader permission to pause and check their watch. But true contemplation requires sustained submersion.

To read without headings is to accept the author's rhythm entirely on their own terms. It asks you to trust that the sentence unfolding before you will carry you across the expanse to solid ground.`,
    coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture"],
    tags: ["solitude", "meditation", "writing"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-23T16:00:00.000Z",
    views: 3120,
    likes: ["usr_admin"]
  },

  // --- 5. DRAFT POST (UNPUBLISHED, ACCESS GATED) ---
  {
    id: "post_draft_example",
    authorId: "usr_author",
    title: "Draft Folio: The Future of Metal Type",
    slug: "draft-future-of-metal-type",
    excerpt: "Unpublished galley proof investigating modern letterpress artisans in Zurich.",
    content: `This draft is currently restricted to editorial staff. Public readers must receive a 404 response.

## Early Observations

Visiting the workshop in Zurich revealed sixteen operational Linotype machines producing matrices for private presses.`,
    coverUrl: null,
    categories: ["Design"],
    tags: ["draft", "letterpress"],
    status: "draft",
    featured: false,
    publishedAt: null,
    views: 0,
    likes: []
  },

  // --- 6. SCHEDULED POST (UNPUBLISHED, ACCESS GATED) ---
  {
    id: "post_scheduled_example",
    authorId: "usr_admin",
    title: "Scheduled Dispatch: On the Ethics of Digital Scarcity",
    slug: "scheduled-ethics-of-digital-scarcity",
    excerpt: "Scheduled for release next month.",
    content: `This post is scheduled and should not be viewable by guest readers until its publication date arrives.`,
    coverUrl: null,
    categories: ["Technology"],
    tags: ["ethics", "future"],
    status: "scheduled",
    featured: false,
    publishedAt: "2026-11-15T09:00:00.000Z",
    views: 0,
    likes: []
  },

  // --- 7. RICH POST: SOLITUDE IN CRITICISM ---
  {
    id: "post_2",
    authorId: "usr_admin",
    title: "On the Necessity of Solitude in Modern Criticism",
    slug: "necessity-of-solitude-in-criticism",
    excerpt: "Dispatches from the margins of discourse: why immediate reaction is the natural enemy of enduring evaluation.",
    content: `Instant commentary has become our default cognitive reflex. Before a novel has settled on the nightstand or an exhibition has completed its opening fortnight, the algorithmic agora demands verdict.

Yet the work of true criticism has always required latency. It demands that an idea be allowed to cool, to oxidize against the atmosphere of contemplation. Without solitude, criticism degenerates into mere polling.

> "To critique is not to grade; it is to illuminate the subterranean currents of human consciousness."

## Against the Velocity of the Feed

Consider the pace of Sainte-Beuve or Virginia Woolf. Their essays were constructed over weeks of patient rumination.

When we decelerate our response, we discover dimensions invisible in the initial glare of spectacle:

- The tonal inconsistencies that signal unresolved doubts.
- The historical echoes that shallow reviewers mistake for innovation.
- The emotional resonance that only emerges after second reading.

## The Architecture of Quiet Review

To create work that outlasts the week, a critic must cultivate an intentional disconnection from the news cycle.

### Establishing the Interval

We recommend an enforced ten-day pause between encountering a work and committing words to the page. In that silence, ephemera evaporates and only structural truth remains.`,
    coverUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80",
    categories: ["Criticism"],
    tags: ["solitude", "criticism", "literature", "philosophy"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-23T14:30:00.000Z",
    views: 8940,
    likes: ["usr_author"]
  },

  // --- 8. RICH POST: AUTOMATED LITERARY SUMMARIZATION ---
  {
    id: "post_3",
    authorId: "usr_writer",
    title: "An Exhaustive Investigation into the Epistemological Consequences of Automated Literary Summarization and the Gradual Dissolution of Deep Reading Across Academic Disciplines",
    slug: "exhaustive-investigation-automated-literary-summarization",
    excerpt: "When algorithms condense nuanced philosophical treatises into five bulleted talking points, we lose the architectural cadence of argumentation itself.",
    content: `Synthesizing a complex text is not an arithmetic operation. When readers encounter a difficult text, comprehension occurs precisely in the moments of resistance—the paragraphs that demand re-reading, the unfamiliar syntax that disrupts complacent cognition.

By substituting algorithmic abstracts for whole texts, contemporary institutions inadvertently train minds to value conclusions severed from reasoning. The journey through a five-hundred-page argument is where cognitive transformation happens; the destination without the route is merely inert trivia.

> "A conclusion understood without the argument that forged it is like a roof suspended in air without walls."

## The Mechanization of Syntax

When automated tools condense prose, they systematically prune:

1. **Subordinate Clauses:** Where qualification, doubt, and philosophical nuance live.
2. **Metaphorical Bridges:** Which allow abstract logic to anchor in sensory reality.
3. **Pacing and Cadence:** Which dictate how ideas are absorbed over biological time.

### The Cognitive Toll

When students read exclusively summaries, their tolerance for textual friction collapses.

\`\`\`python
def evaluate_comprehension(text_length, summary_ratio):
    # Compression removes essential argumentative friction
    retention_depth = (1.0 - summary_ratio) * 0.85
    return max(0.1, retention_depth)
\`\`\`

We must defend the long paragraph as a sanctuary of complex thought.`,
    coverUrl: null,
    categories: ["Essays"],
    tags: ["algorithms", "pedagogy", "philosophy", "deep-reading"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-22T08:15:00.000Z",
    views: 12450,
    likes: ["usr_admin", "usr_reader", "usr_author"]
  },

  // --- 9. RICH POST: GHOST IN THE GRID ---
  {
    id: "post_4",
    authorId: "usr_author",
    title: "The Ghost in the Grid: Algorithmic Geometry and Human Frailty",
    slug: "the-ghost-in-the-grid",
    excerpt: "How modernist modular grids anticipated algorithmic layout, and where human intuition must intervene.",
    content: `Josef Müller-Brockmann codified the modular grid not to constrain the designer, but to liberate the reader from arbitrary chaos.

Yet when algorithms inherit the grid, they frequently mistake mechanical regularity for harmony. The human typographer knows precisely when to fracture the column to create optical rhythm.

## The Swiss Canon and its Descendants

The Swiss grid was an intellectual project rooted in post-war reconstruction. It assumed that rational order could heal social alienation.

> "Order is not the absence of life; it is the stage upon which life becomes legible."

### Counterpoint in Typesetting

Every balanced layout requires deliberate tension:

- An asymmetrical drop cap initiating the measure.
- An illustration breaching the hairline border.
- A pull quote breaking into the left margin.

Without these deliberate imperfections, modular design degenerates into sterile bureaucracy.`,
    coverUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80",
    categories: ["Design"],
    tags: ["typography", "grid", "bauhaus", "design-theory"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-21T09:15:00.000Z",
    views: 6310,
    likes: ["usr_reader"]
  },

  // --- 10. RICH POST: QUIET SOFTWARE ---
  {
    id: "post_5",
    authorId: "usr_admin",
    title: "A Manifesto for Quiet Software",
    slug: "a-manifesto-for-quiet-software",
    excerpt: "Tools designed to be used, set down, and forgotten—not to colonize the waking hours of their users.",
    content: `We have engineered an ecosystem of relentless notification. Every software utility aspires to become an all-consuming destination, demanding attention through artificial streaks and synthetic urgency.

Quiet software makes no claim upon your soul; it executes its duty and disappears.

## The Tenets of Quiet Tools

1. **No Unsolicited Pings:** A tool should speak only when spoken to.
2. **Finite Interfaces:** Every view should have a natural bottom, like a printed book.
3. **Respect for State:** Your work should remain exactly as you left it without forced updates or shifting buttons.

> "The highest tribute you can pay to a tool is that you forgot you were using it."

### Building for Human Dignity

When we design software that refuses to harvest attention, we give human beings back the quiet necessary for creative labor.`,
    coverUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    categories: ["Technology"],
    tags: ["software", "minimalism", "ethics", "attention"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-20T16:00:00.000Z",
    views: 11250,
    likes: ["usr_author", "usr_reader"]
  },

  // Additional posts to complete the 26-story pool
  {
    id: "post_6",
    authorId: "usr_writer",
    title: "Typesetting the Avant-Garde: 1910–1935",
    slug: "typesetting-the-avant-garde",
    excerpt: "From Marinetti's metal letters to El Lissitzky's typographical constructions: an archival inspection.",
    content: `Between the publication of the Futurist Manifesto and the rise of the New Typography in Germany, the printed word underwent its most violent rupture since Gutenberg. Letterpress forms were broken and reformed into dynamic spatial sculptures celebrating industrial velocity.`,
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture"],
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
    content: `Color in modern interface design has been systematically weaponized. Notification badges pulse with crimson urgency; marketing banners exploit high-chroma gradients to seize involuntary optical fixation. To choose monochrome is to reject this coercive transaction and invite honest looking.`,
    coverUrl: null,
    categories: ["Design"],
    tags: ["typography", "monochrome", "aesthetics", "print", "design-theory"],
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
    content: `When a periodical publishes four times a year, its contributors are relieved of the panic of the breaking cycle. They can afford to observe an entire season before casting a sentence. Daily commentary reacts to ripples on the surface; quarterly prose examines the subterranean geology.`,
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    categories: ["Essays"],
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
    content: `Milan in the 1930s was an open-air laboratory for structural honesty. The same architects who poured reinforced concrete for suburban transit terminals spent their evenings designing title faces for architectural bulletins. Typography was treated as small-scale architecture.`,
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    categories: ["Design"],
    tags: ["typography", "architecture", "italy", "history"],
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
    content: `The boundary of a sheet of paper is its greatest asset. Knowing that space terminates at the margin forces an economy of expression. You cannot wander forever across eight thousand pixels of canvas. Restraint is the catalyst of form.`,
    coverUrl: null,
    categories: ["Essays"],
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
    categories: ["Criticism"],
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
    content: `Western bookbinding historically took pride in concealing its spine beneath layers of marbled calfskin. Japanese traditions, by contrast, celebrate the exposed linen cord, turning structural necessity into visual rhyme. The binding is not a secret mechanism but a visible promise of craftsmanship.`,
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture"],
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
    content: `To drive upon the M1 motorway in 1959 was to experience typography at seventy miles per hour. The bespoke alphabet developed by Kinneir and Calvert had to be legible in driving rain through a mud-spattered windshield. It succeeded through radical optical proportion.`,
    coverUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    categories: ["Design"],
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
    content: `The nineteenth-century salon was not simply an aristocratic indulgence; it was a calibrated friction chamber. People who disagreed vehemently were obliged to look one another in the eye over tea. In that physical presence lay the seed of genuine civility.`,
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture"],
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
    content: `Browsing the Gemini protocol feels like stepping into a library reading room after twenty minutes on a noisy subway platform. No scripts execute; no trackers follow; typography is left entirely to the reader's client. It is a vital reminder of what digital communication could have remained.`,
    coverUrl: null,
    categories: ["Technology"],
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
    content: `At the rear of every serious volume, the colophon once served as an audited certificate of craft. It told you whose hands had fed the lead into the crucible and where the rags for the pulp had been sourced. To restore the colophon is to honor the labor of making.`,
    coverUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
    categories: ["Design"],
    tags: ["typography", "colophon", "publishing", "books", "craft"],
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
    content: `To open a fifteenth-century incunabula and find notes inked in iron gall by three successive generations of scholars is to realize that a book is never a solitary artifact. The margin is an intellectual promenade where reader meets author across the abyss of time.`,
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    categories: ["Essays"],
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
    content: `A website is not a document; it is a live performance executed by hundreds of remote dependencies. When a single certificate expires or an API domain changes hands, the page vanishes into a blank error code. Paper needs only dry air and darkness to outlast civilizations.`,
    coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80",
    categories: ["Technology"],
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
    content: `You cannot operate a letterpress in a shared co-working incubator. A Heidelberg platen weighs two tons; it vibrates the joists; it smells of mineral spirits and raw oil. When landlords replaced printshops with wellness bars, printing culture was pushed to the suburban margins.`,
    coverUrl: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture"],
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
    content: `The footnote is an architect's basement: the place where the plumbing of scholarship is exposed, where digressions too eccentric for the parlor are permitted to breathe. It shatters the false monism of the central thesis, granting the text multiple simultaneous voices.`,
    coverUrl: null,
    categories: ["Criticism"],
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
    content: `From Burberry to Balenciaga, the distinctive bespoke lettering that defined twentieth-century prestige was systematically dismantled in favor of uninflected grotesque letterforms optimized for smartphone thumbnails. When differentiation is penalised by platform algorithms, corporate identity surrenders to beige uniformity.`,
    coverUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    categories: ["Criticism"],
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
    content: `In the silence of the Bodleian, time ceases to be linear. You hold a charter signed by a Norman bailiff with dirt beneath his fingernails, and the centuries collapse into a single heartbeat. In an era obsessed with real-time immediacy, the archive is our anchor to human continuity.`,
    coverUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    categories: ["Culture"],
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
    content: `Frictionless experiences are suitable for purchasing plane tickets; they are catastrophic for moral thought. Ethical decision-making requires pause, second-guessing, and uncomfortable ambivalence. When software removes all doubt, it removes our moral agency with it.`,
    coverUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    categories: ["Technology"],
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
    content: `Keyword search delivers matching fragments while concealing the forest. A master indexer does not merely match strings; they construct an intellectual topology that shows how concepts intersect across a text. Without the index, research becomes an algorithmic lottery rather than an architectural survey.`,
    coverUrl: null,
    categories: ["Essays"],
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
    content: `A finished book has its hair combed and its tie straightened. A galley proof, with its marginal strikes and hasty handwritten interpolations, still has blood coursing through its veins. In digital text, version control replaces the strike-through, burying the history of doubt.`,
    coverUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    categories: ["Technology"],
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
    content: `Post-war Milan was rebuilding itself physically and intellectually simultaneously. Every issue of Casabella was an act of civic reconstruction. In their pages, typography, social housing, and industrial design met on equal footing.`,
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    categories: ["Criticism"],
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
