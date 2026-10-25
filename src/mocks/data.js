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

When we consider the layout of a seventeenth-century quarto or the austere geometry of the Bauhaus masters, what strikes us is not their technical limitations, but their restraint. White space was not merely empty real estate awaiting an advertisement; it was a deliberate pause—a breath drawn before the next movement in a symphony. The modern web designer, trained on infinite vertical scroll and reactive DOM mutations, often views stillness as an engineering defect rather than an aesthetic victory.

> "A great magazine does not shout across the room; it speaks with measured authority in a tone designed to outlast the season."

## The Geometry of Measured Lines

A column of text is an engine for thought. Set it too wide, and the human eye tires before discovering the turn of the phrase; set it too narrow, and rhythm collapses into frantic vertical agitation. The traditional typographic canon dictates between sixty and seventy-five characters per line—the exact optical breadth where binocular saccadic jumps remain effortless across prolonged reading sessions.

When lines exceed this measure, the ocular muscles must work twice as hard to reacquire the start of the next line, inducing reading fatigue and perceptual drift. Conversely, excessively narrow measures produce uneven hyphenation gutters and destroy the uniform gray texture of the typographic block.

Here is the computational formula balancing optical comfort against viewport width in modern responsive layouts:

\`\`\`javascript
// Proportional line measure computation adhering to Tschichold canon
function computeMeasure(fontSize, ratio = 1.618) {
  const baseCharacters = 68;
  const opticalWidth = baseCharacters * (fontSize / 16);
  const baselineShift = Math.round(fontSize * 0.25);
  return {
    maxWidth: \`\${opticalWidth}ch\`,
    lineHeight: 1.7,
    marginVertical: \`\${baselineShift}px\`
  };
}
\`\`\`

When typographic rules are treated as structural load-bearing elements rather than decorative flourishes, the reading interface achieves a state of quiet equilibrium. Every hairline border functions as a lintel; every paragraph indent acts as a threshold.

### The Function of White Space

Negative space in book design serves three structural functions:

1. **Acoustic Insulation:** It isolates sentences from competing visual noise on the peripheral retina, creating a quiet perimeter around the argument.
2. **Temporal Cadence:** Generous margins signal that the argument is designed to be contemplated rather than skimmed at executive velocity.
3. **Physical Orientation:** It provides space for thumbs, bookmarks, and reader marginalia without obscuring the editorial body.

![The tactile geometry of moveable metal type in an artisan workshop](https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80)

## The Permanence of Thought

In an era of fleeting ephemera, typography remains an act of preservation. Every glyph cast upon the screen carries the ghost of punch-cut metal. Across centuries of technical innovation, the human eye has not fundamentally altered its optical habits. We crave clarity, rhythm, and proportional cadence.

The digital realm promised frictionless transmission of knowledge, yet delivered an architecture of constant interruption. Notifications punctuate our contemplation; dynamic banners jostle our concentration; shifting containers push paragraphs out from under our fingertips. The paper sheet, in contrast, offers an inviolable shelter. Once bound, its pages do not alter their composition; they remain faithful stewards of the author's original rhythm.

### Preserving Typographic Hierarchy

To construct an enduring journal online requires refusing the temptations of contemporary web design:

- Reject reactive layout shifts during reading: images must possess explicit aspect ratios so text blocks never jump during resource acquisition.
- Treat hairline rules as architectural lintels: hairlines must demarcate boundaries with single-pixel geometric precision.
- Restrict colour palettes to paper, ink, and a single editorial accent: colour must convey hierarchy and emphasis, never decorative vanity.
- Establish an immutable vertical baseline grid where every line of prose, heading, and pull quote aligns to a harmonic interval.
- Choose typefaces with demonstrable literary pedigree, pairing an authoritative transitional serif for body with an unadorned grotesque for structural meta labels.

## Materiality and the Screen

We must cease pretending that the browser is an infinite canvas free from physical constraint. While bits lack mass, the human mind processing them is constrained by biological limits. Optical endurance, working memory, and cognitive span are physical realities as unforgiving as cold iron. 

When we honor these boundaries by designing digital texts with the discipline of print, we do not merely imitate obsolete paper artifacts. We build spaces of quietude and concentration in an otherwise clamorous world. Literature demands room to breathe; it asks for silence, for margins that do not shrink, and for type that knows how to stand still.

Digital publishing must rediscover the dignity of the finite page. When an article possesses a clear visual end, the reader experiences the satisfaction of a journey concluded rather than an algorithmic trap without exit. Only through such austere discipline can digital publishing recover the dignity of the printed sheet.`,
    coverUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
    categories: ["Essays"],
    tags: ["typography", "architecture", "print", "minimalism"],
    status: "published",
    featured: true,
    publishedAt: "2026-10-24T10:00:00.000Z",
    views: 14820,
    likes: ["usr_admin"]
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
    content: `To evaluate a work of art within the immediate slipstream of its release is rarely criticism; more often, it is an exercise in social signaling. The contemporary review cycle demands instant hot takes delivered within hours of a novel's publication or an exhibition's opening. In this breathless rush to establish early consensus, critical distance is sacrificed for algorithmically rewarded speed.

True criticism requires gestation. It demands that the critic live with the text through changing seasons, allowing the initial dazzle of novelty to subside until only the enduring architecture of the work remains visible. Without solitude and temporal withdrawal, the critic merely amplifies the ambient prejudices of their social circle.

> "A critic who never sits alone in quiet opposition to the prevailing opinion of the day is not a critic at all, but a publicity agent with an academic pedigree."

## The Speed of the Reaction Economy

The modern digital public square operates on instant engagement. An essay published on Tuesday must be parsed, dissected, and defended by Wednesday morning. This manic velocity truncates the reflective pause necessary for genuine aesthetic judgment.

When we examine the great literary essays of Sainte-Beuve, Virginia Woolf, or Walter Benjamin, we observe a deliberate refusal to match the tempo of the daily press:

1. **The Principle of Delayed Response:** Woolf frequently waited months before addressing a significant novel, allowing the author's public persona to fade from the cultural conversation.
2. **The Defense of Private Idiosyncrasy:** Solitude protects the critic from the subtle peer pressures of institutional consensus.
3. **The Historical Horizon:** Reading contemporary fiction against texts written four centuries prior provides a stabilizing ballast against transient fads.
4. **Textual Scrutiny over Personality:** Focusing exclusively on syntax, structure, and moral resonance rather than social media presence.

Here is an analytical heuristic for measuring critical latency versus durable insight:

\`\`\`python
# Critical Latency and Hermeneutic Resonance Model
def evaluate_critical_depth(word_count, days_elapsed, references_count):
    """
    Computes a depth index where longer gestation periods
    and deeper historical grounding produce enduring critical authority.
    """
    temporal_factor = min(3.0, (days_elapsed / 30.0) ** 0.5)
    historical_grounding = max(1.0, references_count * 0.4)
    depth_index = (word_count / 500.0) * temporal_factor * historical_grounding
    return round(depth_index, 2)
\`\`\`

### The Architecture of the Study

The physical setting in which reading occurs is not incidental to the critical enterprise. A critic surrounded by open browser tabs, chat notifications, and algorithmic feeds is effectively reading in the middle of a noisy bazaar. The critical faculty requires sensory deceleration.

![Old library interior with wooden shelves, bound monographs, and tall arched windows](https://images.unsplash.com/photo-1507842229458-76c2d1b06c8b?auto=format&fit=crop&w=1200&q=80)

## Resisting the Algorithm

Algorithmic recommendation engines operate on homophily: they feed the reader what they have previously enjoyed, narrowing the perceptual aperture until surprise is eliminated. The duty of the critic in such an environment is to introduce productive friction.

To cultivate genuine critical independence, one must deliberately court intellectual estrangement:

- Spend at least one day each week reading texts published before the invention of the steam engine.
- Refuse to participate in manufactured literary controversies that will be entirely forgotten thirty days hence.
- Write drafts longhand in ink before transcribing them into digital typography, forcing the hand to pace the intellect.
- Seek out translated monographs from traditions outside the Anglo-American publishing axis.

### Towards a Slower Hermeneutic

If literary criticism is to survive the collapse of print journalism, it cannot do so by competing with social networks on speed. Its only competitive advantage is depth, rigor, and the incorruptible honesty of a solitary human mind meditating upon a page.

Solitude is not loneliness; it is the laboratory of thought. In the quiet of the study, free from the chatter of the market, the critic encounters literature not as disposable content, but as an enduring dialogue across the centuries. We must reclaim the courage to write slowly, to withhold judgment until thought has crystallized, and to offer the reader a verdict that will stand decades hence.

## The Epistemology of the Physical Page

The relationship between visual spatiality and memory retention has been documented across cognitive psychology. When reading on dynamic infinite canvases, spatial memory is denied an anchor; sentences swim in an indeterminate digital ether. On the physical page, conversely, an idea is remembered as having resided in the upper-left quadrant of a verso sheet, three-quarters through the monograph.

To emulate this cognitive stability in our software architecture, we must introduce persistent spatial landmarks:

1. **Fixed Structural Markers:** Providing unambiguous section indicators that remain stationary throughout the reading journey.
2. **Stable Pagination Coordinates:** Reserving fixed vertical dimensions for headers and footers to eliminate cumulative layout shifts.
3. **Intentional Pacing:** Designing deliberate pauses where chapters or thematic sections terminate with visual finality.

\`\`\`javascript
// Cognitive spatial anchor coordinate tracker
export function recordReadingAnchor(chapterId, scrollOffset) {
  const anchor = {
    chapter: chapterId,
    percentage: Math.round(scrollOffset * 100),
    timestamp: Date.now()
  };
  return anchor;
}
\`\`\`

When interface designers respect the human need for spatial orientation, digital reading ceases to feel like an anxious swim through an unbounded stream. It transforms once again into an intentional act of architecture.`,
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
    content: `When Josef Müller-Brockmann published his seminal manual on grid systems in 1961, he envisioned a design language founded on mathematical rigor, structural honesty, and objective clarity. The Swiss grid was not conceived as a straightjacket to stifle creativity, but as a liberating framework that subordinated subjective whim to rational communication.

Six decades later, the arrival of modern CSS Grid and subgrid specifications has finally brought the computational power of the web into alignment with Müller-Brockmann's vision. Yet despite having unprecedented layout control at our disposal, much of modern web design remains trapped in arbitrary flexbox hacks and visual noise.

> "The grid system is an aid, not a guarantee. It permits a number of possible uses and each designer can look for a solution appropriate to his personal style."

## The Modernist Promise of the Baseline

The soul of Swiss typography is the baseline grid. In printed monographs, every line of text, whether in body type, subheadings, or captions, snaps to a rigid vertical rhythm. When two columns sit side by side, their baselines align with razor precision.

In CSS, achieving this harmony historically required painstaking manual calculation, because relative line heights and box-sizing discrepancies frequently caused vertical drift across responsive viewports.

Here is a modern CSS grid configuration establishing an invariant 8px baseline rhythm across complex multi-column editorial layouts:

\`\`\`css
/* Swiss Editorial Baseline Grid System */
:root {
  --baseline: 8px;
  --line-height-body: calc(var(--baseline) * 3); /* 24px */
  --line-height-heading: calc(var(--baseline) * 5); /* 40px */
}

.editorial-layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: calc(var(--baseline) * 3);
  max-width: 1280px;
  margin: 0 auto;
}

.editorial-body {
  grid-column: 4 / span 6;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 1.125rem;
  line-height: var(--line-height-body);
}
\`\`\`

### From Tschichold to CSS Grid

Jan Tschichold's golden canon demonstrated how page proportions, margin widths, and textual columns could be derived from geometric divisions of the diagonal. In responsive web design, we must translate these static ratios into fluid boundaries:

1. **Proportional Column Widths:** Establishing column measures that expand gracefully without exceeding optical limits.
2. **Invariant Baseline Alignment:** Guaranteeing that adjacent cards and sidebars maintain horizontal baseline alignment across viewports.
3. **Harmonic Margin Relationships:** Deriving margins from the golden section (1:1.618) to provide natural visual balance.
4. **Structural Modular Units:** Dividing the canvas into repeatable fields that anchor figures and captions with mathematical certainty.

![Swiss typographic poster showing structured geometric grid divisions](https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80)

## Mathematical Harmony in Responsive Layouts

The primary challenge in translating Swiss typography to the browser is responsive fluidity. A printed page has fixed dimensions; a browser viewport can take any arbitrary width and height.

To maintain typographic discipline across this spectrum, we must combine fluid scaling with rigid structural invariants:

- Use CSS clamp functions to scale typography continuously between minimum and maximum optical thresholds.
- Lock column gutters to discrete modular intervals rather than arbitrary percentages.
- Constrain maximum line measures using the \`ch\` unit to prevent line lengths from exceeding seventy-five characters on ultra-wide displays.
- Align image crops strictly to vertical baseline units to prevent layout reflows when figures load asynchronously.

### Breaking the Cadence

The purpose of mastering the grid is not to produce monotonous uniformity, but to make deliberate departures meaningful. When an image breaks out of the six-column reading measure to span the full twelve columns of the broadsheet, the expansion registers as an intentional architectural gesture.

Without the discipline of the underlying grid, such visual gestures lose their impact. Structure gives meaning to freedom. By reviving the rigor of the Swiss modernists in modern digital stylesheets, we can construct websites that possess the timeless balance of mid-century print. The grid remains our most reliable instrument for imposing human order onto computational chaos.

## The Epistemology of the Physical Page

The relationship between visual spatiality and memory retention has been documented across cognitive psychology. When reading on dynamic infinite canvases, spatial memory is denied an anchor; sentences swim in an indeterminate digital ether. On the physical page, conversely, an idea is remembered as having resided in the upper-left quadrant of a verso sheet, three-quarters through the monograph.

To emulate this cognitive stability in our software architecture, we must introduce persistent spatial landmarks:

1. **Fixed Structural Markers:** Providing unambiguous section indicators that remain stationary throughout the reading journey.
2. **Stable Pagination Coordinates:** Reserving fixed vertical dimensions for headers and footers to eliminate cumulative layout shifts.
3. **Intentional Pacing:** Designing deliberate pauses where chapters or thematic sections terminate with visual finality.

\`\`\`javascript
// Cognitive spatial anchor coordinate tracker
export function recordReadingAnchor(chapterId, scrollOffset) {
  const anchor = {
    chapter: chapterId,
    percentage: Math.round(scrollOffset * 100),
    timestamp: Date.now()
  };
  return anchor;
}
\`\`\`

When interface designers respect the human need for spatial orientation, digital reading ceases to feel like an anxious swim through an unbounded stream. It transforms once again into an intentional act of architecture.`,
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
    content: `Our digital tools were once promised as bicycles for the mind. Today, they resemble slot machines designed to colonize the waking hours of their users. Every application competes in an extractive auction for human consciousness, employing behavioral psychologists to calibrate notification loops, engagement streaks, and synthetic urgency.

The consequence is a pervasive cognitive fragmentation. Deep work requires sustained uninterrupted contemplation, yet the contemporary operating system is an environment of institutionalized distraction. We must articulate an alternative design philosophy: quiet software.

> "Quiet software is designed to be picked up, used to accomplish a human task with precision, and then put down and completely forgotten."

## The Tyranny of the Notification Loop

The modern notification system is rooted in the B.F. Skinner box of variable intermittent reinforcement. When an icon turns red or a badge increments, our primitive neurochemistry anticipates social recognition or immediate threat. We are compelled to check, diverting cognitive energy from substantive contemplation toward administrative triage.

Consider the baseline requirements of a quiet application:

1. **Zero Red Badges:** No persistent counters demanding acknowledgment or synthetic daily activity streaks.
2. **Asynchronous by Default:** Messages are deposited into a daily dispatch folio rather than pushed in real-time interruptions.
3. **Definite Boundaries:** Workflows terminate clearly. The software does not present infinite algorithmically curated feeds once the core action is complete.
4. **Local Sovereignty:** Data belongs entirely to the author and operates without constant telemetry reporting to an upstream advertising conglomerate.
5. **No Engagement Maximization:** Metrics prioritize swift completion rather than session duration.

Here is an architectural pattern for an asynchronous dispatch scheduler that queues updates into quiet daily editions:

\`\`\`javascript
// Asynchronous Quiet Edition Dispatcher
class QuietEditionManager {
  constructor(deliveryHour = 7) {
    this.deliveryHour = deliveryHour;
    this.inboxQueue = [];
  }

  enqueue(item) {
    this.inboxQueue.push({
      item,
      receivedAt: new Date().toISOString()
    });
  }

  compileDailyEdition() {
    const edition = [...this.inboxQueue];
    this.inboxQueue = [];
    return {
      date: new Date().toISOString().split('T')[0],
      dispatches: edition,
      totalCount: edition.length
    };
  }
}
\`\`\`

### Principles of Ambient Computing

Ambient tools reside in the background until consciously summoned. Unlike modern collaboration platforms that masquerade as virtual offices with fluorescent panic, quiet software honors the user's sovereign time.

![Vintage wooden drafting table with architectural tools and natural light](https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80)

## Designing for the Offline Mind

The assumption of constant ubiquitous network access has weakened both software engineering and human focus. Applications that crash or degrade into blank skeletons when network packets falter betray an architectural fragility.

A quiet tool embraces local-first architecture:

- All core writing, reading, and editing operations must execute against local durable storage without waiting on server roundtrips.
- Synchronization must happen quietly in the background without modal blocking spinners or frantic status indicators.
- File formats must be open, human-readable plain text or standard SQLite stores rather than proprietary encrypted silos.
- The interface must never flicker, shift, or animate gratuitously while human thought unfolds.

### The Tenets of Quiet Architecture

When software respects human dignity, its metrics shift from daily active minutes to task completion efficiency. Success is measured not by how long a reader stares at a glowing pane, but by how quietly and swiftly the tool enabled them to comprehend an essay or write a letter.

We reject the vanity of software as entertainment. Software is a craft of structural utility. Like a fine fountain pen or a well-joined oak desk, its greatest virtue lies in its capacity to disappear while human thought unfolds. Let us build tools that treat our attention as sacred ground rather than raw material for extraction.

When an engineer constructs a bridge, their primary metric is structural stability and the safety of travelers crossing the span. No engineer boasts of how many hours motorists were forced to spend waiting on the asphalt. Software engineering must rediscover this quiet ethos of civic responsibility. We must measure the nobility of our code by how quickly and unobtrusively it returns the user to the physical world, enriched and unexhausted.

## The Epistemology of the Physical Page

The relationship between visual spatiality and memory retention has been documented across cognitive psychology. When reading on dynamic infinite canvases, spatial memory is denied an anchor; sentences swim in an indeterminate digital ether. On the physical page, conversely, an idea is remembered as having resided in the upper-left quadrant of a verso sheet, three-quarters through the monograph.

To emulate this cognitive stability in our software architecture, we must introduce persistent spatial landmarks:

1. **Fixed Structural Markers:** Providing unambiguous section indicators that remain stationary throughout the reading journey.
2. **Stable Pagination Coordinates:** Reserving fixed vertical dimensions for headers and footers to eliminate cumulative layout shifts.
3. **Intentional Pacing:** Designing deliberate pauses where chapters or thematic sections terminate with visual finality.

\`\`\`javascript
// Cognitive spatial anchor coordinate tracker
export function recordReadingAnchor(chapterId, scrollOffset) {
  const anchor = {
    chapter: chapterId,
    percentage: Math.round(scrollOffset * 100),
    timestamp: Date.now()
  };
  return anchor;
}
\`\`\`

When interface designers respect the human need for spatial orientation, digital reading ceases to feel like an anxious swim through an unbounded stream. It transforms once again into an intentional act of architecture.`,
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
    content: `Before the World Wide Web mutated into an encrypted surveillance and video streaming network, the early internet was an ecosystem of sovereign text-based protocols. The Gopher protocol, developed at the University of Minnesota in 1991, presented information not as hyperlinked visual billboards, but as a hierarchical tree of plain text documents and menus.

Today, an underground renaissance of alternative protocols—most notably Project Gemini—is challenging the hegemony of the modern web stack. By deliberately excluding JavaScript, inline stylesheets, and tracker beacons, these protocols offer a glimpse of what digital publishing could look like if reading was once again treated as a primary human activity.

> "When you strip away stylesheets, scripts, tracking pixels, and video autoplay, what remains is the naked purity of human language."

## The Lost Elegance of Gopherspace

Gopher was built upon a protocol so simple that an entire client could be implemented in a single afternoon of C programming. A client connected to a TCP port, sent a selector string followed by a carriage return, received the requested text file, and closed the connection.

There were no cookies. There was no client-side DOM parsing. There were no tracking pixels phoning home to advertising brokers. Information was organized with austere catalogical discipline:

1. **Zero Layout Engine Overhead:** Documents rendered instantaneously regardless of processor power or network latency.
2. **Textual Primacy:** Because images could only be opened as external downloads, authors were forced to convey ideas through rigorous prose.
3. **Complete Client Sovereignty:** The reader's software had absolute control over font choice, margins, and foreground colors.
4. **Permanent Navigational Anchor:** Menu hierarchies provided unambiguous spatial orientation within the information architecture.

Here is a minimalist Gemini protocol client implementation demonstrating the elegance of text-first transmission:

\`\`\`python
# Minimalist Gemini Protocol Fetcher
import socket
import ssl

def fetch_gemini_folio(host, path, port=1965):
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE

    with socket.create_connection((host, port)) as sock:
        with context.wrap_socket(sock, server_hostname=host) as ssock:
            request = f"gemini://{host}{path}\r\n"
            ssock.sendall(request.encode('utf-8'))
            response = b""
            while True:
                data = ssock.recv(4096)
                if not data:
                    break
                response += data
    return response.decode('utf-8', errors='replace')
\`\`\`

### The Simplicity of Plaintext Protocols

The modern web browser is among the most complex software artifacts ever constructed, comprising over twenty million lines of code. This colossal complexity is not required to render prose; it is required to execute advertising algorithms, real-time telemetry, and multimedia animations.

![Early computer terminal displaying clean glowing green monospace text](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80)

## Surviving the Hypermedia Deluge

The tragedy of the modern web is not that rich media exists, but that it has colonized every corner of the digital experience until quiet textual spaces have become nearly impossible to sustain.

The lessons that modern web publications should draw from Gopher and Gemini are clear:

- A reading application should never require client-side execution of opaque Turing-complete scripts to render an essay.
- Assets must be static, cacheable, and immutable once published.
- Privacy should be an architectural guarantee of the network layer rather than a complex legal consent banner.
- Documents should load in a single round-trip without dependency waterfalls spanning dozens of third-party domains.

### Minimalist Network Archival

Digital longevity depends on structural simplicity. A plain text file formatted with basic Markdown will remain readable by any computational device built fifty or five hundred years from today. A dynamic single-page application dependent on complex cloud runtime dependencies will break the moment its commercial host ceases operations.

By embracing the textual discipline of these obsolete protocols within our web stylesheets, we preserve the original promise of the internet: a global republic of letters where ideas are shared with clarity, humility, and enduring permanence. Words endure because they require so little to survive; it is only when we encumber them with technical scaffolding that they become fragile.

## The Epistemology of the Physical Page

The relationship between visual spatiality and memory retention has been documented across cognitive psychology. When reading on dynamic infinite canvases, spatial memory is denied an anchor; sentences swim in an indeterminate digital ether. On the physical page, conversely, an idea is remembered as having resided in the upper-left quadrant of a verso sheet, three-quarters through the monograph.

To emulate this cognitive stability in our software architecture, we must introduce persistent spatial landmarks:

1. **Fixed Structural Markers:** Providing unambiguous section indicators that remain stationary throughout the reading journey.
2. **Stable Pagination Coordinates:** Reserving fixed vertical dimensions for headers and footers to eliminate cumulative layout shifts.
3. **Intentional Pacing:** Designing deliberate pauses where chapters or thematic sections terminate with visual finality.

\`\`\`javascript
// Cognitive spatial anchor coordinate tracker
export function recordReadingAnchor(chapterId, scrollOffset) {
  const anchor = {
    chapter: chapterId,
    percentage: Math.round(scrollOffset * 100),
    timestamp: Date.now()
  };
  return anchor;
}
\`\`\`

When interface designers respect the human need for spatial orientation, digital reading ceases to feel like an anxious swim through an unbounded stream. It transforms once again into an intentional act of architecture.`,
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
