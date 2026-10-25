import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../ui/Toast.jsx';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { IconHeart, IconBookmark, IconShare } from '../ui/Icons.jsx';
import { likePost, bookmarkPost, getBookmarkedPosts } from '../../api/posts.js';
import { cn } from '../../utils/cn.js';

export function PostActionsRail({ post }) {
  const { user, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Local state for optimistic updates
  const [likes, setLikes] = useState(post.likes || []);
  const [hasLiked, setHasLiked] = useState(
    Boolean(user && (post.likes || []).includes(user.id))
  );

  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [guestActionName, setGuestActionName] = useState('react to');

  const postId = post.id;

  // Sync bookmark state if authenticated
  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarkedPosts,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (bookmarksData?.posts) {
      setHasBookmarked(bookmarksData.posts.some((p) => p.id === postId || p.slug === post.slug));
    }
  }, [bookmarksData, postId, post.slug]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setGuestActionName('like stories and join the readership dialogue');
      setGuestModalOpen(true);
      return;
    }

    // Optimistic toggle
    const previousLikes = [...likes];
    const previousHasLiked = hasLiked;

    if (hasLiked) {
      setLikes(likes.filter((id) => id !== user.id));
      setHasLiked(false);
    } else {
      setLikes([...likes, user.id]);
      setHasLiked(true);
    }

    try {
      const res = await likePost(postId);
      setLikes(res.likes);
      setHasLiked(res.hasLiked);
    } catch (err) {
      // Rollback on failure
      setLikes(previousLikes);
      setHasLiked(previousHasLiked);
      toastError('Unable to record like. Please try again.');
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      setGuestActionName('save stories to your personal reading list');
      setGuestModalOpen(true);
      return;
    }

    // Optimistic toggle
    const previousState = hasBookmarked;
    setHasBookmarked(!hasBookmarked);

    try {
      const res = await bookmarkPost(postId);
      setHasBookmarked(res.hasBookmarked);
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      if (res.hasBookmarked) {
        success('Story saved to your bookmarks.');
      } else {
        success('Story removed from your bookmarks.');
      }
    } catch (err) {
      // Rollback
      setHasBookmarked(previousState);
      toastError('Unable to update bookmarks. Please try again.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // user cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        success('Dispatch URL copied to clipboard.');
      } catch (e) {
        toastError('Failed to copy URL to clipboard.');
      }
    }
  };

  const handleSignInRedirect = () => {
    setGuestModalOpen(false);
    const returnTarget = encodeURIComponent(location.pathname + location.search);
    navigate(`/login?from=${returnTarget}`);
  };

  return (
    <>
      {/* Desktop Vertical Sticky Rail (>=1280px) in left margin */}
      <aside className="hidden xl:block absolute -left-16 top-0 w-10">
        <div className="sticky top-32 flex flex-col items-center gap-5 p-1.5 bg-paper border border-rule rounded-[2px]">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleLike}
            aria-label={hasLiked ? 'Unlike story' : 'Like story'}
            className={cn(
              "p-2 rounded-[2px] transition-colors relative flex flex-col items-center gap-1",
              hasLiked
                ? "text-accent bg-paper-2 border border-accent/40"
                : "text-ink-soft hover:text-accent hover:bg-paper-2"
            )}
          >
            <IconHeart className="w-5 h-5" filled={hasLiked} />
            <span className="font-mono text-[0.625rem]">{likes.length}</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmark}
            aria-label={hasBookmarked ? 'Remove bookmark' : 'Bookmark story'}
            className={cn(
              "p-2 rounded-[2px] transition-colors",
              hasBookmarked
                ? "text-accent bg-paper-2 border border-accent/40"
                : "text-ink-soft hover:text-accent hover:bg-paper-2"
            )}
          >
            <IconBookmark className="w-5 h-5" filled={hasBookmarked} />
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share story"
            className="p-2 text-ink-soft hover:text-accent hover:bg-paper-2 rounded-[2px] transition-colors"
          >
            <IconShare className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Mobile Fixed Bottom Action Bar (<1280px) */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-none border-t border-rule py-2 px-6 flex items-center justify-around">
        {/* Like */}
        <button
          type="button"
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] font-mono text-xs uppercase transition-colors",
            hasLiked ? "text-accent font-bold" : "text-ink-soft hover:text-ink"
          )}
        >
          <IconHeart className="w-4 h-4" filled={hasLiked} />
          <span>{likes.length}</span>
        </button>

        {/* Bookmark */}
        <button
          type="button"
          onClick={handleBookmark}
          className={cn(
            "p-2 rounded-[2px] transition-colors",
            hasBookmarked ? "text-accent" : "text-ink-soft hover:text-ink"
          )}
          aria-label="Save to bookmarks"
        >
          <IconBookmark className="w-4 h-4" filled={hasBookmarked} />
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="p-2 text-ink-soft hover:text-ink"
          aria-label="Share dispatch"
        >
          <IconShare className="w-4 h-4" />
        </button>
      </div>

      {/* Guest Sign-in Prompt Modal */}
      <Modal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        title="Reader Authentication Required"
      >
        <div className="space-y-4">
          <p className="font-serif text-sm text-ink-soft leading-relaxed">
            Please sign in to {guestActionName}. You will be returned directly to this story after authenticating.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-rule">
            <Button variant="outline" onClick={() => setGuestModalOpen(false)}>
              Continue Reading
            </Button>
            <Button variant="solid" onClick={handleSignInRedirect}>
              Sign In to Continue &rarr;
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
