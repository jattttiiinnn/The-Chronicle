import React, { useState, useEffect, useRef, useDeferredValue } from 'react';
import { useParams, useNavigate, Link, useBlocker } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import { useAutoSave } from '../hooks/useAutoSave.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { getPostById, createPost, updatePost, deletePost } from '../api/posts.js';
import { uploadImage } from '../api/uploads.js';
import { slugify } from '../utils/slug.js';
import { SITE_CONFIG } from '../config/site.js';
import { Seo } from '../components/Seo.jsx';
import { MarkdownRenderer } from '../components/post/MarkdownRenderer.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import {
  IconBold,
  IconItalic,
  IconHeading,
  IconQuote,
  IconCode,
  IconList,
  IconLink,
  IconImage,
  IconTrash,
  IconEye,
  IconCheck,
  IconAlert,
  IconClose,
  IconArrowLeft
} from '../components/ui/Icons.jsx';

export default function PostEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview' (for mobile)
  const [tagInput, setTagInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [slugWarningOpen, setSlugWarningOpen] = useState(false);
  const [pendingSlug, setPendingSlug] = useState('');
  const [slugConflictError, setSlugConflictError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const isSlugManualRef = useRef(false);
  const initialPublishedSlugRef = useRef('');
  const textareaRef = useRef(null);
  const hasLoadedRef = useRef(false);

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      categories: ['Design'],
      tags: [],
      coverUrl: '',
      coverPublicId: '',
      status: 'draft',
      publishAt: ''
    }
  });

  const formValues = watch();
  const watchedTitle = watch('title');
  const watchedSlug = watch('slug');
  const watchedContent = watch('content') || '';
  const watchedStatus = watch('status');
  const watchedCategories = watch('categories') || [];
  const watchedTags = watch('tags') || [];
  const watchedCoverUrl = watch('coverUrl');

  // Debounced content for live preview (150ms)
  const debouncedContent = useDebounce(watchedContent, 150);
  const deferredContent = useDeferredValue(debouncedContent);

  // Fetch existing post if editing
  const {
    data: postData,
    isLoading: isFetchingPost,
    error: fetchError
  } = useQuery({
    queryKey: ['post-edit', id],
    queryFn: () => getPostById(id),
    enabled: isEditing,
    retry: false
  });

  // Populate form on edit
  useEffect(() => {
    if (postData && (!hasLoadedRef.current || !isDirty)) {
      hasLoadedRef.current = true;
      reset({
        title: postData.title || '',
        slug: postData.slug || '',
        excerpt: postData.excerpt || '',
        content: postData.content || '',
        categories: postData.categories || ['Design'],
        tags: postData.tags || [],
        coverUrl: postData.coverUrl || '',
        coverPublicId: postData.coverPublicId || '',
        status: postData.status || 'draft',
        publishAt: postData.publishAt ? postData.publishAt.slice(0, 16) : ''
      });
      isSlugManualRef.current = true;
      if (postData.status === 'published') {
        initialPublishedSlugRef.current = postData.slug;
      }
    }
  }, [postData, isDirty, reset]);

  // Auto-sync slug from title if not manually edited
  useEffect(() => {
    if (!isSlugManualRef.current && watchedTitle) {
      const generated = slugify(watchedTitle);
      setValue('slug', generated, { shouldValidate: true, shouldDirty: false });
    }
  }, [watchedTitle, setValue]);

  // Auto-save logic
  const handleAutoSave = async (data) => {
    // Only auto-save if title has at least something
    if (!data.title || data.title.trim().length < 3) return;

    if (!isEditing) {
      // First save creates draft
      const newPost = await createPost({
        ...data,
        status: 'draft',
        slug: data.slug || slugify(data.title) || `story-${Date.now()}`
      });
      queryClient.invalidateQueries({ queryKey: ['dashboard-posts'] });
      reset(data);
      // Transition URL to edit mode without push
      navigate(`/dashboard/edit/${newPost.id}`, { replace: true });
    } else {
      // Subsequent save updates draft
      await updatePost(id, {
        ...data,
        status: 'draft'
      });
      queryClient.invalidateQueries({ queryKey: ['dashboard-posts'] });
      reset(data);
    }
  };

  const autoSaveEnabled = !isEditing || formValues.status === 'draft';
  const { saveStatus, lastSavedAt, error: autoSaveError, saveNow } = useAutoSave({
    onSave: handleAutoSave,
    data: formValues,
    isDirty,
    enabled: autoSaveEnabled,
    debounceMs: 5000
  });

  // In-app navigation blocker
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      // Exclude internal transition when auto-save assigns ID and transitions URL
      if (currentLocation.pathname === '/dashboard/new' && nextLocation.pathname.startsWith('/dashboard/edit/')) {
        return false;
      }
      return isDirty && currentLocation.pathname !== nextLocation.pathname;
    }
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setLeaveModalOpen(true);
    }
  }, [blocker.state]);

  // Toolbar action helper
  const handleInsertMarkdown = (prefix, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setValue('content', newText, { shouldDirty: true });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    }, 0);
  };

  // Inline Image prompt in Markdown
  const handleInsertImagePrompt = () => {
    const url = window.prompt('Enter Image URL:');
    if (!url) return;
    const alt = window.prompt('Enter Image Alt Text (Description):') || 'Image';
    handleInsertMarkdown(`![${alt}](`, `${url})`);
  };

  // Cover image upload handler
  const handleCoverUpload = async (file) => {
    if (!file) return;
    setUploadError(null);

    // Validate type: jpeg, png, webp only. Reject SVG!
    const name = (file.name || '').toLowerCase();
    const type = (file.type || '').toLowerCase();

    if (name.endsWith('.svg') || type.includes('svg') || (!type.startsWith('image/') && type !== '')) {
      setUploadError('Invalid file type. SVG and non-images are strictly prohibited.');
      return;
    }
    if (type && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(type)) {
      setUploadError('Allowed image formats: JPEG, PNG, WebP.');
      return;
    }
    // 5 MB size limit
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds the 5MB maximum limit.');
      return;
    }

    try {
      setUploadProgress(10);
      const res = await uploadImage(file, (pct) => setUploadProgress(pct));
      const finalUrl = res.secure_url || res.url;
      setValue('coverUrl', finalUrl, { shouldDirty: true });
      setValue('coverPublicId', res.public_id, { shouldDirty: true });
      setUploadProgress(null);
      toast.success('Cover image uploaded successfully.');
    } catch (err) {
      setUploadProgress(null);
      setUploadError(err?.message || 'Upload failed. Please retry.');
    }
  };

  // Category selection handler (max 2)
  const toggleCategory = (catName) => {
    const current = [...watchedCategories];
    const index = current.indexOf(catName);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      if (current.length >= 2) {
        toast.warning('You may select a maximum of 2 categories.');
        return;
      }
      current.push(catName);
    }
    setValue('categories', current, { shouldDirty: true });
  };

  // Tags chip handlers (max 5)
  const handleAddTag = (tagStr) => {
    const cleaned = tagStr.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();
    if (!cleaned) return;
    if (watchedTags.includes(cleaned)) return;
    if (watchedTags.length >= 5) {
      toast.warning('Maximum of 5 tags allowed.');
      return;
    }
    setValue('tags', [...watchedTags, cleaned], { shouldDirty: true });
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setValue(
      'tags',
      watchedTags.filter((t) => t !== tagToRemove),
      { shouldDirty: true }
    );
  };

  // Save / Publish / Schedule Submit Action
  const onFormSubmit = async (formData, targetStatus) => {
    setSlugConflictError(null);

    // Validation for published or scheduled
    if (targetStatus === 'published' || targetStatus === 'scheduled') {
      if (!formData.excerpt || formData.excerpt.trim().length === 0) {
        toast.error('An excerpt is required before publishing.');
        return;
      }
      if (!formData.content || formData.content.trim().length === 0) {
        toast.error('Article content is required before publishing.');
        return;
      }
      if (formData.categories.length === 0) {
        toast.error('Please select at least 1 category.');
        return;
      }
      if (targetStatus === 'scheduled') {
        if (!formData.publishAt) {
          toast.error('Please pick a future date and time for scheduled release.');
          return;
        }
        if (new Date(formData.publishAt).getTime() <= Date.now()) {
          toast.error('Scheduled publication date must be set in the future.');
          return;
        }
      }
    }

    const payload = {
      ...formData,
      status: targetStatus,
      publishAt: targetStatus === 'scheduled' ? new Date(formData.publishAt).toISOString() : null
    };

    try {
      if (isEditing) {
        await updatePost(id, payload);
        reset(payload);
        setSaveStatus('saved');
        if (targetStatus === 'published') {
          initialPublishedSlugRef.current = payload.slug;
        }
        toast.success(
          targetStatus === 'published'
            ? 'Story published live!'
            : targetStatus === 'scheduled'
            ? 'Story scheduled for release.'
            : 'Draft saved successfully.'
        );
      } else {
        const created = await createPost(payload);
        reset(payload);
        setSaveStatus('saved');
        if (targetStatus === 'published') {
          initialPublishedSlugRef.current = created.slug;
        }
        toast.success(
          targetStatus === 'published'
            ? 'Story published live!'
            : targetStatus === 'scheduled'
            ? 'Story scheduled for release.'
            : 'Draft created successfully.'
        );
        navigate(`/dashboard/edit/${created.id}`, { replace: true });
      }
      queryClient.invalidateQueries({ queryKey: ['dashboard-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (err) {
      if (err?.response?.status === 409 || err?.conflict) {
        const suggested = err?.response?.data?.suggestedSlug || `${formData.slug}-2`;
        setSlugConflictError(`Slug taken. Suggested alternative: ${suggested}`);
        toast.error('Slug conflict detected.');
      } else {
        toast.error(err?.message || 'Failed to save post.');
      }
    }
  };

  // Delete Action
  const handleDeletePost = async () => {
    if (!id) return;
    try {
      await deletePost(id);
      queryClient.invalidateQueries({ queryKey: ['dashboard-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Story deleted.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Failed to delete story.');
    }
  };

  // 403 / 404 Guard for edit mode
  if (isEditing && isFetchingPost) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isEditing && fetchError) {
    const status = fetchError?.response?.status;
    if (status === 403) {
      return (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <Seo title="403 Forbidden — Chronicle" />
          <span className="font-mono text-xs uppercase tracking-meta text-destructive">ACCESS RESTRICTED</span>
          <h1 className="font-display font-bold text-3xl text-ink">403 — Forbidden</h1>
          <p className="font-sans text-sm text-ink-soft">
            You do not have permission to edit this story. Authors can only edit their own manuscripts.
          </p>
          <div className="pt-4">
            <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
          </div>
        </div>
      );
    }
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <Seo title="404 Not Found — Chronicle" />
        <span className="font-mono text-xs uppercase tracking-meta text-ink-soft">STORY NOT FOUND</span>
        <h1 className="font-display font-bold text-3xl text-ink">404 — Not Found</h1>
        <p className="font-sans text-sm text-ink-soft">
          The requested folio does not exist or may have been deleted.
        </p>
        <div className="pt-4">
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Auto-save Status Indicator Element
  const renderSaveIndicator = () => {
    if (!autoSaveEnabled) {
      return (
        <span className="font-mono text-[0.6875rem] text-ink-soft uppercase tracking-meta">
          Manual Save Required
        </span>
      );
    }
    if (saveStatus === 'unsaved') {
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] text-amber-600 dark:text-amber-400 uppercase tracking-meta">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Unsaved changes
        </span>
      );
    }
    if (saveStatus === 'saving') {
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] text-accent uppercase tracking-meta">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          Saving...
        </span>
      );
    }
    if (saveStatus === 'saved' || lastSavedAt) {
      const timeStr = lastSavedAt
        ? lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'now';
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] text-emerald-600 dark:text-emerald-400 uppercase tracking-meta">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Saved at {timeStr}
        </span>
      );
    }
    if (saveStatus === 'error') {
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] text-destructive uppercase tracking-meta">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
          Save failed, retrying
        </span>
      );
    }
    return (
      <span className="font-mono text-[0.6875rem] text-ink-soft uppercase tracking-meta">
        Draft
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Seo title={isEditing ? `Edit: ${formValues.title || 'Story'} — Chronicle` : 'New Manuscript — Chronicle'} />

      {/* Screen reader live announcements for auto-save and errors */}
      <div role="status" aria-live="polite" className="sr-only">
        {saveStatus === 'saving' && 'Saving manuscript changes'}
        {saveStatus === 'saved' && 'All manuscript changes saved'}
        {saveStatus === 'error' && 'Failed to auto-save manuscript'}
        {slugConflictError}
      </div>

      {/* Top Navigation & Status Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rule">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-1.5 border border-rule hover:border-ink rounded-[2px] text-ink-soft hover:text-ink transition-colors"
            title="Back to Dashboard"
          >
            <IconArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.6875rem] uppercase tracking-meta text-accent">
                {isEditing ? 'EDITING MANUSCRIPT' : 'NEW DISPATCH'}
              </span>
              <span className="text-ink-soft/40">•</span>
              {renderSaveIndicator()}
            </div>
            <h1 className="font-serif font-bold text-xl text-ink line-clamp-1">
              {formValues.title || 'Untitled Manuscript'}
            </h1>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(`/posts/${formValues.slug}`, '_blank')}
              className="flex items-center gap-1.5 text-xs font-mono"
              title="Preview on Public Journal"
            >
              <IconEye className="w-3.5 h-3.5" />
              <span>Public View</span>
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSubmit((data) => onFormSubmit(data, 'draft'))}
            disabled={isSubmitting}
            className="text-xs font-mono"
          >
            Save Draft
          </Button>

          {watchedStatus === 'scheduled' ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit((data) => onFormSubmit(data, 'scheduled'))}
              disabled={isSubmitting}
              className="text-xs font-mono"
            >
              Schedule Release
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit((data) => onFormSubmit(data, 'published'))}
              disabled={isSubmitting}
              className="text-xs font-mono"
            >
              {formValues.status === 'published' ? 'Update Post' : 'Publish Now'}
            </Button>
          )}

          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setDeleteConfirmOpen(true)}
              className="p-2"
              title="Delete Story"
            >
              <IconTrash className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden border-b border-rule">
        <button
          type="button"
          onClick={() => setActiveTab('write')}
          className={`flex-1 py-2 font-mono text-xs uppercase tracking-meta text-center border-b-2 transition-colors ${
            activeTab === 'write' ? 'border-accent text-accent font-bold' : 'border-transparent text-ink-soft'
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 font-mono text-xs uppercase tracking-meta text-center border-b-2 transition-colors ${
            activeTab === 'preview' ? 'border-accent text-accent font-bold' : 'border-transparent text-ink-soft'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* Main Split Grid (50/50 Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* LEFT PANE: Editor & Meta Form */}
        <div className={`space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {/* Title & Live Counter */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="title-input" className="font-mono text-xs uppercase tracking-meta text-ink-soft">
                Title <span className="text-destructive">*</span>
              </label>
              <span className="font-mono text-[0.6875rem] text-ink-soft">
                {(watchedTitle || '').length} / 120
              </span>
            </div>
            <input
              id="title-input"
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 5, message: 'Title must be at least 5 characters' },
                maxLength: { value: 120, message: 'Title must not exceed 120 characters' }
              })}
              placeholder="e.g. The Architecture of the Printed Page"
              className="w-full bg-paper border border-rule px-4 py-2.5 font-serif text-xl font-bold text-ink rounded-[2px] focus:outline-none focus:border-ink transition-colors"
            />
            {errors.title && (
              <p className="flex items-center gap-1.5 font-mono text-xs text-destructive mt-1">
                <IconAlert className="w-3.5 h-3.5" />
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>

          {/* Slug Input & Live Conflict Feedback */}
          <div className="space-y-1">
            <label htmlFor="slug-input" className="font-mono text-xs uppercase tracking-meta text-ink-soft">
              URL Slug <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center border border-rule rounded-[2px] bg-paper-2 px-3 py-1.5 text-xs font-mono">
              <span className="text-ink-soft select-none">/posts/</span>
              <input
                id="slug-input"
                {...register('slug', {
                  required: 'Slug is required',
                  onChange: (e) => {
                    isSlugManualRef.current = true;
                    setSlugConflictError(null);
                    // Check if modifying slug of a published post
                    if (
                      initialPublishedSlugRef.current &&
                      e.target.value !== initialPublishedSlugRef.current &&
                      formValues.status === 'published'
                    ) {
                      setPendingSlug(e.target.value);
                      setSlugWarningOpen(true);
                    }
                  }
                })}
                placeholder="your-custom-slug"
                className="w-full bg-transparent text-ink focus:outline-none ml-0.5"
              />
            </div>
            {slugConflictError && (
              <p className="flex items-center gap-1.5 font-mono text-xs text-destructive mt-1">
                <IconAlert className="w-3.5 h-3.5" />
                <span>{slugConflictError}</span>
              </p>
            )}
          </div>

          {/* Excerpt with Character Counter */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="excerpt-input" className="font-mono text-xs uppercase tracking-meta text-ink-soft">
                Excerpt (Deck) <span className="text-ink-soft/60">(required to publish)</span>
              </label>
              <span className="font-mono text-[0.6875rem] text-ink-soft">
                {(formValues.excerpt || '').length} / 300
              </span>
            </div>
            <textarea
              id="excerpt-input"
              rows={3}
              {...register('excerpt', {
                maxLength: { value: 300, message: 'Excerpt must not exceed 300 characters' }
              })}
              placeholder="A short, evocative synopsis displayed on feed cards and below the article headline..."
              className="w-full bg-paper border border-rule p-3 font-serif italic text-sm text-ink rounded-[2px] focus:outline-none focus:border-ink resize-y"
            />
            {errors.excerpt && (
              <p className="flex items-center gap-1.5 font-mono text-xs text-destructive mt-1">
                <IconAlert className="w-3.5 h-3.5" />
                <span>{errors.excerpt.message}</span>
              </p>
            )}
          </div>

          {/* Markdown Toolbar & Content Textarea */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="markdown-editor" className="font-mono text-xs uppercase tracking-meta text-ink-soft">
                Manuscript Body (Markdown) <span className="text-destructive">*</span>
              </label>
              <span className="font-mono text-[0.6875rem] text-ink-soft">
                {watchedContent.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            {/* Monospace Toolbar */}
            <div className="flex items-center gap-1 p-1 bg-paper-2 border border-rule border-b-0 rounded-t-[2px] flex-wrap">
              <button
                type="button"
                onClick={() => handleInsertMarkdown('## ', '', 'Section Title')}
                aria-label="Insert Heading"
                className="p-1.5 text-ink-soft hover:text-ink hover:bg-paper rounded-[2px] transition-colors"
                title="Heading (##)"
              >
                <IconHeading className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertMarkdown('**', '**', 'bold text')}
                aria-label="Insert Bold Text"
                className="p-1.5 text-ink-soft hover:text-ink hover:bg-paper rounded-[2px] transition-colors"
                title="Bold (**text**)"
              >
                <IconBold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertMarkdown('*', '*', 'italic text')}
                aria-label="Insert Italic Text"
                className="p-1.5 text-ink-soft hover:text-ink hover:bg-paper rounded-[2px] transition-colors"
                title="Italic (*text*)"
              >
                <IconItalic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertMarkdown('> ', '', 'Pull quote text...')}
                aria-label="Insert Blockquote"
                className="p-1.5 text-ink-soft hover:text-ink hover:bg-paper rounded-[2px] transition-colors"
                title="Pull Quote (>)"
              >
                <IconQuote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertMarkdown('`', '`', 'code')}
                aria-label="Insert Inline Code"
                className="p-1.5 text-ink-soft hover:text-ink hover:bg-paper rounded-[2px] transition-colors"
                title="Inline Code (`code`)"
              >
                <IconCode className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertMarkdown('- ', '', 'List item')}
                aria-label="Insert Bullet List"
                className="p-1.5 text-ink-soft hover:text-ink hover:bg-paper rounded-[2px] transition-colors"
                title="List Item (- )"
              >
                <IconList className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertMarkdown('[', '](https://)', 'Link text')}
                aria-label="Insert Hyperlink"
                className="p-1.5 text-ink-soft hover:text-ink hover:bg-paper rounded-[2px] transition-colors"
                title="Link ([text](url))"
              >
                <IconLink className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleInsertImagePrompt}
                aria-label="Insert Image Markdown"
                className="p-1.5 text-ink-soft hover:text-ink hover:bg-paper rounded-[2px] transition-colors"
                title="Insert Image (![alt](url))"
              >
                <IconImage className="w-4 h-4" />
              </button>
            </div>

            <textarea
              id="markdown-editor"
              ref={textareaRef}
              rows={16}
              {...register('content')}
              placeholder="Begin drafting your manuscript in Markdown..."
              className="w-full bg-paper border border-rule p-4 font-mono text-xs sm:text-sm text-ink rounded-b-[2px] focus:outline-none focus:border-ink resize-y leading-relaxed"
            />
            {errors.content && (
              <p className="flex items-center gap-1.5 font-mono text-xs text-destructive mt-1">
                <IconAlert className="w-3.5 h-3.5" />
                <span>{errors.content.message}</span>
              </p>
            )}
          </div>

          {/* Categories Multi-Select Chips (Max 2) */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-meta text-ink-soft block">
              Categories <span className="text-ink-soft/60">(Max 2)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {['Design', 'Architecture', 'Typography', 'Essays', 'Technology'].map((cat) => {
                const selected = watchedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1 font-mono text-xs uppercase tracking-meta rounded-[2px] border transition-colors ${
                      selected
                        ? 'bg-accent text-paper border-accent font-semibold'
                        : 'bg-paper text-ink-soft border-rule hover:border-ink'
                    }`}
                  >
                    {selected && '✓ '}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags Chip Input (Max 5) */}
          <div className="space-y-2">
            <label htmlFor="tag-input" className="font-mono text-xs uppercase tracking-meta text-ink-soft block">
              Tags <span className="text-ink-soft/60">(Max 5, press Enter or comma)</span>
            </label>
            <div className="flex flex-wrap items-center gap-2 border border-rule p-2 rounded-[2px] bg-paper">
              {watchedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-xs bg-paper-2 border border-rule text-ink rounded-[2px]"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Remove tag ${tag}`}
                    className="hover:text-destructive"
                  >
                    <IconClose className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {watchedTags.length < 5 && (
                <input
                  id="tag-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    } else if (e.key === 'Backspace' && !tagInput && watchedTags.length > 0) {
                      handleRemoveTag(watchedTags[watchedTags.length - 1]);
                    }
                  }}
                  placeholder={watchedTags.length === 0 ? "e.g. typography, print" : ""}
                  className="bg-transparent font-mono text-xs text-ink focus:outline-none flex-1 min-w-[120px]"
                />
              )}
            </div>
          </div>

          {/* Cover Image Upload & Drag-and-Drop */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-meta text-ink-soft block">
              Lead Cover Image <span className="text-ink-soft/60">(JPEG, PNG, WebP up to 5MB)</span>
            </label>

            {watchedCoverUrl ? (
              <div className="border border-rule rounded-[2px] p-3 space-y-3 bg-paper-2">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink/5 border border-rule rounded-[2px]">
                  <img
                    src={watchedCoverUrl}
                    alt="Story cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-ink-soft truncate max-w-xs">{watchedCoverUrl}</span>
                  <div className="flex items-center gap-2">
                    <label className="text-accent hover:underline cursor-pointer">
                      Replace
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                      />
                    </label>
                    <span className="text-rule">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setValue('coverUrl', '', { shouldDirty: true });
                        setValue('coverPublicId', '', { shouldDirty: true });
                      }}
                      className="text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleCoverUpload(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-rule hover:border-ink rounded-[2px] p-6 text-center transition-colors bg-paper-2/40 cursor-pointer"
              >
                <label className="cursor-pointer block space-y-2">
                  <IconImage className="w-8 h-8 text-ink-soft mx-auto" />
                  <p className="font-sans text-sm text-ink">
                    Drag and drop an editorial image, or <span className="text-accent underline">browse</span>
                  </p>
                  <p className="font-mono text-[0.6875rem] text-ink-soft uppercase tracking-meta">
                    JPEG, PNG, WEBP (MAX 5MB) — NO SVG
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                  />
                </label>
              </div>
            )}

            {uploadProgress !== null && (
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[0.6875rem] text-ink-soft">
                  <span>Uploading image...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-paper-2 border border-rule h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-accent h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <div className="flex items-center justify-between p-2.5 bg-destructive/10 border border-destructive/20 rounded-[2px] text-xs font-mono text-destructive">
                <div className="flex items-center gap-2">
                  <IconAlert className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
                <label className="underline cursor-pointer font-bold shrink-0">
                  Retry
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Release Settings: Status & Future Date/Time Picker */}
          <div className="border-t border-rule pt-4 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-meta text-ink">
              Release Lifecycle
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status-select" className="font-mono text-xs uppercase tracking-meta text-ink-soft block mb-1">
                  Status
                </label>
                <select
                  id="status-select"
                  {...register('status')}
                  className="w-full bg-paper border border-rule px-3 py-2 text-sm text-ink rounded-[2px] font-mono focus:outline-none focus:border-ink cursor-pointer"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="scheduled">Scheduled (Future)</option>
                  <option value="published">Published (Public)</option>
                </select>
              </div>

              {watchedStatus === 'scheduled' && (
                <div>
                  <label htmlFor="publish-at-input" className="font-mono text-xs uppercase tracking-meta text-ink-soft block mb-1">
                    Publish At <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="publish-at-input"
                    type="datetime-local"
                    {...register('publishAt')}
                    className="w-full bg-paper border border-rule px-3 py-2 text-sm text-ink rounded-[2px] font-mono focus:outline-none focus:border-ink"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Live Markdown Article Preview */}
        <div
          className={`border border-rule rounded-[2px] bg-paper p-6 lg:p-8 min-h-[600px] overflow-y-auto ${
            activeTab === 'write' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-rule">
            <span className="font-mono text-xs uppercase tracking-meta text-ink-soft">
              Live Reader Preview
            </span>
            <span className="font-mono text-[0.6875rem] text-accent uppercase tracking-meta">
              68ch Editorial Measure
            </span>
          </div>

          {/* Reader Article Preview Container matching SinglePostPage */}
          <article className="max-w-prose mx-auto font-serif">
            {/* Category Eyebrow */}
            {watchedCategories.length > 0 && (
              <span className="font-mono text-xs uppercase tracking-meta text-accent block mb-2">
                {watchedCategories.join(' / ')}
              </span>
            )}

            {/* Headline */}
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink leading-tight mb-4">
              {formValues.title || 'Untitled Manuscript'}
            </h1>

            {/* Excerpt / Deck */}
            {formValues.excerpt && (
              <p className="font-serif italic text-lg sm:text-xl text-ink-soft leading-snug mb-6 border-l-2 border-accent pl-4">
                {formValues.excerpt}
              </p>
            )}

            {/* Lead Cover Image */}
            {watchedCoverUrl && (
              <figure className="my-6">
                <img
                  src={watchedCoverUrl}
                  alt={formValues.title || 'Cover image'}
                  className="w-full aspect-[16/9] object-cover rounded-[2px] border border-rule"
                />
                <figcaption className="mt-2 font-mono text-[0.6875rem] text-ink-soft uppercase tracking-meta text-center">
                  Fig. 1 — Manuscript Cover
                </figcaption>
              </figure>
            )}

            {/* Rendered Body with Drop-Cap, Pull-Quotes, Highlighted Code */}
            <div className="mt-6 border-t border-rule/50 pt-6">
              {deferredContent.trim() ? (
                <MarkdownRenderer content={deferredContent} />
              ) : (
                <p className="font-serif italic text-ink-soft/60">
                  Manuscript content preview will render here in real time...
                </p>
              )}
            </div>
          </article>
        </div>
      </div>

      {/* Warning Dialog for Editing Slug of Published Story */}
      <ConfirmDialog
        isOpen={slugWarningOpen}
        onClose={() => {
          setValue('slug', initialPublishedSlugRef.current);
          setSlugWarningOpen(false);
        }}
        onConfirm={() => {
          setSlugWarningOpen(false);
        }}
        title="Change Published URL Slug?"
        message={`This story is already published at "/posts/${initialPublishedSlugRef.current}". Changing the slug to "${pendingSlug}" will permanently break existing reader links, bookmarks, and search indexes.`}
        confirmText="Change Slug Anyway"
        cancelText="Keep Existing Slug"
        isDestructive={true}
      />

      {/* Delete Story Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeletePost}
        title="Delete Manuscript"
        message={`Are you sure you want to delete "${formValues.title || 'this manuscript'}"? All content and draft revisions will be permanently destroyed.`}
        confirmText="Delete permanently"
        isDestructive={true}
      />

      {/* Navigation Guard Leave Confirmation Dialog */}
      <ConfirmDialog
        isOpen={leaveModalOpen}
        onClose={() => {
          setLeaveModalOpen(false);
          blocker.reset?.();
        }}
        onConfirm={() => {
          setLeaveModalOpen(false);
          blocker.proceed?.();
        }}
        title="Unsaved Changes"
        message="You have unsaved manuscript changes. Leaving now will discard edits that haven't been saved."
        confirmText="Discard & Leave"
        cancelText="Stay on Page"
        isDestructive={true}
      />
    </div>
  );
}
