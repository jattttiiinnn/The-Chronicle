import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminUsers, updateUserRole } from '../api/admin.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import { Seo } from '../components/Seo.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { IconAlert } from '../components/ui/Icons.jsx';

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const searchQuery = searchParams.get('q') || '';
  const roleFilter = searchParams.get('role') || 'all';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const isSimulatedError = searchParams.get('_error') === 'true';

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [roleChangePending, setRoleChangePending] = useState(null); // { user, newRole }

  // Sync local search when URL param changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounced search updates URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        const next = new URLSearchParams(searchParams);
        if (localSearch.trim()) {
          next.set('q', localSearch.trim());
        } else {
          next.delete('q');
        }
        next.set('page', '1');
        setSearchParams(next, { replace: true });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, searchParams, setSearchParams]);

  // Query users
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-users', { q: searchQuery, role: roleFilter, page: currentPage, error: isSimulatedError }],
    queryFn: () =>
      getAdminUsers({
        q: searchQuery || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        page: currentPage,
        limit: 10,
        _error: isSimulatedError ? 'true' : undefined
      }),
    keepPreviousData: true
  });

  // Mutation for updating role
  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: (updatedUser) => {
      toast.success(`Role updated: ${updatedUser.name} is now a ${updatedUser.role}.`);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setRoleChangePending(null);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update user role.';
      toast.error(msg);
      setRoleChangePending(null);
    }
  });

  const handleRoleSelect = (targetUser, newRole) => {
    if (newRole === targetUser.role) return;
    setRoleChangePending({
      user: targetUser,
      newRole
    });
  };

  const confirmRoleChange = () => {
    if (!roleChangePending) return;
    roleMutation.mutate({
      userId: roleChangePending.user.id,
      role: roleChangePending.newRole
    });
  };

  const handleFilterChange = (role) => {
    const next = new URLSearchParams(searchParams);
    if (role === 'all') {
      next.delete('role');
    } else {
      next.set('role', role);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    const next = new URLSearchParams();
    setSearchParams(next);
  };

  const users = data?.users || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
  const totalAdmins = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      <Seo title="User Directory & Permissions — Admin" noindex={true} />

      {/* Screen Reader Live Region for filter and query announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {isLoading
          ? 'Loading user directory'
          : `${pagination.total} users found. Page ${currentPage} of ${pagination.totalPages}.`}
      </div>

      {/* Header Row */}
      <div className="border-b border-rule pb-4">
        <span className="font-mono text-xs uppercase tracking-meta text-destructive block mb-1">
          DIRECTORY & ACCESS
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
            User Directory & Roles
          </h1>
          <span className="font-mono text-xs text-ink-soft uppercase tracking-meta">
            {pagination.total} registered {pagination.total === 1 ? 'user' : 'users'}
          </span>
        </div>
      </div>

      {/* Control Bar: Search & Role Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Debounced Search Input */}
        <div className="relative w-full md:w-80">
          <input
            id="user-search-input"
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by name or email..."
            aria-label="Search users by name or email"
            className="w-full bg-paper border border-rule px-3 py-2 text-sm text-ink rounded-[2px] font-sans placeholder:text-ink-soft/60 focus:outline-none focus:border-ink transition-colors"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-soft hover:text-ink"
              aria-label="Clear search query"
            >
              ×
            </button>
          )}
        </div>

        {/* Role Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter by user role"
          className="flex items-center gap-1 overflow-x-auto no-scrollbar font-mono text-xs uppercase tracking-meta"
        >
          {['all', 'reader', 'author', 'admin'].map((role) => {
            const isActive = roleFilter === role;
            return (
              <button
                key={role}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleFilterChange(role)}
                className={`px-3 py-1.5 rounded-[2px] transition-colors border ${
                  isActive
                    ? 'bg-ink text-paper border-ink font-semibold'
                    : 'bg-paper text-ink-soft hover:text-ink border-rule'
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border border-rule bg-paper space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      )}

      {/* Error State with Retry */}
      {!isLoading && isError && (
        <ErrorState
          title="Failed to Load Users"
          message={error?.response?.data?.message || error?.message || 'Unable to retrieve user registry.'}
          onRetry={() => {
            if (searchParams.get('_error')) {
              const next = new URLSearchParams(searchParams);
              next.delete('_error');
              setSearchParams(next, { replace: true });
            }
            refetch();
          }}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && users.length === 0 && (
        <EmptyState
          title="No Users Located"
          description={
            searchQuery || roleFilter !== 'all'
              ? 'No registered users match your active search and role criteria.'
              : 'The user registry is currently empty.'
          }
          actionLabel={searchQuery || roleFilter !== 'all' ? 'Reset Filters' : undefined}
          onAction={handleResetFilters}
        />
      )}

      {/* Users Table (Desktop & Tablet) */}
      {!isLoading && !isError && users.length > 0 && (
        <>
          <div className="hidden sm:block border border-rule bg-paper rounded-[2px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-rule bg-paper-2 font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft">
                  <th scope="col" className="py-3 px-4">User & Folio</th>
                  <th scope="col" className="py-3 px-4">Email</th>
                  <th scope="col" className="py-3 px-4">Current Role</th>
                  <th scope="col" className="py-3 px-4 text-center">Stories</th>
                  <th scope="col" className="py-3 px-4 text-right">Role Assignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule font-sans text-sm">
                {users.map((user) => {
                  const isCurrentAdmin = currentUser?.id === user.id;
                  const isSoleAdmin = user.role === 'admin' && totalAdmins <= 1;
                  const isRoleChangeDisabled = isCurrentAdmin || isSoleAdmin || roleMutation.isLoading;

                  return (
                    <tr key={user.id} className="hover:bg-paper-2/50 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-rule shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-mono text-xs uppercase font-bold text-ink-soft shrink-0">
                              {user.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div>
                            <span className="font-serif font-bold text-ink block leading-snug">
                              {user.name}
                            </span>
                            <span className="font-mono text-[0.6875rem] text-ink-soft uppercase tracking-meta">
                              ID: {user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 font-mono text-xs text-ink-soft">
                        {user.email}
                      </td>

                      {/* Current Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono text-[0.6875rem] uppercase tracking-meta px-2 py-0.5 border rounded-[2px] ${
                            user.role === 'admin'
                              ? 'border-destructive text-destructive font-bold'
                              : user.role === 'author'
                              ? 'border-accent text-accent font-medium'
                              : 'border-rule text-ink-soft'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Stories / Post Count */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-ink font-semibold">
                        {user.postCount || 0}
                      </td>

                      {/* Role Assignment Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {isCurrentAdmin ? (
                            <span
                              className="font-mono text-[0.6875rem] text-ink-soft uppercase tracking-meta border border-rule px-2 py-1 rounded-[2px] bg-paper-2 cursor-not-allowed"
                              title="Administrators cannot modify their own role permissions"
                            >
                              Current Account
                            </span>
                          ) : isSoleAdmin ? (
                            <span
                              className="font-mono text-[0.6875rem] text-destructive uppercase tracking-meta border border-destructive/40 px-2 py-1 rounded-[2px] bg-paper-2 cursor-not-allowed"
                              title="Cannot demote the last remaining administrator"
                            >
                              Sole Admin
                            </span>
                          ) : (
                            <select
                              id={`role-select-${user.id}`}
                              value={user.role}
                              disabled={isRoleChangeDisabled}
                              onChange={(e) => handleRoleSelect(user, e.target.value)}
                              aria-label={`Change role for ${user.name}`}
                              className="bg-paper border border-rule px-2.5 py-1 text-xs text-ink rounded-[2px] font-mono uppercase tracking-meta focus:outline-none focus:border-ink cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="reader">Reader</option>
                              <option value="author">Author</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Stacked Cards for Mobile (No Horizontal Scroll) */}
          <div className="sm:hidden space-y-4">
            {users.map((user) => {
              const isCurrentAdmin = currentUser?.id === user.id;
              const isSoleAdmin = user.role === 'admin' && totalAdmins <= 1;
              const isRoleChangeDisabled = isCurrentAdmin || isSoleAdmin || roleMutation.isLoading;

              return (
                <div
                  key={user.id}
                  className="p-4 border border-rule bg-paper rounded-[2px] space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-rule shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-mono text-xs uppercase font-bold text-ink-soft shrink-0">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <span className="font-serif font-bold text-ink text-base block leading-snug">
                          {user.name}
                        </span>
                        <span className="font-mono text-[0.6875rem] text-ink-soft block">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-[0.6875rem] uppercase tracking-meta px-2 py-0.5 border rounded-[2px] shrink-0 ${
                        user.role === 'admin'
                          ? 'border-destructive text-destructive font-bold'
                          : user.role === 'author'
                          ? 'border-accent text-accent font-medium'
                          : 'border-rule text-ink-soft'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-rule text-xs">
                    <span className="font-mono text-ink-soft uppercase tracking-meta">
                      Stories Authored: <strong className="text-ink">{user.postCount || 0}</strong>
                    </span>

                    {/* Role Control */}
                    <div>
                      {isCurrentAdmin ? (
                        <span className="font-mono text-[0.6875rem] text-ink-soft uppercase tracking-meta border border-rule px-2 py-0.5 rounded-[2px] bg-paper-2">
                          Current Account
                        </span>
                      ) : isSoleAdmin ? (
                        <span className="font-mono text-[0.6875rem] text-destructive uppercase tracking-meta border border-destructive/40 px-2 py-0.5 rounded-[2px] bg-paper-2">
                          Sole Admin
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          disabled={isRoleChangeDisabled}
                          onChange={(e) => handleRoleSelect(user, e.target.value)}
                          aria-label={`Change role for ${user.name}`}
                          className="bg-paper border border-rule px-2 py-1 text-xs text-ink rounded-[2px] font-mono uppercase tracking-meta focus:outline-none focus:border-ink"
                        >
                          <option value="reader">Reader</option>
                          <option value="author">Author</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pt-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => {
                  const next = new URLSearchParams(searchParams);
                  next.set('page', String(p));
                  setSearchParams(next);
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Role Change Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(roleChangePending)}
        onClose={() => setRoleChangePending(null)}
        onConfirm={confirmRoleChange}
        title="Confirm Role Change"
        message={
          roleChangePending
            ? `Change ${roleChangePending.user.name} from ${roleChangePending.user.role} to ${roleChangePending.newRole}?`
            : ''
        }
        confirmText="Change Role"
        cancelText="Cancel"
        isLoading={roleMutation.isLoading}
        icon={IconAlert}
      />
    </div>
  );
}
