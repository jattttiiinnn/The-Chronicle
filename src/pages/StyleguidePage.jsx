import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Seo } from '../components/Seo.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Textarea } from '../components/ui/Textarea.jsx';
import { Select } from '../components/ui/Select.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import { Skeleton, SkeletonPostCard } from '../components/ui/Skeleton.jsx';
import { DropCap } from '../components/editorial/DropCap.jsx';
import { PullQuote } from '../components/editorial/PullQuote.jsx';
import { Tag } from '../components/editorial/Tag.jsx';
import { PostCardLead } from '../components/cards/PostCardLead.jsx';
import { PostCardStandard } from '../components/cards/PostCardStandard.jsx';
import { PostCardCompact } from '../components/cards/PostCardCompact.jsx';
import { PostCardHorizontal } from '../components/cards/PostCardHorizontal.jsx';
import { mockPosts } from '../mocks/data.js';
import { IconTrash, IconCheck, IconAlertTriangle } from '../components/ui/Icons.jsx';

export function StyleguidePage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { role, switchMockRole, user } = useAuth();
  const { success, error, info } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  // React Hook Form demo
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      authorName: '',
      folioTitle: '',
      department: 'essays',
      abstract: ''
    }
  });

  const onFormSubmit = (data) => {
    success(`Folio submission validated: "${data.folioTitle}"`);
    reset();
  };

  const leadSample = mockPosts[0];
  const standardSample = mockPosts[1];
  const compactSample = mockPosts[2];
  const horizontalSample = mockPosts[3];

  return (
    <div className="py-8 space-y-16">
      <Seo title="Design System & Styleguide" />

      {/* Header & Interactive Control Bar */}
      <section className="pb-8 border-b border-rule">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-meta text-accent">
              STAGE 01 &bull; VERIFICATION BENCHMARK
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-ink tracking-tight mt-1">
              Design System & Token Catalog
            </h1>
            <p className="font-serif italic text-lg text-ink-soft mt-2 max-w-prose">
              A comprehensive audit of typographic scales, color variables, editorial components, and interactive widgets under the &ldquo;Print Magazine, Digital&rdquo; specification.
            </p>
          </div>

          {/* Quick Simulation Bar (Development Only) */}
          {import.meta.env.DEV && (
            <div className="bg-paper-2 p-4 border border-rule rounded-[2px] flex flex-col gap-3">
              <span className="font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft">
                Simulation Controls (DEV ONLY)
              </span>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="text-ink">Theme:</span>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`px-2 py-1 border rounded-[2px] ${theme === 'light' ? 'bg-ink text-paper border-ink' : 'border-rule text-ink'}`}
                >
                  Paper (Light)
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-2 py-1 border rounded-[2px] ${theme === 'dark' ? 'bg-ink text-paper border-ink' : 'border-rule text-ink'}`}
                >
                  Night Paper (Dark)
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`px-2 py-1 border rounded-[2px] ${theme === 'system' ? 'bg-ink text-paper border-ink' : 'border-rule text-ink'}`}
                >
                  System
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-2 border-t border-rule">
                <span className="text-ink">Role:</span>
                {['guest', 'reader', 'author', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => switchMockRole(r)}
                    className={`px-2 py-0.5 border rounded-[2px] uppercase text-[0.6875rem] ${
                      role === r ? 'bg-accent text-white border-accent' : 'border-rule text-ink hover:border-ink'
                    }`}
                  >
                    {r}
                  </button>
                ))}
                <span className="text-ink-soft text-[0.6875rem] ml-1">
                  (Active: {user?.name || 'Unauthenticated Guest'})
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 1: Color Tokens */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-rule">
          <h2 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold">
            01 / Color Tokens & Palette Calibration (Current Theme: {resolvedTheme})
          </h2>
          <span className="font-mono text-xs text-ink-soft">WCAG AA Compliant</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="p-4 border border-rule bg-paper">
            <div className="h-14 w-full bg-paper border border-rule mb-2" />
            <p className="font-mono text-xs font-semibold text-ink">--paper</p>
            <p className="font-mono text-[0.6875rem] text-ink-soft">Page background</p>
          </div>
          <div className="p-4 border border-rule bg-paper">
            <div className="h-14 w-full bg-paper-2 border border-rule mb-2" />
            <p className="font-mono text-xs font-semibold text-ink">--paper-2</p>
            <p className="font-mono text-[0.6875rem] text-ink-soft">Cards, tables</p>
          </div>
          <div className="p-4 border border-rule bg-paper">
            <div className="h-14 w-full bg-ink mb-2" />
            <p className="font-mono text-xs font-semibold text-ink">--ink</p>
            <p className="font-mono text-[0.6875rem] text-ink-soft">Primary text</p>
          </div>
          <div className="p-4 border border-rule bg-paper">
            <div className="h-14 w-full bg-ink-soft mb-2" />
            <p className="font-mono text-xs font-semibold text-ink">--ink-soft</p>
            <p className="font-mono text-[0.6875rem] text-ink-soft">Secondary text</p>
          </div>
          <div className="p-4 border border-rule bg-paper">
            <div className="h-14 w-full bg-rule mb-2" />
            <p className="font-mono text-xs font-semibold text-ink">--rule</p>
            <p className="font-mono text-[0.6875rem] text-ink-soft">Hairlines</p>
          </div>
          <div className="p-4 border border-rule bg-paper">
            <div className="h-14 w-full bg-accent mb-2" />
            <p className="font-mono text-xs font-semibold text-ink">--accent</p>
            <p className="font-mono text-[0.6875rem] text-ink-soft">Editorial red</p>
          </div>
          <div className="p-4 border border-rule bg-paper">
            <div className="h-14 w-full bg-destructive mb-2" />
            <p className="font-mono text-xs font-semibold text-ink">--destructive</p>
            <p className="font-mono text-[0.6875rem] text-destructive">Errors/Delete only</p>
          </div>
        </div>
      </section>

      {/* Section 2: Typographic Fluid Scale */}
      <section className="space-y-6">
        <div className="pb-2 border-b border-rule">
          <h2 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold">
            02 / Typographic Scale & Fluid Clamp Measures
          </h2>
        </div>

        <div className="space-y-8 divide-y divide-rule">
          <div className="pt-4">
            <span className="font-mono text-[0.6875rem] text-ink-soft block mb-1">
              MASTHEAD &bull; clamp(3.5rem, 12vw, 10rem) &bull; PLAYFAIR 900
            </span>
            <p className="type-masthead text-ink">THE CHRONICLE</p>
          </div>

          <div className="pt-6">
            <span className="font-mono text-[0.6875rem] text-ink-soft block mb-1">
              LEAD HEADLINE &bull; clamp(2.5rem, 6vw, 4.5rem) &bull; PLAYFAIR 900
            </span>
            <p className="type-lead-headline text-ink">
              The Architecture of the Printed Page in the Digital Era
            </p>
          </div>

          <div className="pt-6">
            <span className="font-mono text-[0.6875rem] text-ink-soft block mb-1">
              ARTICLE TITLE &bull; clamp(2.25rem, 5vw, 3.5rem) &bull; PLAYFAIR 700
            </span>
            <p className="type-article-title text-ink">
              On the Necessity of Solitude in Modern Criticism
            </p>
          </div>

          <div className="pt-6">
            <span className="font-mono text-[0.6875rem] text-ink-soft block mb-1">
              SECTION TITLE &bull; 2rem (32px) &bull; PLAYFAIR 700
            </span>
            <p className="type-section-title text-ink">
              Dispatches from the Foreign Correspondents
            </p>
          </div>

          <div className="pt-6">
            <span className="font-mono text-[0.6875rem] text-ink-soft block mb-1">
              CARD TITLE &bull; 1.5rem (24px) &bull; PLAYFAIR 700
            </span>
            <p className="type-card-title text-ink">
              Typesetting the Avant-Garde: 1910&ndash;1935
            </p>
          </div>

          <div className="pt-6">
            <span className="font-mono text-[0.6875rem] text-ink-soft block mb-1">
              BODY TEXT &bull; 1.25rem (20px) at 1.7 LINE-HEIGHT &bull; SOURCE SERIF 4 &bull; MAX 68CH
            </span>
            <p className="type-body text-ink max-w-prose">
              A column of text is an engine for human contemplation. When set with disciplined proportions, the eye moves across the measure without strain, guided solely by the rhythm of punch-cut serifs and balanced counter-spaces.
            </p>
          </div>

          <div className="pt-6">
            <span className="font-mono text-[0.6875rem] text-ink-soft block mb-1">
              META & EYEBROW &bull; 11-12px UPPERCASE 0.08EM LETTER SPACING &bull; JETBRAINS MONO
            </span>
            <p className="type-meta text-accent">
              VOL. 01 &bull; NO. 43 &bull; ARCHITECTURE &bull; 6 MIN READ
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Editorial Devices */}
      <section className="space-y-6">
        <div className="pb-2 border-b border-rule">
          <h2 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold">
            03 / Editorial Devices: Drop Cap, Pull Quote, Tags & Badges
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Drop Cap Column */}
          <div className="lg:col-span-6 space-y-4">
            <span className="font-mono text-[0.6875rem] text-ink-soft block">
              DROP CAP (Playfair 900, Accent Color, 4 Lines Tall)
            </span>
            <DropCap>
              When we consider the layout of a seventeenth-century quarto or the austere geometry of the Bauhaus masters, what strikes us is not their technical limitations, but their supreme restraint. White space was not empty real estate awaiting an advertisement; it was a deliberate pause.
            </DropCap>

            <div className="pt-4 space-y-2">
              <span className="font-mono text-[0.6875rem] text-ink-soft block">
                EDITORIAL TAGS (Mono text with leading '#', not pills)
              </span>
              <div className="flex flex-wrap gap-4">
                <Tag name="typography" />
                <Tag name="architecture" />
                <Tag name="criticism" />
                <Tag name="print" />
              </div>
            </div>
          </div>

          {/* Pull Quote Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-[0.6875rem] text-ink-soft block">
              PULL QUOTE (Playfair Italic, Accent Left Rule)
            </span>
            <PullQuote
              quote="A great magazine does not shout across the room; it speaks with measured authority in a tone designed to outlast the season."
              attribution="Julian Thorne, Senior Critic"
            />

            <div className="pt-4 space-y-2">
              <span className="font-mono text-[0.6875rem] text-ink-soft block">
                STATUS BADGES (Outlined Mono Text)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="published">Published</Badge>
                <Badge variant="scheduled">Scheduled</Badge>
                <Badge variant="draft">Draft</Badge>
                <Badge variant="admin">Admin</Badge>
                <Badge variant="author">Author</Badge>
                <Badge variant="reader">Reader</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Buttons & Interactive Controls */}
      <section className="space-y-6">
        <div className="pb-2 border-b border-rule">
          <h2 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold">
            04 / Buttons & Interactive States (2px Radius Max, Zero Drop Shadows)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="solid">Solid Ink Button</Button>
          <Button variant="accent">Accent Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="destructive">
            <span className="flex items-center gap-1.5">
              <IconTrash className="w-3.5 h-3.5" />
              <span>Delete Story</span>
            </span>
          </Button>
          <Button variant="link">Text Link with Underline</Button>
          <Button variant="solid" disabled>Disabled State</Button>
        </div>
      </section>

      {/* Section 5: Form Fields & Validation */}
      <section className="space-y-6">
        <div className="pb-2 border-b border-rule">
          <h2 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold">
            05 / Form Controls & Validation (React Hook Form)
          </h2>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-xl space-y-4">
          <Input
            label="Author Byline"
            placeholder="e.g. Eleanor Vance"
            {...register('authorName', { required: 'Author byline is required' })}
            error={errors.authorName?.message}
          />

          <Input
            label="Folio Title"
            placeholder="Enter article headline..."
            {...register('folioTitle', {
              required: 'A headline is required',
              minLength: { value: 6, message: 'Headline must be at least 6 characters' }
            })}
            error={errors.folioTitle?.message}
          />

          <Select
            label="Department"
            {...register('department')}
          >
            <option value="essays">Essays</option>
            <option value="culture">Culture</option>
            <option value="technology">Technology</option>
            <option value="design">Design</option>
            <option value="criticism">Criticism</option>
          </Select>

          <Textarea
            label="Editorial Abstract"
            rows={3}
            placeholder="A short deck introducing the folio..."
            {...register('abstract')}
            helperText="Appears below headline in lead presentations"
          />

          <div className="pt-2 flex gap-3">
            <Button type="submit" variant="accent">
              Submit Folio (Validate)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
            >
              Reset Fields
            </Button>
          </div>
        </form>
      </section>

      {/* Section 6: Modal & Toast Alerts */}
      <section className="space-y-6">
        <div className="pb-2 border-b border-rule">
          <h2 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold">
            06 / Modals & Toast Alerts (Non-blocking, Hairline Borders)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" onClick={() => setModalOpen(true)}>
            Open Confirmation Modal
          </Button>

          <Button
            variant="solid"
            onClick={() => success('The revised galley proof has been committed to archive.')}
          >
            Trigger Success Toast
          </Button>

          <Button
            variant="destructive"
            onClick={() => error('Failed to delete comment: insufficient permissions.', 'DESTRUCTION REJECTED')}
          >
            <span className="flex items-center gap-1.5">
              <IconAlertTriangle className="w-3.5 h-3.5" />
              <span>Trigger Destructive Error Toast</span>
            </span>
          </Button>
        </div>

        {/* Modal component demo */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm Discard Action"
        >
          <div className="space-y-4">
            <p className="font-serif text-sm text-ink-soft leading-relaxed">
              Are you certain you wish to discard this draft? Any unsaved edits will be permanently expunged from the mock storage adapter.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-rule">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setModalOpen(false);
                  error('Draft has been permanently discarded.');
                }}
              >
                <span className="flex items-center gap-1.5">
                  <IconTrash className="w-3.5 h-3.5" />
                  <span>Discard Draft</span>
                </span>
              </Button>
            </div>
          </div>
        </Modal>
      </section>

      {/* Section 7: All 4 Post Card Variants */}
      <section className="space-y-8">
        <div className="pb-2 border-b border-rule">
          <h2 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold">
            07 / Post Card Presentations (All 4 Distinct Variants)
          </h2>
        </div>

        <div className="space-y-12">
          {/* 1. Lead Card */}
          <div>
            <span className="font-mono text-[0.6875rem] text-ink-soft block mb-4 uppercase">
              Variant A: Lead Presentation (Full-Width Hero, Deck & Large Aspect)
            </span>
            <div className="max-w-4xl">
              <PostCardLead post={leadSample} priority={false} />
            </div>
          </div>

          {/* 2. Standard Card Grid */}
          <div>
            <span className="font-mono text-[0.6875rem] text-ink-soft block mb-4 uppercase">
              Variant B: Standard Presentation (Column Grid with Excerpt)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PostCardStandard post={standardSample} />
              <PostCardStandard post={compactSample} />
            </div>
          </div>

          {/* 3. Compact Card */}
          <div>
            <span className="font-mono text-[0.6875rem] text-ink-soft block mb-4 uppercase">
              Variant C: Compact Presentation (Mono Numbered, No Image)
            </span>
            <div className="max-w-xl space-y-2">
              <PostCardCompact post={compactSample} index={1} />
              <PostCardCompact post={horizontalSample} index={2} />
              <PostCardCompact post={leadSample} index={3} />
            </div>
          </div>

          {/* 4. Horizontal Card */}
          <div>
            <span className="font-mono text-[0.6875rem] text-ink-soft block mb-4 uppercase">
              Variant D: Horizontal Presentation (Search Results & Related Posts)
            </span>
            <div className="max-w-3xl space-y-2">
              <PostCardHorizontal post={horizontalSample} />
              <PostCardHorizontal post={standardSample} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Skeletons & Loading States */}
      <section className="space-y-6">
        <div className="pb-2 border-b border-rule">
          <h2 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold">
            08 / Skeletons & Content Loading Placeholders (Shift without Glow/Blur)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonPostCard variant="standard" />
          <div className="space-y-3">
            <SkeletonPostCard variant="compact" />
            <SkeletonPostCard variant="compact" />
          </div>
          <SkeletonPostCard variant="standard" />
        </div>
      </section>
    </div>
  );
}

export default StyleguidePage;
